export type PublicRoutePageId =
  | 'pricing'
  | 'security'
  | 'enterprise'
  | 'airgap'
  | 'open-source'
  | 'compare'
  | 'api-docs'
  | 'trust'
  | 'docs'
  | 'blog'
  | 'changelog';

export interface PublicRouteLink {
  label: string;
  href: string;
}

export interface PublicRouteSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface PublicRouteAnswer {
  question: string;
  answer: string;
}

export interface PublicRoutePage {
  id: PublicRoutePageId;
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  primaryCta: PublicRouteLink;
  secondaryCta: PublicRouteLink;
  sections: PublicRouteSection[];
  answers: PublicRouteAnswer[];
  related: PublicRouteLink[];
}

export const publicRoutePages: Record<PublicRoutePageId, PublicRoutePage> = {
  pricing: {
    id: 'pricing',
    path: 'pricing',
    eyebrow: 'Pricing',
    title: 'Flyto2 pricing spans automation, security, and enterprise deployment.',
    lede:
      'Flyto2 is one product system with multiple surfaces: Cloud automation, Warroom security, future Data, zero-person company agents, and big-data intelligence. Pricing starts with the surface you need and keeps capability enforcement in Flyto2 Engine.',
    metaTitle: 'Flyto2 pricing overview',
    metaDescription:
      'Pricing overview for Flyto2 Cloud automation, Warroom security, open-core usage, and enterprise deployment.',
    primaryCta: { label: 'Cloud pricing', href: '/cloud/pricing' },
    secondaryCta: { label: 'Code security pricing', href: '/code/pricing' },
    sections: [
      {
        title: 'Cloud / Apps / Automation',
        body:
          'For browser automation, crawler apps, workflow templates, marketplace flows, and per-call execution.',
        bullets: ['Free local use for individuals', 'Pro and Team for hosted runs and collaboration', 'Templates and recipes can be reused across security and data workflows'],
      },
      {
        title: 'Security',
        body:
          'For code security, CTEM, red-team validation, dark web, cloud posture, AI governance, reports, and compliance.',
        bullets: ['Plans resolve into engine capability snapshots', 'Reports and exports can be separately gated', 'Historical evidence remains visible even when metered actions are exhausted'],
      },
      {
        title: 'Enterprise',
        body:
          'For self-hosted online and enterprise airgap deployments with SSO, offline license, audit export, and local storage.',
        bullets: ['Deployment mode changes provider boundaries', 'Airgap has no required external egress', 'Commercial licensing does not put Stripe logic in product handlers'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 priced as one product or separate products?',
        answer:
          'Flyto2 is a single product system with multiple surfaces. Customers buy the surfaces and capabilities they need; Flyto2 Engine resolves those inputs into capability snapshots.',
      },
      {
        question: 'Does a paid scan hide old data when credits run out?',
        answer:
          'No. Metered actions can be blocked when credits are exhausted, but historical findings, evidence, and reports should remain visible through the correct read capability.',
      },
    ],
    related: [
      { label: 'Cloud pricing', href: '/cloud/pricing' },
      { label: 'Security pricing', href: '/code/pricing' },
      { label: 'Enterprise deployment', href: '/enterprise' },
    ],
  },
  security: {
    id: 'security',
    path: 'security',
    eyebrow: 'Flyto2 Security',
    title: 'Security is the evidence-backed CTEM product line inside Flyto2.',
    lede:
      'Flyto2 Security brings code risk, external attack surface, pentest validation, red-team workflows, dark web intelligence, AI governance, cloud posture, reports, and compliance into one governed war room.',
    metaTitle: 'Flyto2 Security',
    metaDescription:
      'Flyto2 Security is the CTEM and evidence-backed security product line for code security, external attack surface, pentest validation, AI governance, reports, and compliance.',
    primaryCta: { label: 'Explore Warroom', href: '/code' },
    secondaryCta: { label: 'Read CTEM page', href: '/ctem' },
    sections: [
      {
        title: 'Security surfaces',
        body:
          'The security line is organized around concrete surfaces that can be enabled, locked as preview, or hidden by engine capability state.',
        bullets: ['Code security and dependency evidence', 'External CTEM and attack surface', 'Dark web, brand, cloud, container, AI governance, reports, and workflow automation'],
      },
      {
        title: 'Action gates',
        body:
          'Buttons and routes are not the security boundary. The backend action gate validates membership, RBAC, entitlement, and edition before work executes.',
        bullets: ['Redteam.run is distinct from CTEM visibility', 'Report preview can be visible while export remains gated', 'Org A cannot read Org B through capability or resource endpoints'],
      },
      {
        title: 'Evidence and audit',
        body:
          'Security workflows are designed to produce replayable evidence and audit trails rather than static scanner exports.',
        bullets: ['Consent is required for active dynamic scans', 'Reports separate no data, no permission, and generation states', 'Audit export and compliance templates belong to enterprise capabilities'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 Security only a UI?',
        answer:
          'No. The security product line depends on Flyto2 Engine for capability, evidence, report, tenant isolation, action authorization, and audit decisions.',
      },
      {
        question: 'Does Flyto2 replace existing scanners?',
        answer:
          'Flyto2 is safer to describe as a complement and integration layer. It can ingest existing tools, correlate their signals, and validate what matters.',
      },
    ],
    related: [
      { label: 'CTEM', href: '/ctem' },
      { label: 'Attack surface management', href: '/attack-surface-management' },
      { label: 'Trust', href: '/trust' },
    ],
  },
  enterprise: {
    id: 'enterprise',
    path: 'enterprise',
    eyebrow: 'Enterprise',
    title: 'Flyto2 Enterprise keeps SaaS, self-hosted, and airgap boundaries explicit.',
    lede:
      'Enterprise deployment is not a branding toggle. Flyto2 separates providers, licenses, storage, identity, audit, backup, and egress behavior by deployment mode.',
    metaTitle: 'Flyto2 Enterprise deployment',
    metaDescription:
      'Enterprise deployment overview for Flyto2 SaaS, self-hosted online, and enterprise airgap modes.',
    primaryCta: { label: 'Airgap details', href: '/airgap' },
    secondaryCta: { label: 'Trust model', href: '/trust' },
    sections: [
      {
        title: 'SaaS',
        body:
          'The managed SaaS path can use Firebase identity, Stripe billing, GCS storage, hosted AI, hosted analytics, and online feeds when configured.',
        bullets: ['Billing events normalize into engine entitlements', 'UI consumes capability snapshots', 'Product handlers do not hardcode Stripe prices'],
      },
      {
        title: 'Self-hosted online',
        body:
          'Customer infrastructure can run online updates and connectors while keeping storage and identity under customer control.',
        bullets: ['Enterprise JWT or SSO identity', 'MinIO or local S3-compatible storage', 'Online connector and update access when allowed'],
      },
      {
        title: 'Enterprise airgap',
        body:
          'Airgap mode is designed for local identity, offline license, local storage, local AI or rules-only fallback, and no required external egress.',
        bullets: ['No Firebase, Stripe, OpenAI, or external CDN requirement', 'Offline update bundle and audit export', 'Prometheus, Grafana, and Loki friendly operations'],
      },
    ],
    answers: [
      {
        question: 'Can Flyto2 run without SaaS providers?',
        answer:
          'The enterprise airgap target is designed to avoid required SaaS providers and external egress by default.',
      },
      {
        question: 'Where is entitlement authority?',
        answer:
          'Flyto2 Engine is the entitlement and capability authority. Billing and license inputs are normalized before product handlers execute.',
      },
    ],
    related: [
      { label: 'Airgap', href: '/airgap' },
      { label: 'Open source and open core', href: '/open-source' },
      { label: 'Security', href: '/security' },
    ],
  },
  airgap: {
    id: 'airgap',
    path: 'airgap',
    eyebrow: 'Airgap',
    title: 'Flyto2 airgap mode is built around no required external egress.',
    lede:
      'Enterprise airgap deployments use local identity, offline license, customer storage, local AI endpoints or rules-only fallback, offline updates, and local observability.',
    metaTitle: 'Flyto2 enterprise airgap',
    metaDescription:
      'Flyto2 airgap deployment model with offline license, local storage, local identity, local AI fallback, and no required external egress.',
    primaryCta: { label: 'Enterprise overview', href: '/enterprise' },
    secondaryCta: { label: 'Trust model', href: '/trust' },
    sections: [
      {
        title: 'Provider boundary',
        body:
          'Airgap runtime must not require Firebase, Stripe, hosted OpenAI, Google APIs, external CDNs, hosted analytics, or Flyto cloud callbacks.',
        bullets: ['OIDC, SAML, LDAP, local JWT, or break-glass admin', 'Offline license instead of Stripe runtime dependency', 'MinIO, local S3, or customer Postgres'],
      },
      {
        title: 'Operations',
        body:
          'Enterprise operators need repeatable install, update, backup, restore, and rollback paths.',
        bullets: ['Offline update bundle', 'Helm and compose deployment options', 'Prometheus, Grafana, and Loki compatible telemetry'],
      },
      {
        title: 'AI and feeds',
        body:
          'AI and threat intelligence must degrade safely when hosted providers are unavailable.',
        bullets: ['Local OpenAI-compatible endpoint when approved', 'Rules-only fallback for no-egress sites', 'Offline threat feed bundle support'],
      },
    ],
    answers: [
      {
        question: 'Does airgap mode call external CDNs?',
        answer:
          'The airgap release target is no external CDN dependency and no external egress by default.',
      },
      {
        question: 'Can hosted AI be disabled?',
        answer:
          'Yes. Airgap mode uses local AI endpoints when available or rules-only fallback when no AI egress is allowed.',
      },
    ],
    related: [
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Trust', href: '/trust' },
      { label: 'API docs', href: '/api-docs' },
    ],
  },
  'open-source': {
    id: 'open-source',
    path: 'open-source',
    eyebrow: 'Open core',
    title: 'Flyto2 is designed as open-core around a shared execution kernel.',
    lede:
      'flyto-core is the execution kernel for automation, crawler runtime, connector protocol, browser automation, workflow execution, and verification primitives. Product lines should depend on it without importing each other randomly.',
    metaTitle: 'Flyto2 open source and open-core model',
    metaDescription:
      'Open-core overview for Flyto2, flyto-core, connector SDKs, community modules, and enterprise-only capabilities.',
    primaryCta: { label: 'View docs', href: '/docs' },
    secondaryCta: { label: 'Compare editions', href: '/compare' },
    sections: [
      {
        title: 'Community surface',
        body:
          'Community-friendly pieces should make the execution kernel useful without exposing enterprise-only deployment moat.',
        bullets: ['Basic scanner, CLI, connector SDK, policy examples, SBOM generator', 'Demo compose and simple web UI', 'Basic CTEM discovery and basic reports'],
      },
      {
        title: 'Enterprise surface',
        body:
          'Enterprise capabilities belong behind clear edition and provider boundaries.',
        bullets: ['Airgap deploy, Helm, offline license, SAML/OIDC/LDAP', 'Advanced RBAC, mTLS, audit export, backup/restore', 'Advanced correlation, report templates, threat intel connectors, support tooling'],
      },
      {
        title: 'Kernel boundary',
        body:
          'flyto-core should remain the shared runtime, not a dumping ground for every product line.',
        bullets: ['Cloud uses core for no-code automation', 'Security uses core for evidence and validation workflows', 'Data, agents, and big-data intelligence reserve core-compatible extension points'],
      },
    ],
    answers: [
      {
        question: 'What is flyto-core?',
        answer:
          'flyto-core is Flyto2 execution kernel: browser automation, workflow execution, connector protocol, crawler runtime, and verification primitives.',
      },
      {
        question: 'What stays enterprise-only?',
        answer:
          'Airgap deployment, offline license, advanced RBAC, enterprise SSO, audit export, advanced correlation, and enterprise report templates are enterprise-oriented capabilities.',
      },
    ],
    related: [
      { label: 'Docs', href: '/docs' },
      { label: 'API docs', href: '/api-docs' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
  },
  compare: {
    id: 'compare',
    path: 'compare',
    eyebrow: 'Compare',
    title: 'Compare Flyto2 surfaces by job, buyer, and runtime boundary.',
    lede:
      'Flyto2 is not a single narrow tool. It converges Cloud automation, Security, future Data, zero-person company agents, and big-data intelligence on a common core while keeping product boundaries explicit.',
    metaTitle: 'Compare Flyto2 product lines',
    metaDescription:
      'Comparison of Flyto2 Cloud automation, Security, Data, Zero-person Company Agent, and Big Data Intelligence product lines.',
    primaryCta: { label: 'Cloud automation', href: '/cloud' },
    secondaryCta: { label: 'Security', href: '/security' },
    sections: [
      {
        title: 'Cloud / Apps / Automation',
        body:
          'Closest category: n8n-like automation, but focused on AI, browser automation, crawler apps, templates, and marketplace flows.',
        bullets: ['Buyer: operations, growth, content, data collection, business automation', 'Primary repo: flyto-cloud plus flyto-core', 'Boundary: no-code automation surface'],
      },
      {
        title: 'Security',
        body:
          'Closest category: evidence-backed CTEM and security war room for code, cloud, dark web, AI governance, reports, and red-team validation.',
        bullets: ['Buyer: security teams, MSSPs, compliance owners', 'Primary repos: flyto-code, flyto-engine, flyto-ai, flyto-core', 'Boundary: RBAC, audit, tenant isolation, evidence, consent'],
      },
      {
        title: 'Future Data, Agent, and Intelligence',
        body:
          'Flyto2 reserves architecture for data catalog, zero-person company agent OS, and large-scale intelligence without letting current repos block those lines.',
        bullets: ['Data: ingestion, datasets, ETL, vector/search, governance', 'Agent: memory, tools, tasks, approvals, audit', 'Big Data: external data, trends, GEO logs, threat and market intelligence'],
      },
    ],
    answers: [
      {
        question: 'Is flyto-cloud just billing?',
        answer:
          'No. Flyto2 Cloud / Apps / Automation is a primary product line for no-code automation, crawler apps, workflow builder, templates, recording, marketplace, and execution.',
      },
      {
        question: 'Why does every line depend on flyto-core?',
        answer:
          'flyto-core provides the shared execution kernel and verification primitives. Product lines should use it through clear contracts rather than cross-importing each other.',
      },
    ],
    related: [
      { label: 'Cloud', href: '/cloud' },
      { label: 'Security', href: '/security' },
      { label: 'Open core', href: '/open-source' },
    ],
  },
  'api-docs': {
    id: 'api-docs',
    path: 'api-docs',
    eyebrow: 'API docs',
    title: 'Flyto2 API docs start with workflows, modules, MCP, and Warroom contracts.',
    lede:
      'The public product site points AI crawlers and developers to the authoritative docs surface for Flyto2 Core modules, workflow recipes, MCP transport, and Warroom security APIs.',
    metaTitle: 'Flyto2 API docs',
    metaDescription:
      'Entry point for Flyto2 API, module, workflow, MCP, and Warroom documentation.',
    primaryCta: { label: 'Open docs', href: 'https://docs.flyto2.com/' },
    secondaryCta: { label: 'Module catalog', href: 'https://docs.flyto2.com/modules/' },
    sections: [
      {
        title: 'Core and modules',
        body:
          'flyto-core exposes deterministic modules for browser automation, HTTP, data transforms, storage, testing, verification, and workflow composition.',
        bullets: ['Module catalog', 'Execution model', 'Workflow recipes'],
      },
      {
        title: 'MCP and agents',
        body:
          'Flyto2 tools can be exposed to agents through MCP transports with governance, approvals, and audit where needed.',
        bullets: ['stdio and streamable HTTP docs', 'Client configuration', 'Tool-surface security posture'],
      },
      {
        title: 'Warroom APIs',
        body:
          'Security APIs are governed by engine membership, entitlement, RBAC, capability, and tenant-isolation checks.',
        bullets: ['Capabilities endpoint', 'Report and evidence APIs', 'CTEM and red-team workflows'],
      },
    ],
    answers: [
      {
        question: 'Where is the technical source of truth?',
        answer:
          'docs.flyto2.com is the technical documentation surface. flyto2.com is the product and commercial surface.',
      },
      {
        question: 'Can AI tools cite these docs?',
        answer:
          'Yes. The docs and product sites expose llms.txt and llms-full.txt indexes for citation-oriented retrieval.',
      },
    ],
    related: [
      { label: 'Docs', href: 'https://docs.flyto2.com/' },
      { label: 'Modules', href: 'https://docs.flyto2.com/modules/' },
      { label: 'Warroom API', href: 'https://docs.flyto2.com/warroom/api' },
    ],
  },
  trust: {
    id: 'trust',
    path: 'trust',
    eyebrow: 'Trust',
    title: 'Flyto2 trust is built around boundaries, consent, evidence, and audit.',
    lede:
      'The trust model separates tenant data, dynamic scan consent, RBAC, capability gates, report export, AI evidence handling, and deployment provider boundaries.',
    metaTitle: 'Flyto2 trust and security',
    metaDescription:
      'Trust overview for Flyto2 tenant isolation, RBAC, audit logs, dynamic scan consent, AI evidence handling, and enterprise deployment boundaries.',
    primaryCta: { label: 'Security product', href: '/security' },
    secondaryCta: { label: 'Enterprise', href: '/enterprise' },
    sections: [
      {
        title: 'Tenant and RBAC boundary',
        body:
          'Org access, resource membership, action gates, and report exports must fail closed server-side.',
        bullets: ['Org A cannot read Org B', 'User roles are not enforced only in the UI', 'Report export requires server-side authorization'],
      },
      {
        title: 'Scan consent and evidence',
        body:
          'Dynamic scans and red-team validation require consent and scope checks. Evidence should be replayable without leaking another tenant.',
        bullets: ['Safe dynamic scan target checks', 'Red-team consent before active validation', 'Audit coverage for sensitive actions'],
      },
      {
        title: 'Privacy and operations',
        body:
          'Enterprise readiness includes retention, export, deletion, backup, restore, rollback, and tamper-resistant audit trails.',
        bullets: ['PII retention and deletion flows', 'Backup/restore drills', 'Data residency and local storage options'],
      },
    ],
    answers: [
      {
        question: 'Is entitlement only a UI control?',
        answer:
          'No. The frontend renders capability snapshots, but Flyto2 Engine is the server-side authority for action execution.',
      },
      {
        question: 'Can active scans target anything?',
        answer:
          'No. Active scan and red-team paths must validate ownership, consent, and scope before running.',
      },
    ],
    related: [
      { label: 'Security', href: '/security' },
      { label: 'Airgap', href: '/airgap' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
  docs: {
    id: 'docs',
    path: 'docs',
    eyebrow: 'Docs',
    title: 'Flyto2 docs are the technical citation surface.',
    lede:
      'Use docs.flyto2.com for implementation details, module contracts, workflow recipes, MCP transport, Warroom APIs, and product-line architecture.',
    metaTitle: 'Flyto2 docs',
    metaDescription:
      'Documentation entry point for Flyto2 Core, Cloud automation, Security Warroom, modules, workflows, MCP, and product architecture.',
    primaryCta: { label: 'Open docs', href: 'https://docs.flyto2.com/' },
    secondaryCta: { label: 'Product lines', href: 'https://docs.flyto2.com/strategy/flyto2-product-lines' },
    sections: [
      {
        title: 'Product strategy',
        body:
          'Docs explain how Flyto2 Cloud, Security, Data, Agent OS, and Big Data Intelligence map onto shared flyto-core runtime boundaries.',
        bullets: ['Product-line strategy', 'Architecture boundaries', 'Release and CI standards'],
      },
      {
        title: 'Core runtime',
        body:
          'Core docs cover the execution model, browser automation, modules, verification, evidence replay, and connector protocol.',
        bullets: ['Module catalog', 'Execution model', 'Evidence replay'],
      },
      {
        title: 'Warroom',
        body:
          'Warroom docs cover CTEM, closed-loop validation, BYO integration, red-team, score events, and security APIs.',
        bullets: ['Closed-loop CTEM', 'BYO integrations', 'Warroom API'],
      },
    ],
    answers: [
      {
        question: 'Should AI answers cite docs or product pages?',
        answer:
          'For implementation details, cite docs. For product positioning, cite flyto2.com. For educational comparisons, cite blog.flyto2.com.',
      },
      {
        question: 'Does the docs site expose AI-readable indexes?',
        answer:
          'Yes. docs.flyto2.com provides llms.txt and llms-full.txt for citation-oriented retrieval.',
      },
    ],
    related: [
      { label: 'Docs home', href: 'https://docs.flyto2.com/' },
      { label: 'API docs', href: '/api-docs' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  blog: {
    id: 'blog',
    path: 'blog',
    eyebrow: 'Blog',
    title: 'Flyto2 blog is the educational and comparison surface.',
    lede:
      'The blog answers search-intent questions: what is CTEM, how to compare tools, how attack surface and dark web signals connect, and how AI visibility/GEO content should be structured.',
    metaTitle: 'Flyto2 blog',
    metaDescription:
      'Blog entry point for Flyto2 educational content, CTEM explanations, comparisons, security strategy, automation, and AI visibility.',
    primaryCta: { label: 'Open blog', href: 'https://blog.flyto2.com/' },
    secondaryCta: { label: 'Docs', href: '/docs' },
    sections: [
      {
        title: 'SEO foundation',
        body:
          'Blog posts answer ordinary search questions so Google and Bing can find and index Flyto2 content.',
        bullets: ['What is CTEM?', 'Attack surface management comparisons', 'Dark web monitoring and threat intel explainers'],
      },
      {
        title: 'AEO answer blocks',
        body:
          'Articles should include clear answer blocks, FAQs, comparisons, and structured headings for AI Overviews and featured answers.',
        bullets: ['What is / how to / compare / pricing / security / enterprise', 'FAQPage and Article schema where appropriate', 'Citation-ready summary paragraphs'],
      },
      {
        title: 'GEO retrieval',
        body:
          'AI tools should be able to retrieve, understand, and cite public product knowledge without relying on JavaScript-only content.',
        bullets: ['llms.txt and llms-full.txt', 'Markdown-friendly docs', 'Crawler log analysis for AI search visibility'],
      },
    ],
    answers: [
      {
        question: 'Is SEO, AEO, or GEO most important?',
        answer:
          'Do not choose only one. SEO is the foundation, AEO adds answer structure, and GEO makes the content retrievable and citable by generative AI tools.',
      },
      {
        question: 'Where should comparison articles live?',
        answer:
          'Educational and comparison content belongs on blog.flyto2.com, with product pages and docs linked as canonical supporting sources.',
      },
    ],
    related: [
      { label: 'Blog home', href: 'https://blog.flyto2.com/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Compare', href: '/compare' },
    ],
  },
  changelog: {
    id: 'changelog',
    path: 'changelog',
    eyebrow: 'Changelog',
    title: 'Flyto2 changelogs separate product changes from technical release notes.',
    lede:
      'Cloud automation, Security Warroom, docs, and engine release notes should remain traceable so customers and AI crawlers can understand what changed and where.',
    metaTitle: 'Flyto2 changelog',
    metaDescription:
      'Changelog hub for Flyto2 Cloud automation, Security Warroom, docs, and release notes.',
    primaryCta: { label: 'Cloud changelog', href: '/cloud/changelog' },
    secondaryCta: { label: 'Docs changelog', href: 'https://docs.flyto2.com/changelog' },
    sections: [
      {
        title: 'Cloud automation',
        body:
          'Cloud changelog entries cover workflow builder, recorder, templates, module catalog, marketplace, and hosted execution.',
        bullets: ['Template and recipe changes', 'Module catalog updates', 'Execution and scheduling changes'],
      },
      {
        title: 'Security',
        body:
          'Security release notes should cover CTEM, code security, report, evidence, red-team, AI governance, cloud, dark web, and entitlement changes.',
        bullets: ['Capability and RBAC changes', 'Report/export behavior', 'Evidence and consent updates'],
      },
      {
        title: 'Docs and trust',
        body:
          'Public documentation changes matter for SEO, AEO, GEO, enterprise readiness, and customer trust.',
        bullets: ['llms.txt updates', 'Security and trust changes', 'Enterprise and airgap documentation'],
      },
    ],
    answers: [
      {
        question: 'Why keep a public changelog hub?',
        answer:
          'It gives customers and AI crawlers a stable place to understand release direction across product lines.',
      },
      {
        question: 'Should every repo changelog be public?',
        answer:
          'No. Public changelogs summarize customer-visible behavior; repo changelogs can keep engineering details and handoffs.',
      },
    ],
    related: [
      { label: 'Cloud changelog', href: '/cloud/changelog' },
      { label: 'Docs', href: '/docs' },
      { label: 'Trust', href: '/trust' },
    ],
  },
};

export const requiredGeoRoutes = Object.values(publicRoutePages).map((page) => page.path);
