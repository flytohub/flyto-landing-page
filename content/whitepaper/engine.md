# Engineering Intelligence — 19-Dimension Code Analysis

flyto-engine receives structured analysis data from flyto-indexer's
`export` command and stores each dimension as an independent
`code_scan_results` row. Dashboard views can query any dimension
without parsing the full profile blob.

---

## Architecture

```
flyto-indexer (local, zero external deps)
  │
  ├─ Security ──────── taint (14 categories), SAST, secrets, IaC
  ├─ Quality ───────── complexity, dead code, duplication, tech debt, error handling
  ├─ Architecture ──── layers, import health, type contracts, API drift
  ├─ Operations ────── config drift, bus factor, perf patterns, staleness
  └─ Planning ──────── task risk, PR risk, change patterns
  │
  │  flyto-index export . --full
  │  (JSON: metadata only, no source code)
  ▼
flyto-engine (cloud)
  │
  ├─ Profile row ──────── core metrics + health score (category="profile")
  ├─ Reachability row ─── import graph + taint summary (category="reachability")
  ├─ CVE row ──────────── OSV + severity hydration (category="cve")
  ├─ config_drift row ─── .env vs code env var mismatch
  ├─ tech_debt row ────── TODO/FIXME/HACK markers
  ├─ error_handling row ── try/except coverage + issues
  ├─ api_drift row ────── frontend vs backend endpoint contract
  ├─ bus_factor row ───── contributor concentration per file
  ├─ perf_patterns row ── N+1, sync-in-async, missing timeout
  └─ import_health row ── coupling density, god modules, instability
```

---

## 7 New Analyzer Categories

### config_drift

Detects mismatches between `.env.example` and actual code references.

**Severity logic:** `issue_count > 0` → medium, else info.

```json
{
  "env_vars_defined": 12,
  "env_vars_referenced": 15,
  "issue_count": 3,
  "issues": [
    {
      "var": "SECRET_KEY",
      "category": "missing_in_env",
      "severity": "high",
      "description": "Referenced in code but not defined in any .env file"
    },
    {
      "var": "OLD_API_KEY",
      "category": "unused_in_code",
      "severity": "low",
      "description": "Defined in .env.example but never referenced in code"
    }
  ]
}
```

**Categories:** `missing_in_env` (high), `unused_in_code` (low), `missing_in_compose` (medium), `duplicate` (low).

---

### tech_debt

Scans source files for TODO/FIXME/HACK/XXX markers in comments.

**Severity logic:** `high_count > 0` → medium, else info.

```json
{
  "total_items": 42,
  "by_tag": { "TODO": 28, "FIXME": 10, "HACK": 4 },
  "by_severity": { "high": 14, "medium": 28 },
  "top_files": [["src/legacy/handler.py", 8], ["src/api/auth.go", 5]],
  "high_count": 14,
  "medium_count": 28,
  "low_count": 0
}
```

**Tag severity:** FIXME/HACK/BUG/XXX → high, TODO/DEPRECATED/WARN → medium, NOTE/OPTIMIZE → low.

---

### error_handling

Measures try/except coverage and detects anti-patterns.

**Severity logic:** `coverage_pct < 30` → medium, else info.

```json
{
  "total_functions": 120,
  "functions_with_handling": 45,
  "coverage_pct": 37.5,
  "issue_count": 8,
  "by_category": {
    "bare_except": 2,
    "empty_except": 3,
    "unhandled_async": 3
  }
}
```

**Issue categories:** `bare_except` (high), `empty_except` (high), `swallowed_error` (medium), `unhandled_async` (medium).

---

### api_drift

Compares backend route definitions with frontend call sites.

**Severity logic:** `broken_calls > 0` → high, else info.

```json
{
  "total_definitions": 25,
  "total_calls": 30,
  "matched": 22,
  "issue_count": 5,
  "broken_calls": 2,
  "dead_endpoints": 3,
  "method_mismatches": 0
}
```

**Issue categories:** `broken_call` (high — frontend calls endpoint not defined in backend), `dead_endpoint` (low), `method_mismatch` (high), `version_drift` (medium).

---

### bus_factor

Git-based analysis of contributor concentration per file.

**Severity logic:** `bus_factor_1_pct > 50` → medium, else info.

```json
{
  "total_files_analyzed": 150,
  "bus_factor_1_count": 23,
  "bus_factor_1_pct": 15.3,
  "avg_bus_factor": 2.8,
  "risk_files": [
    {
      "file": "src/core/billing.py",
      "bus_factor": 1,
      "primary_author": "alice",
      "primary_pct": 100.0
    }
  ]
}
```

**Risk signal:** Files with `bus_factor=1` and high commit count = concentrated knowledge.

---

### perf_patterns

Detects common performance anti-patterns via AST analysis (Python) and regex (JS/Go).

**Severity logic:** `total_issues > 0` → medium, else info.

```json
{
  "total_issues": 4,
  "by_category": {
    "n_plus_1": 2,
    "sync_in_async": 1,
    "missing_timeout": 1
  },
  "issues": [
    {
      "file": "src/api/users.py",
      "line": 42,
      "func": "list_users",
      "category": "n_plus_1",
      "severity": "high",
      "description": "Database call 'db.query()' inside loop - potential N+1 query"
    }
  ]
}
```

**Issue categories:** `n_plus_1` (high), `sync_in_async` (high/medium), `missing_timeout` (medium), `unbounded_fetch` (medium).

---

### import_health

Computes module coupling metrics from the dependency graph.

**Severity logic:** `god_module_count > 0` → medium, else info.

```json
{
  "total_modules": 85,
  "total_edges": 210,
  "coupling_density": 0.029,
  "avg_fan_in": 2.5,
  "avg_fan_out": 2.5,
  "avg_instability": 0.52,
  "god_module_count": 2,
  "god_modules": [
    { "path": "src/utils/helpers.py", "fan_in": 22 },
    { "path": "src/shared/types.ts", "fan_in": 18 }
  ],
  "unstable_count": 5,
  "circular_dep_count": 1
}
```

**Metrics:**
- **Fan-in (Ca):** How many modules import this one (afferent coupling).
- **Fan-out (Ce):** How many modules this one imports (efferent coupling).
- **Instability:** Ce / (Ca + Ce). 0 = fully stable, 1 = fully unstable.
- **God module:** Fan-in >= 15 (too many dependents).
- **Coupling density:** Total edges / modules^2 (lower = more modular).

---

## Database Storage

Each analyzer produces one `code_scan_results` row per scan:

```sql
SELECT category, severity, summary, data
FROM code_scan_results
WHERE scan_id = ?
ORDER BY category;
```

| category | severity | summary example |
|----------|----------|-----------------|
| `profile` | from grade | `backend B (82/100) \| 150 files \| 12 APIs ...` |
| `reachability` | info | `28 packages referenced ...` |
| `cve` | varies | `3 vulnerabilities (1 critical)` |
| `config_drift` | medium | `12 env vars defined, 3 issues` |
| `tech_debt` | medium | `42 items (FIXME: 14)` |
| `error_handling` | medium | `37.5% coverage, 8 issues` |
| `api_drift` | high | `2 broken calls, 3 dead endpoints` |
| `bus_factor` | info | `23 files with single contributor (15.3%)` |
| `perf_patterns` | medium | `4 performance anti-patterns` |
| `import_health` | medium | `85 modules, coupling 0.029, 2 god modules` |

---

## API Access

```bash
# List all results for a scan (includes all 7 new categories)
GET /api/v1/code/scans/{scan_id}/results

# Response includes all categories, each with its own severity + data JSON
```

The `data` field contains the full analyzer output as JSON string.
Parse it client-side to render dimension-specific views.

---

## Backward Compatibility

- **Missing fields:** When flyto-indexer < 2.11 uploads, the 7 new fields
  are simply absent. `parseScanUploadProfile` returns nil for each, and
  `storeEngineeringIntel` skips nil entries. Zero extra rows created.

- **Old dashboard clients:** The new rows have new category names that old
  clients don't query. They see no change. New clients opt in by querying
  the new categories.

- **No migration needed:** The `code_scan_results` table schema is
  unchanged. New categories are just new string values in the `category`
  column.

---

## Data Privacy

All 7 analyzers export **metadata only**:

| Exported | Example | Contains source code? |
|----------|---------|----------------------|
| File paths | `src/api/handler.py` | No |
| Line numbers | `42` | No |
| Counts | `issue_count: 3` | No |
| Category names | `n_plus_1` | No |
| Variable names | `SECRET_KEY` (env var name) | No |
| Author names | `alice` (git author) | No |

Source code (`content.jsonl`) is never included in any export path.
