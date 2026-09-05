export interface SecurityPageSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface SecurityPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  proofPoints: string[];
  sections: SecurityPageSection[];
  related: { label: string; href: string }[];
}

const WARROOM_CE_DOCS = 'https://docs.flyto2.com/warroom/self-hosted-ce';

export const securityPages = {
  'attack-surface-management': {
    slug: 'attack-surface-management',
    metaTitle: 'Attack Surface Management Tools for Evidence-Backed CTEM',
    metaDescription:
      'Flyto2 is an attack surface management solution that integrates ASM tools, code, dark web, pentest, and red-team signals into evidence-backed CTEM.',
    eyebrow: 'ATTACK SURFACE MANAGEMENT',
    title: 'Attack surface management that connects exposure to evidence.',
    lede:
      'Flyto2 complements the attack surface tools you already trust. Start with self-hosted Warroom CE, bring existing ASM, EASM, scanner, rating, and asset data, then correlate it with code, dark web, pentest, and red-team evidence for teams comparing an attack surface management solution, attack surface management software, vendors, and validation workflows.',
    image: '/assets/img/warroom/26-asset-map.png',
    imageAlt: 'Flyto2 asset map showing domains, services, and ownership context',
    primaryCta: { label: 'Read the CTEM workflow', href: '/ctem' },
    secondaryCta: { label: 'Open ASM docs', href: 'https://docs.flyto2.com/warroom/surfaces/attack-surface' },
    proofPoints: [
      'Self-hosted CE baseline for local asset and exposure review',
      'BYO-friendly asset and exposure ingestion',
      'External findings correlated with owned assets and code context',
      'Pentest and red-team validation when a path needs proof',
    ],
    sections: [
      {
        title: 'Start in Warroom CE',
        body:
          'Community Edition gives teams a local cockpit for asset inventory, exposure review, evidence, and scoring before Enterprise bridge services are attached.',
        bullets: ['Docker and GitHub distribution', 'Local database and evidence timeline', 'Bridge-ready contracts for premium correlation'],
      },
      {
        title: 'Bring your existing ASM data',
        body:
          'Flyto2 is not positioned as a rip-and-replace scanner. It accepts the tools, exports, and feeds your team already uses, then normalizes them into an ownership-gated asset map for attack surface management vendors, external-rating tools, and internal asset owners.',
        bullets: ['External ratings and scanner output', 'Domain and service inventory', 'Cloud, repo, and CMDB context'],
      },
      {
        title: 'Correlate exposure with what matters',
        body:
          'An exposed service is more useful when it is connected to the repository, dependency, credential, or threat signal behind it. Flyto2 keeps that context in one evidence-backed workflow, which is the practical difference in attack surface management vs vulnerability management discussions.',
        bullets: ['Asset-to-repo mapping', 'Code and dependency risk context', 'Dark web and leaked-credential joins'],
      },
      {
        title: 'Validate before you mobilize',
        body:
          'When a path matters, Flyto2 can route it into consented pentest and red-team validation so remediation work is based on evidence, not just an alert count.',
        bullets: ['Closed-loop verification', 'Replayable evidence packs', 'Actionable owner-facing remediation context'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'External attack surface management', href: '/external-attack-surface-management' },
      { label: 'Self-hosted CE docs', href: WARROOM_CE_DOCS },
    ],
  },
  'external-attack-surface-management': {
    slug: 'external-attack-surface-management',
    metaTitle: 'External Attack Surface Management Platform for CTEM',
    metaDescription:
      'Flyto2 helps teams use an external attack surface management platform to correlate EASM findings with assets, code risk, dark web signals, and validation evidence.',
    eyebrow: 'EASM',
    title: 'External attack surface management for teams that need correlation.',
    lede:
      'Flyto2 works alongside external attack surface management tools. Warroom CE can hold the local external inventory; Enterprise bridge services can add premium correlation, validation, and managed execution for teams comparing EASM tools and external attack surface management vendors.',
    image: '/assets/img/warroom/23-domain-security.png',
    imageAlt: 'Flyto2 domain security view with external posture findings',
    primaryCta: { label: 'See attack surface docs', href: 'https://docs.flyto2.com/warroom/surfaces/attack-surface' },
    secondaryCta: { label: 'Read the EASM guide', href: 'https://blog.flyto2.com/posts/what-is-easm-external-attack-surface-management' },
    proofPoints: [
      'CE-ready external inventory and posture views',
      'Outside-in discovery without losing ownership context',
      'External posture tied to asset and repository evidence',
      'CTEM prioritization instead of isolated exports',
    ],
    sections: [
      {
        title: 'What is external attack surface management?',
        body:
          'External attack surface management is the practice of finding the internet-facing assets an attacker can see from outside the network, and keeping that view current as assets change. Flyto2 reconciles that outside-in picture with ownership and business context, so a team can tell what is genuinely in scope and what should move first.',
        bullets: ['Domains, subdomains, certificates, ports', 'Attribution and ownership gates', 'Asset-map reconciliation'],
      },
      {
        title: 'Separate local inventory from live connectors',
        body:
          'Teams should be able to see whether an exposure came from imported data, local discovery, a connected cloud/container source, or an Enterprise bridge job.',
        bullets: ['Source labels for imported, local, and live connector findings', 'Project and tenant ownership context', 'Evidence lineage for every promoted issue'],
      },
      {
        title: 'Use existing external-rating signals',
        body:
          'For teams that already use external-rating or EASM tools, Flyto2 can ingest those signals and correlate them with code, assets, dark web, and validation evidence.',
        bullets: ['Works alongside existing EASM tools', 'Vendor signal as input, not a replacement claim', 'Combined operational picture'],
      },
      {
        title: 'Feed CTEM instead of a static list',
        body:
          'External findings should feed a loop: scope, discover, prioritize, validate, and mobilize. Flyto2 keeps those stages connected in one war room.',
        bullets: ['Prioritized exposure workflows', 'Pentest target generation', 'Evidence-backed mobilization'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'What is EASM?', href: 'https://blog.flyto2.com/posts/what-is-easm-external-attack-surface-management' },
      { label: 'CTEM', href: '/ctem' },
    ],
  },
  ctem: {
    slug: 'ctem',
    metaTitle: 'Continuous Threat Exposure Management CTEM Framework',
    metaDescription:
      'Flyto2 maps ASM, code, dark web, pentest, and scanner findings into a continuous threat exposure management CTEM framework for continuous threat exposure management programs.',
    eyebrow: 'CONTINUOUS THREAT EXPOSURE MANAGEMENT',
    title: 'Continuous threat exposure management CTEM with verified attack paths.',
    lede:
      'What is continuous threat exposure management in practice? Flyto2 turns ASM, dark web, code, pentest, red-team, cloud, and scanner signals into a continuous threat exposure management CTEM workflow with attack hypotheses, evidence, and remediation context.',
    image: '/assets/img/warroom/21-scoring-breakdown.png',
    imageAlt: 'Flyto2 scoring breakdown for CTEM security surfaces',
    primaryCta: { label: 'Read CTEM guide', href: 'https://blog.flyto2.com/posts/what-is-ctem-continuous-threat-exposure-management' },
    secondaryCta: { label: 'Open Warroom docs', href: 'https://docs.flyto2.com/warroom/' },
    proofPoints: [
      'Self-hosted CE for local CTEM and validation evaluation',
      'Findings become attack hypotheses before validation',
      'Evidence trails for findings and validation work',
      'BYO-friendly integrations for existing security tools',
    ],
    sections: [
      {
        title: 'Installable validation cockpit',
        body:
          'CE keeps the core loop visible: ingest findings, build attack paths, validate safely, capture evidence, remediate, and report. Enterprise bridge expands the same loop with commercial data and managed execution.',
        bullets: ['Local projects, assets, findings, evidence, reports, and score views', 'Capability-gated premium actions', 'Signed results returned into the same evidence timeline'],
      },
      {
        title: 'A validation workflow, not another isolated dashboard',
        body:
          'CTEM only works when discovery, prioritization, validation, and action stay connected. Flyto2 consumes existing security data and turns the highest-value paths into evidence-backed validation work for teams asking what continuous threat exposure management changes beyond vulnerability management, comparing continuous threat exposure management vs vulnerability management, and evaluating continuous threat exposure management vendors.',
        bullets: ['External surface and asset inventory', 'Code and dependency context', 'Validation through pentest and red-team loops'],
      },
      {
        title: 'Prioritize with context',
        body:
          'Flyto2 correlates findings across assets, code, credentials, and threat signals so prioritization is based on reachability and impact rather than raw volume.',
        bullets: ['Owned asset context', 'Code reachability context', 'Dark web and IOC context'],
      },
      {
        title: 'Act with evidence',
        body:
          'Findings can carry replayable evidence, validation status, and remediation context so security and engineering teams share the same facts.',
        bullets: ['Evidence-backed tickets and reports', 'Closed-loop verification', 'Regression-friendly replay'],
      },
    ],
    related: [
      { label: 'Install Warroom CE', href: '/open-source' },
      { label: 'Attack surface management', href: '/attack-surface-management' },
      { label: 'Closed-loop docs', href: 'https://docs.flyto2.com/warroom/closed-loop' },
    ],
  },
  'dark-web-monitoring': {
    slug: 'dark-web-monitoring',
    metaTitle: 'Dark Web Monitoring for Credential and Threat Correlation',
    metaDescription:
      'Flyto2 correlates dark web monitoring signals with assets, code, credentials, attack surface, and validation evidence.',
    eyebrow: 'DARK WEB MONITORING',
    title: 'Dark web monitoring connected to the rest of your security picture.',
    lede:
      'Bring the dark web, breach, and threat-intel feeds you already trust. Warroom CE shows the local correlation loop; Enterprise bridge can attach commercial feeds, refresh jobs, and signed enrichment results.',
    image: '/assets/img/warroom/19-malware-detection.png',
    imageAlt: 'Flyto2 threat and malware detection view',
    primaryCta: { label: 'Read dark web guide', href: 'https://blog.flyto2.com/posts/darkweb-monitoring-explained' },
    secondaryCta: { label: 'Open dark web docs', href: 'https://docs.flyto2.com/warroom/surfaces/darkweb-threat-intel' },
    proofPoints: [
      'CE correlation views for imported leaks and indicators',
      'Leaked credentials tied to domains and assets',
      'IOC and actor context correlated with exposure',
      'BYO threat feeds with supplemental coverage where needed',
    ],
    sections: [
      {
        title: 'Make source and entitlement visible',
        body:
          'Threat records should show whether they came from imported evidence, a BYO feed, or an entitled Enterprise refresh job.',
        bullets: ['Source and freshness labels', 'Credential-to-domain and asset joins', 'Premium enrichment fails closed when entitlement is missing'],
      },
      {
        title: 'Credential monitoring with ownership context',
        body:
          'A leaked credential matters most when it can be tied to an active domain, identity, or service. Flyto2 keeps those relationships visible instead of leaving leaks in a silo.',
        bullets: ['Domain and email matching', 'Asset-map joins', 'Footprint seeding from confirmed signals'],
      },
      {
        title: 'Threat intelligence as operational input',
        body:
          'Threat actors, IOCs, ransomware activity, and brand abuse become inputs to CTEM prioritization, not standalone headlines.',
        bullets: ['IOC lookup', 'Actor and malware context', 'Brand impersonation tracking'],
      },
      {
        title: 'Bring the feed you already trust',
        body:
          'If you already pay for a breach-data or threat-intel provider, Flyto2 can use that data as a first-class input and supplement gaps where needed.',
        bullets: ['Feed ingestion', 'Coverage visibility', 'Correlation over the combined picture'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'Dark web monitoring explained', href: 'https://blog.flyto2.com/posts/darkweb-monitoring-explained' },
      { label: 'CTEM', href: '/ctem' },
    ],
  },
  'mssp-platform': {
    slug: 'mssp-platform',
    metaTitle: 'MSSP platform for evidence-backed security teams',
    metaDescription:
      'Flyto2 is an MSSP platform for evidence-backed security teams that correlates existing tools, customer findings, reports, and remediation action.',
    eyebrow: 'MSSP / BYO PLATFORM',
    title: 'Flyto2 is an MSSP platform for BYO security operations.',
    lede:
      'Flyto2 is an MSSP platform that correlates the tools and data you already trust, validates what matters, and turns findings into evidence-backed action. MSSPs can evaluate with Warroom CE, then attach Enterprise bridge services for customer isolation, fleet execution, reporting, identity, and support.',
    image: '/assets/img/warroom/28-reports-builder.png',
    imageAlt: 'Flyto2 report builder for evidence-backed security workflows',
    primaryCta: { label: 'Read BYO docs', href: 'https://docs.flyto2.com/warroom/byo-integration' },
    secondaryCta: { label: 'Read MSSP overview', href: 'https://docs.flyto2.com/warroom/mssp-overview' },
    proofPoints: [
      'CE baseline for local labs and customer demos',
      'Built for teams and service providers with existing toolchains',
      'Ingest, supplement, correlate, validate, and report',
      'Evidence-backed outputs for customers, boards, and engineering teams',
    ],
    sections: [
      {
        title: 'Demo locally, operate with Enterprise controls',
        body:
          'A service provider can start with CE workflows, then keep production customer work behind Enterprise identity, tenant isolation, audit export, and premium bridge jobs.',
        bullets: ['Local CE evaluation', 'Customer-ready Enterprise reports', 'Capability-gated premium enrichment and remediation'],
      },
      {
        title: 'Integrate first',
        body:
          'The first move is to connect the assets, feeds, scanners, repos, and cloud posture data your team already uses.',
        bullets: ['Repositories and CI outputs', 'Domains and asset inventories', 'External feeds and scanner exports'],
      },
      {
        title: 'Supplement the gaps',
        body:
          'Flyto2 can add deterministic discovery and validation where your existing stack has coverage gaps, while keeping those gaps visible.',
        bullets: ['Attack surface discovery', 'Threat feed supplementation', 'Pentest and red-team validation'],
      },
      {
        title: 'Package evidence-backed action',
        body:
          'MSSP workflows need more than alerts. Flyto2 connects findings to owners, evidence, reports, and follow-up validation.',
        bullets: ['Customer-ready reports', 'Replayable evidence', 'Operational views for remediation'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'BYO Integration Guide', href: 'https://docs.flyto2.com/warroom/byo-integration' },
      { label: 'Self-hosted CE docs', href: WARROOM_CE_DOCS },
    ],
  },
  'ai-security': {
    slug: 'ai-security',
    metaTitle: 'AI Security Platform for Agent, MCP, Code, and Exposure Risk',
    metaDescription:
      'Flyto2 is an AI security platform that correlates MCP and tool surfaces, code risk, attack surface, and validation evidence in one security war room.',
    eyebrow: 'AI SECURITY PLATFORM',
    title: 'An AI security platform that puts code, tools, and evidence in the same room.',
    lede:
      'Flyto2 helps security teams reason about agent-native risk by correlating MCP/tool surfaces, code intelligence, cloud and container posture, attack surface, and evidence-backed validation. Deterministic rules remain the authority; AI is an assistant, not a gate.',
    image: '/assets/img/warroom/15-api-routes.png',
    imageAlt: 'Flyto2 API route inventory used for agent and application security review',
    primaryCta: { label: 'Read AI security guide', href: 'https://blog.flyto2.com/posts/ai-security-platform-guide' },
    secondaryCta: { label: 'Open MCP security docs', href: 'https://docs.flyto2.com/warroom/surfaces/mcp-security' },
    proofPoints: [
      'Deterministic fallback when AI providers are unavailable',
      'MCP and tool-surface posture alongside code risk',
      'Agent-accessible APIs tied to ownership and auth context',
      'Validation workflows for high-impact findings',
    ],
    sections: [
      {
        title: 'Do not make AI the authority',
        body:
          'AI can help explain, draft, or summarize, but Flyto2 should keep authorization, entitlement, evidence validity, and final promotion decisions deterministic.',
        bullets: ['Provider quota and entitlement gates', 'No fake provider success', 'Rules-only fallback for airgap and no-AI sites'],
      },
      {
        title: 'Map what agents and tools can touch',
        body:
          'AI security is partly an access and integration problem. Flyto2 surfaces MCP servers, tool routes, APIs, and code paths so teams can see what an agent-native stack exposes.',
        bullets: ['MCP server posture', 'API and route inventory', 'Auth and ownership context'],
      },
      {
        title: 'Connect AI risk to application risk',
        body:
          'Agent workflows still land on code, credentials, cloud resources, and external services. Flyto2 keeps those layers connected in one security workflow.',
        bullets: ['Code intelligence', 'Secrets and dependency risk', 'Cloud and container posture'],
      },
      {
        title: 'Validate before escalation',
        body:
          'When a risky tool or code path matters, Flyto2 can route it into controlled verification and evidence capture.',
        bullets: ['Closed-loop verification', 'Replayable evidence', 'Owner-facing remediation context'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'MCP security docs', href: 'https://docs.flyto2.com/warroom/surfaces/mcp-security' },
      { label: 'AI security platform guide', href: 'https://blog.flyto2.com/posts/ai-security-platform-guide' },
    ],
  },
  'bitsight-alternative': {
    slug: 'bitsight-alternative',
    metaTitle: 'Bitsight Alternatives: Correlate External Ratings with CTEM Evidence',
    metaDescription:
      'For teams that use Bitsight or similar external-rating tools, Flyto2 can ingest those signals and correlate them with code, assets, dark web, and validation evidence.',
    eyebrow: 'BITSIGHT ALTERNATIVE',
    title: 'A CTEM war room that can work alongside Bitsight signals.',
    lede:
      'For teams that already use Bitsight or similar external-rating tools, Flyto2 can ingest those signals, correlate them with code, assets, dark web, and validation evidence, and help security teams act on the combined picture. CE is a local cockpit; Enterprise bridge is where premium managed correlation belongs.',
    image: '/assets/img/warroom/23-domain-security.png',
    imageAlt: 'Flyto2 external posture view for correlating rating and attack-surface signals',
    primaryCta: { label: 'Read comparison guide', href: 'https://blog.flyto2.com/posts/bitsight-alternatives' },
    secondaryCta: { label: 'Open BYO docs', href: 'https://docs.flyto2.com/warroom/byo-integration' },
    proofPoints: [
      'Local CE view for imported rating and posture signals',
      'Complements external-rating workflows',
      'Uses rating signals as inputs to CTEM correlation',
      'Connects external posture with assets, code, dark web, and validation evidence',
    ],
    sections: [
      {
        title: 'Use CE without overclaiming replacement',
        body:
          'Warroom CE can show imported rating and posture signals in context. The correct positioning is complement, correlate, and validate, not a claim to fully replace Bitsight.',
        bullets: ['External-rating imports as inputs', 'Clear source labels and evidence lineage', 'Enterprise bridge for premium enrichment and managed workflows'],
      },
      {
        title: 'Use external ratings as inputs',
        body:
          'Flyto2 treats Bitsight and similar external-rating data as useful inputs. It is a security war room that can consume those signals and connect them to operational security workflows.',
        bullets: ['External-rating signal ingest', 'Asset and ownership reconciliation', 'Combined CTEM prioritization'],
      },
      {
        title: 'Correlate with internal context',
        body:
          'External posture becomes more actionable when linked to repositories, dependencies, leaked credentials, cloud posture, and validation results.',
        bullets: ['Code and asset mapping', 'Dark web and threat-intel joins', 'Pentest validation paths'],
      },
      {
        title: 'Act on the combined picture',
        body:
          'Flyto2 helps teams move from rating observations to owner-facing action with evidence and follow-up validation.',
        bullets: ['Evidence-backed remediation', 'Closed-loop verification', 'MSSP-ready reporting'],
      },
    ],
    related: [
      { label: 'Warroom CE', href: '/open-source' },
      { label: 'Bitsight alternatives guide', href: 'https://blog.flyto2.com/posts/bitsight-alternatives' },
      { label: 'External attack surface management', href: '/external-attack-surface-management' },
    ],
  },
} satisfies Record<string, SecurityPage>;

export type SecurityPageSlug = keyof typeof securityPages;
