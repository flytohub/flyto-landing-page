export type PublicRoutePageId =
  | 'pricing'
  | 'security'
  | 'enterprise'
  | 'airgap'
  | 'open-source'
  | 'aikido-alternative'
  | 'n8n-alternative'
  | 'zapier-alternative'
  | 'make-alternative'
  | 'playwright-alternative'
  | 'langgraph-alternative'
  | 'compare'
  | 'api-docs'
  | 'trust'
  | 'community'
  | 'support'
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

const WARROOM_CE_GITHUB = 'https://github.com/flytohub/flyto-warroom';
const WARROOM_CE_DOCKER = 'https://hub.docker.com/r/chesterhsu/flyto-warroom';
const WARROOM_CE_DOCS = 'https://docs.flyto2.com/warroom/self-hosted-ce';

export const publicRoutePages: Record<PublicRoutePageId, PublicRoutePage> = {
  pricing: {
    id: 'pricing',
    path: 'pricing',
    eyebrow: 'Pricing',
    title: 'Flyto2 pricing starts with Warroom CE and scales into Enterprise.',
    lede:
      'Flyto2 Warroom CE is the installable self-hosted baseline. Enterprise pricing unlocks the governed bridge for cloud-backed intelligence, managed remediation, fleet execution, SSO, airgap, support, and compliance controls for CTEM, attack surface management, and security automation programs.',
    metaTitle: 'Flyto2 pricing overview',
    metaDescription:
      'Pricing overview for Flyto2 Warroom CE, open-core attack surface management, CTEM security automation, Enterprise bridge capabilities, and deployment modes.',
    primaryCta: { label: 'Start with Warroom CE', href: '/open-source' },
    secondaryCta: { label: 'Enterprise deployment', href: '/enterprise' },
    sections: [
      {
        title: 'Community Edition',
        body:
          'CE is the public self-hosted path for teams that want to evaluate an open-core security war room, open source attack surface management workflow, and CTEM validation loop locally before buying managed capabilities.',
        bullets: ['Local JWT auth, local database, Docker Compose, and installer scripts', 'Code intelligence, CTEM posture, evidence, scoring, reports, and compliance surfaces', 'Public contracts keep CE aligned with Flyto2 Engine, Core, Code, and i18n'],
      },
      {
        title: 'Enterprise bridge',
        body:
          'Enterprise adds commercial services without turning the open repository into a private source dump.',
        bullets: ['Commercial threat intelligence, managed runner fleets, and live remediation orchestration', 'AI proposal review, premium reports, and advanced correlation are gated by capability and entitlement', 'Premium actions fail closed on missing license, denied role, connector error, or invalid evidence signature'],
      },
      {
        title: 'Deployment and governance',
        body:
          'Enterprise packaging covers teams that need identity, audit, residency, support, and airgap boundaries.',
        bullets: ['SSO/SAML/SCIM, RBAC, audit export, legal hold, retention, and support SLAs', 'Self-hosted online and enterprise airgap deployment modes', 'Commercial licensing stays in the engine entitlement layer, not scattered across product handlers'],
      },
    ],
    answers: [
      {
        question: 'Can teams start without talking to sales?',
        answer:
          'Yes. Flyto2 Warroom CE is the public installable baseline on GitHub and Docker Hub. Teams can evaluate the war room locally, then attach Enterprise services when they need managed intelligence, remediation, identity, or support.',
      },
      {
        question: 'Does a paid gate hide old evidence when credits run out?',
        answer:
          'No. Metered actions can be blocked when credits are exhausted, but historical findings, evidence, and reports should remain visible through the correct read capability.',
      },
      {
        question: 'What is the commercial boundary?',
        answer:
          'CE contains the open-core product and public contracts. Enterprise-only code, commercial datasets, managed remediation, enterprise identity, offline license, support tooling, and premium cloud bridge execution stay gated.',
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'GitHub repository', href: WARROOM_CE_GITHUB },
      { label: 'Self-hosted docs', href: WARROOM_CE_DOCS },
      { label: 'Enterprise deployment', href: '/enterprise' },
    ],
  },
  security: {
    id: 'security',
    path: 'security',
    eyebrow: 'Flyto2 Security',
    title: 'Flyto2 Security is the security automation platform above your existing stack.',
    lede:
      'Flyto2 Security is a security automation platform that starts as installable Warroom CE and grows into an Enterprise bridge. Bring ASM, SAST, DAST, CSPM, SIEM, dark web, cloud, code, and scanner findings; Flyto2 turns them into verified attack paths, pentest evidence, red-team scenarios, remediation records, and compliance-ready proof.',
    metaTitle: 'Security automation platform for BYO validation',
    metaDescription:
      'Flyto2 is a security automation platform that turns ASM, EASM, CTEM, code, and scanner findings into verified attack paths, evidence, reports, and remediation records.',
    primaryCta: { label: 'Install Warroom CE', href: '/open-source' },
    secondaryCta: { label: 'Read CTEM page', href: '/ctem' },
    sections: [
      {
        title: 'Self-hosted baseline',
        body:
          'Warroom CE gives teams a public, local offensive-validation cockpit before they attach premium data, identity, support, or managed execution.',
        bullets: ['GitHub and Docker Hub distribution', 'Local orgs, evidence, reports, scoring, and compliance surfaces', 'BYO findings stay source-labeled and bridge-ready'],
      },
      {
        title: 'Existing tools are inputs',
        body:
          'The security line is organized around concrete inputs and validation outputs that can be enabled, locked as preview, or hidden by engine capability state. Teams evaluating attack surface management software, external attack surface management tools, CTEM security, or a security automation platform can use Flyto2 to correlate and validate findings without treating it as a replacement for every scanner.',
        bullets: ['ASM, EASM, SAST, DAST, SCA, CSPM, CNAPP, SIEM, and dark web findings', 'Attack-path hypotheses and safe validation plans', 'Evidence, remediation records, red-team scenarios, and reports'],
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
          'Security workflows are designed to prove what is exploitable rather than adding another static scanner export.',
        bullets: ['Consent is required for active dynamic scans', 'Reports separate no data, no permission, and generation states', 'Evidence packs include replay, screenshots, DOM snapshots, network/API logs, and remediation context'],
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
          'No. Flyto2 is the offensive validation layer above existing tools. It ingests their findings, correlates attack paths, validates what is safe to test, and returns evidence and remediation records.',
      },
    ],
    related: [
      { label: 'Open source and CE', href: '/open-source' },
      { label: 'CTEM', href: '/ctem' },
      { label: 'Attack surface management', href: '/attack-surface-management' },
      { label: 'Self-hosted docs', href: WARROOM_CE_DOCS },
    ],
  },
  enterprise: {
    id: 'enterprise',
    path: 'enterprise',
    eyebrow: 'Enterprise',
    title: 'Flyto2 Enterprise keeps SaaS, self-hosted, and airgap boundaries explicit.',
    lede:
      'Enterprise deployment is not a branding toggle. Flyto2 Warroom CE is the self-hosted baseline; Enterprise adds explicit provider, license, storage, identity, audit, backup, support, and egress boundaries.',
    metaTitle: 'Flyto2 Enterprise deployment',
    metaDescription:
      'Enterprise deployment overview for Flyto2 SaaS, self-hosted online, and enterprise airgap modes.',
    primaryCta: { label: 'Airgap details', href: '/airgap' },
    secondaryCta: { label: 'Start with CE', href: '/open-source' },
    sections: [
      {
        title: 'Community baseline',
        body:
          'The public CE line proves the war room can be installed, inspected, tested, and patched without waiting for a private sales path.',
        bullets: ['Public GitHub repository and Docker images', 'Local database, local auth, evidence timeline, and report surfaces', 'Contribution loop feeds accepted CE changes back upstream'],
      },
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
      { label: 'Warroom CE docs', href: WARROOM_CE_DOCS },
    ],
  },
  airgap: {
    id: 'airgap',
    path: 'airgap',
    eyebrow: 'Airgap',
    title: 'Flyto2 airgap mode is built around no required external egress.',
    lede:
      'Flyto2 Warroom CE covers self-hosted online evaluation. Enterprise airgap goes further: local identity, offline license, customer storage, local AI endpoints or rules-only fallback, offline updates, and local observability with no required external egress.',
    metaTitle: 'Flyto2 enterprise airgap',
    metaDescription:
      'Flyto2 airgap deployment model with offline license, local storage, local identity, local AI fallback, and no required external egress.',
    primaryCta: { label: 'Enterprise overview', href: '/enterprise' },
    secondaryCta: { label: 'Trust model', href: '/trust' },
    sections: [
      {
        title: 'Provider boundary',
        body:
          'Airgap runtime must not require Firebase, Stripe, hosted OpenAI, Google APIs, external CDNs, hosted analytics, Flyto2 cloud callbacks, Docker Hub pulls, or public GitHub access at runtime.',
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
      { label: 'Self-hosted CE', href: '/open-source' },
      { label: 'Trust', href: '/trust' },
    ],
  },
  'open-source': {
    id: 'open-source',
    path: 'open-source',
    eyebrow: 'Open core',
    title: 'Flyto2 Warroom CE is an open source security war room.',
    lede:
      'Flyto2 Warroom CE is an installable open source security war room for teams that want local BYO offensive validation. Bring your own ASM, SAST, DAST, CSPM, SIEM, dark web, cloud, code, and scanner findings; Flyto2 turns them into verified attack paths, pentest evidence, red-team scenarios, remediation records, scoring, and compliance-ready proof. Flyto2 Core remains the open-source automation runtime underneath the broader Flyto2 product line.',
    metaTitle: 'Open source security war room | Warroom CE',
    metaDescription:
      'Install Flyto2 Warroom CE as an open source security war room for local BYO validation, evidence-backed remediation, CTEM, code, cloud, and container findings.',
    primaryCta: { label: 'GitHub repository', href: 'https://github.com/flytohub/flyto-warroom' },
    secondaryCta: { label: 'Docker images', href: 'https://hub.docker.com/r/chesterhsu/flyto-warroom' },
    sections: [
      {
        title: 'Community Edition product loop',
        body:
          'CE is meant to be useful on its own: local auth, local database, public contracts, installer scripts, and a Warroom UI that can be inspected and patched for self-hosted CTEM, attack surface management, and evidence-backed validation labs.',
        bullets: ['Self-hosted Docker Compose install with local JWT auth and local Postgres', 'BYO finding intake, attack-path review, evidence, reports, score views, and compliance surfaces', 'A deterministic demo seed shows code, container, cloud, external, evidence, and AutoFix without live provider claims'],
      },
      {
        title: 'Enterprise bridge',
        body:
          'Higher-value capabilities can be attached through Flyto2 Enterprise Cloud Bridge without publishing private backend implementation code.',
        bullets: ['Commercial threat intelligence, managed runner fleets, and live remediation orchestration', 'SSO/SAML/SCIM, offline license, airgap packaging, legal hold, and support SLAs', 'Premium actions must fail closed on missing entitlement, denied role, connector error, or invalid evidence signature'],
      },
      {
        title: 'Contribution loop',
        body:
          'The public repository is a generated CE mirror, not a dead fork. Accepted community changes should flow back into the private source repos and then be re-exported.',
        bullets: ['Public PRs are reviewed as upstream patch bundles', 'The CE boundary audit blocks private code, secrets, and enterprise-only internals', 'Shared contracts keep CE, Enterprise, docs, Docker images, and landing copy aligned'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 Warroom CE a real product or only a demo?',
        answer:
          'CE is intended to be installable and useful for local evaluation, labs, and open-source users. It includes public packages, public contracts, installer scripts, Docker image coordinates, and local evidence workflows.',
      },
      {
        question: 'What stays enterprise-only?',
        answer:
          'Private backend internals, billing and entitlement mutation, commercial datasets, managed remediation orchestration, enterprise identity, offline license, airgap bundles, legal hold, support tooling, and commercial AI proposal workflows stay Enterprise-only.',
      },
      {
        question: 'How do public contributions benefit the main Flyto2 product?',
        answer:
          'The CE repository is generated from upstream allowlists. Public changes are reviewed, converted into upstream patch bundles, applied to the private source repos, tested, and then exported again, so accepted CE work improves the main product line.',
      },
      {
        question: 'Can CE call premium services later?',
        answer:
          'Yes, through documented bridge contracts. The local Warroom keeps its database, UI, evidence timeline, and audit trail while entitled premium jobs return signed results from Flyto2 Enterprise services.',
      },
    ],
    related: [
      { label: 'GitHub', href: 'https://github.com/flytohub/flyto-warroom' },
      { label: 'Docker Hub', href: 'https://hub.docker.com/r/chesterhsu/flyto-warroom' },
      { label: 'Self-hosted docs', href: 'https://docs.flyto2.com/warroom/self-hosted-ce' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
  },
  'aikido-alternative': {
    id: 'aikido-alternative',
    path: 'aikido-alternative',
    eyebrow: 'Aikido alternative',
    title: 'Flyto2 is an open-core BYO offensive validation platform for teams evaluating Aikido-style workflows.',
    lede:
      'If you like one place for code, cloud, container, runtime, external surface, and AutoFix workflows, Flyto2 takes a different angle: bring your existing tools and turn their findings into verified attack paths, safe pentest evidence, red-team scenarios, and remediation records.',
    metaTitle: 'Aikido alternative for open-core security teams',
    metaDescription:
      'Compare Flyto2 Warroom CE with Aikido-style security platforms: self-hosted open core, BYO validation, evidence-backed AutoFix, and attack paths.',
    primaryCta: { label: 'Install Warroom CE', href: '/open-source' },
    secondaryCta: { label: 'Read self-hosted docs', href: WARROOM_CE_DOCS },
    sections: [
      {
        title: 'BYO before replacement',
        body:
          'Flyto2 is designed to make the community edition a real product surface, not a thin marketing sample and not a rip-and-replace claim. Teams can install, inspect, patch, and validate the war room locally before deciding whether Enterprise services are needed.',
        bullets: ['GitHub and Docker Hub distribution', 'Local auth, local database, local evidence timeline, and report surfaces', 'Public contracts for BYO findings, attack paths, code, CTEM, container, cloud, runtime, and external evidence flows'],
      },
      {
        title: 'Evidence-backed AutoFix loop',
        body:
          'The strongest remediation story is not an AI patch button. It is a loop: source finding, attack-path context, policy, proposed fix, approval, execution, verification, rollback evidence, and audit trail.',
        bullets: ['Code and IaC fixes can become deterministic patches or gated AI proposals', 'Container and cloud fixes stay source-labeled as repo definition, live connector, or Enterprise bridge actions', 'Every accepted fix should produce verification evidence instead of only closing an alert'],
      },
      {
        title: 'One war room, many surfaces',
        body:
          'Flyto2 treats code, cloud, container, VM/runtime, external attack surface, dark web, pentest, red-team, AI governance, and compliance as independently usable inputs and modules that can merge into one validation cockpit.',
        bullets: ['CE gives a local cockpit for baseline workflows', 'Enterprise bridge adds premium threat intel, managed runners, live remediation, SSO, airgap, and support', 'Capability, RBAC, evidence signature, and tenant isolation gates keep modules composable without hidden fail-open behavior'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 trying to clone Aikido?',
        answer:
          'No. Flyto2 should be positioned as an open-core BYO offensive validation platform for teams evaluating Aikido-style workflows. The core difference is self-hosted CE, existing-tool ingestion, attack-path validation, evidence graph, and deterministic closed-loop remediation.',
      },
      {
        question: 'Where does Flyto2 aim to be stronger?',
        answer:
          'Flyto2 should compete on open-core adoption, local installability, finding-to-attack-path correlation, safe validation, evidence-backed remediation, deterministic gates, and the ability to keep CE useful while reserving commercial intelligence and managed action for Enterprise.',
      },
      {
        question: 'What should not be claimed?',
        answer:
          'Do not claim full replacement, guaranteed coverage, benchmark leadership, or 100% AutoFix success without independent evidence. The public claim is that Flyto2 complements existing tools and closes the loop with self-hosted evidence-first workflows.',
      },
      {
        question: 'How does Enterprise fit without weakening open source?',
        answer:
          'Enterprise bridge services should attach through documented capability and evidence contracts. CE remains useful locally; premium intelligence, managed remediation, fleet execution, enterprise identity, airgap, legal hold, and support stay gated.',
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'Docker Hub', href: WARROOM_CE_DOCKER },
      { label: 'Security overview', href: '/security' },
      { label: 'Compare product lines', href: '/compare' },
    ],
  },
  'n8n-alternative': {
    id: 'n8n-alternative',
    path: 'n8n-alternative',
    eyebrow: 'n8n alternative',
    title: 'Flyto2 is an n8n alternative when workflows need browser actions, AI agents, and replayable evidence.',
    lede:
      'n8n is strong for node-based integrations. Flyto2 is built for teams that also need no-code browser automation, MCP-native AI agent tools, YAML recipes, evidence capture, and repeatable replay from the command line or cloud UI.',
    metaTitle: 'n8n alternative for AI workflow automation',
    metaDescription:
      'Compare Flyto2 with n8n for AI workflow automation, no-code browser automation, MCP tools, replayable YAML recipes, and evidence-backed workflows.',
    primaryCta: { label: 'Try Cloud recipes', href: '/cloud/#recipes' },
    secondaryCta: { label: 'Open source runtime', href: 'https://github.com/flytohub/flyto-core' },
    sections: [
      {
        title: 'When Flyto2 fits better',
        body:
          'Use Flyto2 when the work is not just moving records between APIs. It can open pages, click, type, capture screenshots, preserve run evidence, and expose deterministic tools to AI agents through MCP.',
        bullets: ['No-code browser automation and replay', '466 registry-backed modules across 85 catalog categories', 'MCP server automation for agent workflows'],
      },
      {
        title: 'Workflow evidence',
        body:
          'Flyto2 recipes are designed to produce artifacts people can inspect: screenshots, JSON outputs, audit logs, and replayable steps.',
        bullets: ['CLI recipes for repeatable jobs', 'Trace and replay from any point', 'Evidence packs for QA, SEO, security, and operations teams'],
      },
      {
        title: 'Use alongside n8n',
        body:
          'Flyto2 does not need to replace every integration builder. Teams can keep n8n for app-to-app flows and use Flyto2 where browser state, local execution, AI tools, or evidence matter.',
        bullets: ['Browser-heavy workflows', 'Agent tool execution', 'Self-hosted or local-first automation'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 a full n8n replacement?',
        answer:
          'No. Flyto2 should be positioned as an n8n alternative for browser-heavy, AI-agent, and evidence-backed workflows. n8n can remain useful for integration-first automation.',
      },
      {
        question: 'What search terms does this page answer?',
        answer:
          'n8n alternative, open source n8n alternative, free n8n alternative, n8n alternative open source, self hosted n8n alternative, n8n alternative for AI agents, AI workflow automation tools, no-code browser automation, and MCP server automation.',
      },
    ],
    related: [
      { label: 'Cloud automation', href: '/cloud' },
      { label: 'Recipes', href: '/cloud/#recipes' },
      { label: 'Open source runtime', href: 'https://github.com/flytohub/flyto-core' },
      { label: 'Comparison hub', href: '/compare' },
    ],
  },
  'zapier-alternative': {
    id: 'zapier-alternative',
    path: 'zapier-alternative',
    eyebrow: 'Zapier alternative',
    title: 'Flyto2 is a Zapier alternative for browser automation and AI-agent workflows that need proof.',
    lede:
      'Zapier is useful for SaaS triggers and app actions. Flyto2 focuses on workflows that need browser steps, local or self-hosted execution, MCP tools, audit trails, and artifacts that prove what happened.',
    metaTitle: 'Zapier alternative for browser and AI workflow automation',
    metaDescription:
      'Flyto2 is a Zapier alternative for no-code browser automation, AI agent workflows, MCP tools, local execution, evidence capture, and replay.',
    primaryCta: { label: 'See browser automation', href: '/cloud' },
    secondaryCta: { label: 'Read docs', href: 'https://docs.flyto2.com/core/' },
    sections: [
      {
        title: 'Beyond SaaS actions',
        body:
          'Some jobs happen inside websites that do not expose clean APIs. Flyto2 can automate the browser, capture the result, and keep the run inspectable.',
        bullets: ['Click, type, scroll, extract, and screenshot', 'Repeat jobs on demand or on a schedule', 'Keep evidence for review and handoff'],
      },
      {
        title: 'Agent-ready runtime',
        body:
          'Flyto2 exposes bounded modules to AI agents so they call deterministic tools instead of inventing unchecked scripts.',
        bullets: ['MCP-native tool surface', 'Registry-backed module schemas', 'Workflow replay and versioning'],
      },
      {
        title: 'Practical migration path',
        body:
          'Teams can start with one recipe: a competitor monitor, SEO audit, report generator, or security evidence capture job. The point is not to rebuild every Zapier workflow on day one.',
        bullets: ['Start with high-friction browser work', 'Keep APIs where APIs work', 'Add evidence where people need trust'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 cheaper than Zapier?',
        answer:
          'This page should not make unsupported pricing claims. The useful comparison is capability: Flyto2 focuses on browser automation, AI tools, replay, and evidence.',
      },
      {
        question: 'Can Flyto2 work without hosted SaaS automation?',
        answer:
          'Yes. Flyto2 Core is open source, and workflows can run locally or in self-hosted environments depending on the product surface.',
      },
    ],
    related: [
      { label: 'Cloud automation', href: '/cloud' },
      { label: 'Open source', href: '/open-source' },
      { label: 'Docs', href: '/docs' },
      { label: 'Comparison hub', href: '/compare' },
    ],
  },
  'make-alternative': {
    id: 'make-alternative',
    path: 'make-alternative',
    eyebrow: 'Make alternative',
    title: 'Flyto2 is a Make alternative for teams that need browser workflows, AI tools, and replay.',
    lede:
      'Make is a visual integration platform. Flyto2 is built for automation that crosses APIs, websites, AI agents, files, reports, and security evidence while keeping the workflow inspectable.',
    metaTitle: 'Make alternative for AI workflow automation',
    metaDescription:
      'Compare Flyto2 with Make for AI workflow automation, no-code browser automation, MCP tools, self-hosted workflows, and replayable evidence.',
    primaryCta: { label: 'Run a recipe', href: '/cloud/#recipes' },
    secondaryCta: { label: 'Module docs', href: 'https://docs.flyto2.com/modules/' },
    sections: [
      {
        title: 'Visual flow plus real-world actions',
        body:
          'Flyto2 is useful when a workflow needs to operate in a browser, collect artifacts, or hand a bounded tool to an AI agent.',
        bullets: ['Browser automation modules', 'Workflow recipes and templates', 'Artifacts for audit, SEO, QA, and security'],
      },
      {
        title: 'Open runtime',
        body:
          'Flyto2 Core gives technical teams a Python runtime, CLI, YAML recipes, and MCP server surface that can live outside a hosted automation vendor.',
        bullets: ['Open-source core engine', 'MCP-compatible tools', 'Local and self-hosted execution paths'],
      },
      {
        title: 'Best first use cases',
        body:
          'Start where visual integration tools become awkward: screenshot collection, multi-step website flows, evidence capture, or agent-controlled task execution.',
        bullets: ['Competitor monitoring', 'Full-page SEO audits', 'Security validation evidence'],
      },
    ],
    answers: [
      {
        question: 'Does Flyto2 replace Make scenarios?',
        answer:
          'Not universally. It is a Make alternative for workflows where browser state, AI tools, local execution, or evidence matter more than a pure integration canvas.',
      },
      {
        question: 'Where should I start?',
        answer:
          'Start with one Flyto2 recipe that produces a concrete report or artifact, then connect it back into your existing process.',
      },
    ],
    related: [
      { label: 'Recipes', href: '/cloud/#recipes' },
      { label: 'Module catalog', href: 'https://docs.flyto2.com/modules/' },
      { label: 'Open source runtime', href: 'https://github.com/flytohub/flyto-core' },
      { label: 'Comparison hub', href: '/compare' },
    ],
  },
  'playwright-alternative': {
    id: 'playwright-alternative',
    path: 'playwright-alternative',
    eyebrow: 'Playwright alternative',
    title: 'Flyto2 is not a Playwright replacement. It is a workflow layer above browser automation.',
    lede:
      'Playwright is excellent when engineers want code-level browser control. Flyto2 uses browser automation as one part of a larger workflow: recipes, modules, MCP tools, evidence capture, replay, scheduling, and reports.',
    metaTitle: 'Playwright alternative for no-code browser automation',
    metaDescription:
      'Flyto2 complements Playwright with no-code browser automation, workflow recipes, MCP tools, screenshots, evidence capture, and replayable runs.',
    primaryCta: { label: 'See Cloud automation', href: '/cloud' },
    secondaryCta: { label: 'Browser module docs', href: 'https://docs.flyto2.com/modules/browser' },
    sections: [
      {
        title: 'Use Playwright when you want code',
        body:
          'Flyto2 should not pretend Playwright is the wrong tool. Engineers who need fine-grained browser control should keep using it.',
        bullets: ['Code-level test automation', 'Precise browser APIs', 'Developer-owned scripts'],
      },
      {
        title: 'Use Flyto2 when you want a workflow',
        body:
          'Flyto2 wraps browser automation in reusable modules and workflows so non-specialists and agents can run useful jobs without maintaining a custom script for every task.',
        bullets: ['Recorded or templated actions', 'Artifacts and screenshots', 'Replay, versioning, and audit context'],
      },
      {
        title: 'Agent and operations use cases',
        body:
          'Flyto2 is strongest when browser automation needs to be part of a business, SEO, security, or data workflow rather than a standalone test.',
        bullets: ['Competitor screenshots and Web Vitals', 'Form filling and report generation', 'Security evidence and CTEM validation'],
      },
    ],
    answers: [
      {
        question: 'Does Flyto2 use Playwright?',
        answer:
          'Flyto2 browser automation can use proven browser automation primitives where appropriate, while exposing them through workflow modules, recipes, and MCP tools.',
      },
      {
        question: 'Who is this page for?',
        answer:
          'People searching for no-code browser automation, Playwright alternative, browser automation tool, or AI agent browser automation.',
      },
    ],
    related: [
      { label: 'Cloud automation', href: '/cloud' },
      { label: 'Browser docs', href: 'https://docs.flyto2.com/modules/browser' },
      { label: 'MCP docs', href: 'https://docs.flyto2.com/mcp/' },
      { label: 'Comparison hub', href: '/compare' },
    ],
  },
  'langgraph-alternative': {
    id: 'langgraph-alternative',
    path: 'langgraph-alternative',
    eyebrow: 'LangGraph alternative',
    title: 'Flyto2 is a LangGraph alternative when agents need deterministic tools and workflow evidence.',
    lede:
      'LangGraph is strong for agent state machines. Flyto2 focuses on the execution side: bounded modules, browser actions, MCP tools, YAML recipes, evidence capture, replay, and operational workflows agents can actually run.',
    metaTitle: 'LangGraph alternative for AI agent workflow automation',
    metaDescription:
      'Compare Flyto2 with LangGraph for AI agent workflow automation, deterministic tools, MCP server automation, browser actions, YAML recipes, evidence, and replay.',
    primaryCta: { label: 'Open MCP docs', href: 'https://docs.flyto2.com/mcp/' },
    secondaryCta: { label: 'Try flyto-core', href: 'https://github.com/flytohub/flyto-core' },
    sections: [
      {
        title: 'Agent orchestration vs execution',
        body:
          'Flyto2 should be described as an execution engine and workflow layer, not a drop-in replacement for every agent graph library.',
        bullets: ['Registry-backed module schemas', 'MCP-native tool exposure', 'Replayable YAML execution'],
      },
      {
        title: 'When Flyto2 fits',
        body:
          'Use Flyto2 when the agent needs to do concrete work: open a browser, collect evidence, call APIs, transform files, or produce a report that people can verify.',
        bullets: ['Browser and API automation', 'Evidence capture and audit trails', 'Security, SEO, data, and operations recipes'],
      },
      {
        title: 'Works with agent frameworks',
        body:
          'Teams can pair Flyto2 with graph-based agents. The graph can decide what to do; Flyto2 can execute bounded steps and return artifacts.',
        bullets: ['Agent decides, Flyto2 executes', 'MCP bridge for tool calling', 'Traceable outputs instead of opaque tool calls'],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 an agent framework?',
        answer:
          'Flyto2 Core is an open-source AI agent framework and workflow automation engine focused on deterministic execution, MCP tools, recipes, and evidence.',
      },
      {
        question: 'Should teams replace LangGraph?',
        answer:
          'Not by default. Use Flyto2 as the execution substrate when a graph-based agent needs bounded tools, browser work, reports, and replayable evidence.',
      },
    ],
    related: [
      { label: 'MCP docs', href: 'https://docs.flyto2.com/mcp/' },
      { label: 'flyto-core', href: 'https://github.com/flytohub/flyto-core' },
      { label: 'AI workflow docs', href: 'https://docs.flyto2.com/ai/' },
      { label: 'Comparison hub', href: '/compare' },
    ],
  },
  compare: {
    id: 'compare',
    path: 'compare',
    eyebrow: 'Compare',
    title: 'Compare attack surface management tools and Flyto2 product lines.',
    lede:
      'Compare attack surface management tools against Flyto2 Warroom CE, Enterprise bridge, Cloud automation, Security, future Data, agent OS, and intelligence surfaces. Flyto2 keeps product and deployment boundaries explicit for CTEM, EASM, security automation, and workflow automation buyers.',
    metaTitle: 'Compare attack surface management tools',
    metaDescription:
      'Compare attack surface management tools with Flyto2 Cloud automation, Security, CTEM, EASM, open-core Warroom CE, Enterprise bridge, Data, Agent OS, and Intelligence product lines.',
    primaryCta: { label: 'Warroom CE', href: '/open-source' },
    secondaryCta: { label: 'Security', href: '/security' },
    sections: [
      {
        title: 'Warroom CE',
        body:
          'Closest category: self-hosted open-core security war room for labs, evaluation, local teams, and community contribution.',
        bullets: ['Buyer: security engineers, founders, labs, open-source users, MSSP evaluators', 'Primary public repo: flyto-warroom generated from upstream allowlists', 'Boundary: local auth, local data, public contracts, no private enterprise internals'],
      },
      {
        title: 'Enterprise bridge',
        body:
          'Closest category: enterprise security operations platform with cloud-backed intelligence, managed runners, identity, governance, and support.',
        bullets: ['Buyer: security teams, MSSPs, compliance owners, platform teams', 'Primary private repos: flyto-engine, flyto-code, flyto-cloud, flyto-core, flyto-i18n', 'Boundary: entitlement, RBAC, signed evidence, premium actions, deployment edition'],
      },
      {
        title: 'Cloud / Apps / Automation',
        body:
          'Closest category: n8n-like automation, but focused on browser automation, crawler apps, templates, and evidence-producing workflows.',
        bullets: ['Buyer: operations, growth, content, data collection, business automation', 'Primary repo: flyto-cloud plus flyto-core', 'Boundary: no-code automation and deterministic execution substrate'],
      },
      {
        title: 'Security',
        body:
          'Closest category: evidence-backed CTEM and security war room for code, cloud, dark web, AI governance, reports, red-team validation, attack surface management vs vulnerability management comparisons, and EASM-to-validation workflows.',
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
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'Docker Hub', href: WARROOM_CE_DOCKER },
      { label: 'Security', href: '/security' },
    ],
  },
  'api-docs': {
    id: 'api-docs',
    path: 'api-docs',
    eyebrow: 'API docs',
    title: 'MCP server automation docs for Flyto2 APIs and modules.',
    lede:
      'MCP server automation docs point AI crawlers and developers to the authoritative surface for Flyto2 Core modules, workflow recipes, MCP transport, Warroom CE installation, bridge contracts, attack surface management API context, CTEM workflows, and security APIs.',
    metaTitle: 'MCP server automation docs for Flyto2 APIs',
    metaDescription:
      'MCP server automation docs and API entry point for Flyto2 modules, workflows, attack surface management API context, CTEM workflow, security automation, and Warroom documentation.',
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
        title: 'Warroom CE and bridge APIs',
        body:
          'Security APIs are governed by engine membership, entitlement, RBAC, capability, tenant isolation, and evidence signature checks. They support CTEM workflow automation, attack surface management API references, report exports, and premium bridge execution.',
        bullets: ['Capabilities endpoint', 'Report and evidence APIs', 'CTEM, red-team, attack surface, and premium bridge workflows'],
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
      { label: 'Self-hosted CE', href: WARROOM_CE_DOCS },
      { label: 'Modules', href: 'https://docs.flyto2.com/modules/' },
    ],
  },
  trust: {
    id: 'trust',
    path: 'trust',
    eyebrow: 'Trust',
    title: 'Flyto2 trust is built around boundaries, consent, evidence, and audit.',
    lede:
      'The trust model separates the public CE mirror, private enterprise internals, tenant data, dynamic scan consent, RBAC, capability gates, report export, AI evidence handling, and deployment provider boundaries for CTEM, attack surface management, and security automation workflows.',
    metaTitle: 'Flyto2 trust and security',
    metaDescription:
      'Trust overview for Flyto2 tenant isolation, RBAC, audit logs, dynamic scan consent, AI evidence handling, and enterprise deployment boundaries.',
    primaryCta: { label: 'Security product', href: '/security' },
    secondaryCta: { label: 'Enterprise', href: '/enterprise' },
    sections: [
      {
        title: 'Open-core boundary',
        body:
          'The public CE repository is generated from allowlisted source, contracts, docs, and UI surfaces. It is not a dump of private enterprise backend internals.',
        bullets: ['CE boundary audit blocks secrets and enterprise-only internals', 'Premium bridge calls require capability, license, and signed evidence checks', 'Public contributions flow back through upstream review before re-export'],
      },
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
      { label: 'Open core', href: '/open-source' },
      { label: 'Airgap', href: '/airgap' },
    ],
  },
  community: {
    id: 'community',
    path: 'community',
    eyebrow: 'Community',
    title: 'Open-source AI workflow automation community for Flyto2.',
    lede:
      'The Flyto2 open-source AI workflow automation community connects contributors, workflow builders, MCP users, Warroom CE testers, docs readers, and social launch channels through one reviewable loop.',
    metaTitle: 'Open-source AI workflow automation community',
    metaDescription:
      'Join the Flyto2 open-source AI workflow automation community to ask questions, contribute good-first issues, share workflows, and promote reviewed releases.',
    primaryCta: { label: 'Join Discussions', href: 'https://github.com/flytohub/flyto-core/discussions' },
    secondaryCta: { label: 'Contributor guide', href: 'https://github.com/flytohub/.github/blob/main/CONTRIBUTING.md' },
    sections: [
      {
        title: 'Ask in public',
        body:
          'Questions should start in GitHub Discussions so the answer can help the next builder. Use docs for mechanics, the blog for explanations, and product pages for positioning.',
        bullets: ['Q&A for setup, recipes, MCP clients, and browser modules', 'Ideas before large feature work', 'Show and Tell for demos, recipes, and labs'],
      },
      {
        title: 'Contribute small, useful pieces',
        body:
          'The best early contributions make Flyto2 easier to try: focused docs, reproducible bugs, small recipes, missing tests, package metadata, and examples that do not need private context.',
        bullets: ['Good-first issues have narrow done conditions', 'Security reports stay private through security@flyto2.com', 'Accepted examples point back to a canonical public URL'],
      },
      {
        title: 'Publish once, syndicate carefully',
        body:
          'Community posts and releases should be drafted once, reviewed, and then shared to LinkedIn, Facebook, YouTube, package pages, and GitHub only when the maintainer provides platform credentials at runtime.',
        bullets: ['Default mode is dry-run and reviewable JSON output', 'No social tokens or page secrets belong in source', 'Every social post links to a blog, docs, landing, release, package, or demo page'],
      },
    ],
    answers: [
      {
        question: 'What should new contributors do first?',
        answer:
          'Pick a good-first issue, reproduce the setup, keep the pull request small, and update docs or examples when the public surface changes.',
      },
      {
        question: 'Can Flyto2 auto-post to LinkedIn or Facebook?',
        answer:
          'Yes, but only through reviewed social drafts and runtime credentials. Source code should generate drafts and call platform APIs only when a maintainer explicitly runs live publish with valid OAuth or Page tokens.',
      },
      {
        question: 'What makes a showcase useful?',
        answer:
          'A useful showcase includes a reusable workflow, recipe, MCP configuration, screenshot, trace, replay note, or Warroom CE lab with secrets removed.',
      },
    ],
    related: [
      { label: 'GitHub organization', href: 'https://github.com/flytohub' },
      { label: 'Good first issues', href: 'https://github.com/flytohub/flyto-core/contribute' },
      { label: 'Blog launch notes', href: 'https://blog.flyto2.com/posts/community-growth-open-source-ai-workflow-automation' },
      { label: 'Docs community guide', href: 'https://docs.flyto2.com/community/' },
    ],
  },
  support: {
    id: 'support',
    path: 'support',
    eyebrow: 'Support',
    title: 'Flyto2 support for Cloud, MCP routing, connected runners, and Warroom.',
    lede:
      'Contact support@flyto2.com for account, billing, Flyto2 Cloud, ChatGPT app, MCP routing, connected runner, or Warroom questions. Include enough non-sensitive context to reproduce the problem; never send passwords, access tokens, device secrets, or unredacted customer data.',
    metaTitle: 'Flyto2 support',
    metaDescription:
      'Get support for Flyto2 Cloud, the ChatGPT app, MCP routing, connected runners, Warroom, accounts, billing, privacy, and security.',
    primaryCta: { label: 'Email support', href: 'mailto:support@flyto2.com' },
    secondaryCta: { label: 'Open documentation', href: 'https://docs.flyto2.com/' },
    sections: [
      {
        title: 'Send a useful report',
        body:
          'A concise, sanitized report lets the team diagnose the correct tenant, route, device, and execution without collecting unnecessary data.',
        bullets: [
          'Include your account email, affected product, and approximate UTC time',
          'Include a sanitized workflow ID, run ID, device name, or screenshot when available',
          'Never include a password, bearer token, pairing code, device secret, or raw sensitive payload',
        ],
      },
      {
        title: 'ChatGPT and MCP routing',
        body:
          'For ChatGPT app or MCP execution problems, identify whether the failure occurred during OAuth connection, route resolution, Warroom preflight, device dispatch, or run completion.',
        bullets: [
          'Confirm the intended workspace and execution route',
          'Confirm the connected device is online and not revoked',
          'Share the sanitized run ID and Warroom decision reason when available',
        ],
      },
      {
        title: 'Privacy and security',
        body:
          'Use the dedicated contacts so privacy requests and security reports enter the correct handling process.',
        bullets: [
          'Privacy, access, correction, export, or deletion: privacy@flyto2.com',
          'Security vulnerabilities or suspected abuse: security@flyto2.com',
          'General product and account support: support@flyto2.com',
        ],
      },
    ],
    answers: [
      {
        question: 'How quickly does Flyto2 respond?',
        answer:
          'Flyto2 targets an initial response within one business day for general support. Resolution time depends on severity, reproducibility, and whether third-party systems are involved.',
      },
      {
        question: 'What should I do if a connected device is offline?',
        answer:
          'Check the device status and selected MCP route in Flyto2 Cloud. The configured route policy determines whether execution fails closed or uses an approved fallback.',
      },
      {
        question: 'How do I request account deletion?',
        answer:
          'Use the deletion control in Flyto2 Cloud or email privacy@flyto2.com. The account enters a 30-day safety period before scheduled deletion, as described in the privacy policy.',
      },
    ],
    related: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Contact Flyto2', href: '/contact' },
      { label: 'Cloud data deletion', href: 'https://cloud.flyto2.com/data-deletion.html' },
    ],
  },
  docs: {
    id: 'docs',
    path: 'docs',
    eyebrow: 'Docs',
    title: 'Flyto2 docs are the technical citation surface.',
    lede:
      'Use docs.flyto2.com for implementation details, Warroom CE installation, module contracts, workflow recipes, MCP transport, bridge contracts, security APIs, CTEM framework details, attack surface management API references, and product-line architecture.',
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
          'Warroom docs cover CE installation, CTEM, closed-loop validation, BYO integration, red-team, score events, security APIs, EASM input contracts, attack surface management API context, and bridge boundaries.',
        bullets: ['Self-hosted CE install', 'Closed-loop CTEM', 'BYO integrations, EASM inputs, and Warroom API'],
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
      { label: 'Self-hosted CE', href: WARROOM_CE_DOCS },
      { label: 'API docs', href: '/api-docs' },
    ],
  },
  blog: {
    id: 'blog',
    path: 'blog',
    eyebrow: 'Blog',
    title: 'Flyto2 blog is the educational and comparison surface.',
    lede:
      'The blog answers questions buyers and practitioners search for: what is CTEM, what is attack surface management, how EASM tools differ from ASM, attack surface management vs vulnerability management, how self-hosted CE differs from Enterprise, and how AI visibility/GEO content should be structured.',
    metaTitle: 'Flyto2 blog',
    metaDescription:
      'Blog entry point for CTEM explanations, attack surface management tools, EASM comparisons, security automation strategy, open-core security, and AI visibility.',
    primaryCta: { label: 'Open blog', href: 'https://blog.flyto2.com/' },
    secondaryCta: { label: 'Docs', href: '/docs' },
    sections: [
      {
        title: 'SEO foundation',
        body:
          'Blog posts answer ordinary search questions so Google and Bing can find and index Flyto2 content across informational, comparison, commercial, and implementation intent.',
        bullets: ['What is CTEM?', 'What is attack surface management?', 'EASM tools, CTEM vs vulnerability management, open-core security, and dark web monitoring explainers'],
      },
      {
        title: 'AEO answer blocks',
        body:
          'Articles should include clear answer blocks, FAQs, comparisons, and structured headings for AI Overviews and featured answers.',
        bullets: ['What is / how to / compare / pricing / security / enterprise / vendors / open source', 'FAQPage and Article schema where appropriate', 'Citation-ready summary paragraphs'],
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
      { label: 'Open core', href: '/open-source' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  changelog: {
    id: 'changelog',
    path: 'changelog',
    eyebrow: 'Changelog',
    title: 'Flyto2 changelogs separate product changes from technical release notes.',
    lede:
      'Cloud automation, Warroom CE, Enterprise bridge, docs, and engine release notes should remain traceable so customers, community users, and AI crawlers can understand what changed and where.',
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
          'Security release notes should cover CE distribution, CTEM, code security, report, evidence, red-team, AI governance, cloud, dark web, and entitlement changes.',
        bullets: ['CE Docker, GitHub, and installer changes', 'Capability and RBAC changes', 'Report/export behavior and evidence consent updates'],
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
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'Docs', href: '/docs' },
    ],
  },
};

export const requiredGeoRoutes = Object.values(publicRoutePages).map((page) => page.path);
