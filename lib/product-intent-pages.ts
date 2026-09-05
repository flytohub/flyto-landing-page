export type ProductFamily = 'flow' | 'warroom';

export interface ProductIntentLink {
  label: string;
  href: string;
}

export interface ProductIntentSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface ProductIntentAnswer {
  question: string;
  answer: string;
}

export interface ProductIntentQuickStart {
  eyebrow: string;
  title: string;
  body: string;
  command: string;
  note: string;
  links: ProductIntentLink[];
}

export interface ProductIntentPage {
  family: ProductFamily;
  slug: string[];
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  screenshot: string;
  screenshotAlt: string;
  primaryCta: ProductIntentLink;
  secondaryCta: ProductIntentLink;
  quickStart?: ProductIntentQuickStart;
  sections: ProductIntentSection[];
  answers: ProductIntentAnswer[];
  related: ProductIntentLink[];
}

const FLOW_DOCKER = 'https://hub.docker.com/r/flyto2/flow';
const FLOW_DOCS = 'https://docs.flyto2.com/flow/';
const WARROOM_DOCKER = 'https://hub.docker.com/r/chesterhsu/flyto-warroom';
const WARROOM_DOCS = 'https://docs.flyto2.com/warroom/';

const flowScreenshot = '/assets/img/flow-mcp-studio.jpg';
const warroomScreenshot = '/assets/img/warroom/01-projects-home.webp';

export const productIntentPages: ProductIntentPage[] = [
  {
    family: 'flow',
    slug: [],
    path: 'flow',
    eyebrow: 'Flyto2 Flow',
    title: 'Build AI workflow automation and publish visual workflows as MCP tools.',
    lede:
      'Flyto2 Flow is a self-hosted visual workflow and MCP builder powered by the open-source Apache-2.0 flyto-core runtime. Flow CE is publicly available as a Docker image with installation documentation; the Flow application source repository is not public.',
    metaTitle: 'AI Workflow Automation and Visual MCP Builder',
    metaDescription:
      'Flyto2 Flow is self-hosted AI workflow automation: build, test, and replay visual workflows, then publish them as MCP tools. The Community Edition is a documented Docker image.',
    screenshot: flowScreenshot,
    screenshotAlt:
      'Flyto2 Flow MCP Studio showing generated workflow tools, schema inputs, and an auditable tool response',
    primaryCta: { label: 'Get Flow CE on Docker Hub', href: FLOW_DOCKER },
    secondaryCta: { label: 'Read Flow documentation', href: FLOW_DOCS },
    quickStart: {
      eyebrow: 'Flow Community Edition',
      title: 'Start the self-hosted CE image with Docker.',
      body:
        'The released multi-architecture image bundles the Flow application, flyto-core, Playwright, and Chromium. It starts without a Flyto2 account and publishes only to loopback by default.',
      command: `docker pull docker.io/flyto2/flow:0.1.1
docker run --detach \\
  --name flyto-flow \\
  --init \\
  --restart unless-stopped \\
  --shm-size=1g \\
  --publish 127.0.0.1:9000:9000 \\
  --volume flyto-flow-data:/data/flyto \\
  docker.io/flyto2/flow:0.1.1`,
      note:
        'Open http://127.0.0.1:9000. The named volume keeps workflows, runs, evidence, and local state across container replacement.',
      links: [
        { label: 'Flow CE on Docker Hub', href: 'https://hub.docker.com/r/flyto2/flow' },
        {
          label: 'CE Docker installation guide',
          href: 'https://docs.flyto2.com/flow/community-edition-docker',
        },
      ],
    },
    sections: [
      {
        title: 'Visual workflow automation',
        body:
          'Compose deterministic workflows from reusable atoms instead of asking an agent to generate and execute unbounded code.',
        bullets: [
          'Browser, API, file, data, AI, and control-flow steps',
          'Local execution through flyto-core',
          'Stored workflows, variables, runs, evidence, and replay',
        ],
      },
      {
        title: 'MCP tools from real workflows',
        body:
          'Add an MCP trigger, inspect the generated JSON Schema, run the tool in MCP Studio, and connect a compatible client over stdio or Streamable HTTP.',
        bullets: [
          'No separate MCP server project for each workflow',
          'Schema-driven arguments and live response inspection',
          'Source, contract, risk, approval, and evidence metadata',
        ],
      },
      {
        title: 'Local-first boundaries',
        body:
          'The self-hosted Flow edition starts accountless on loopback and does not require hosted identity, analytics, billing, a CDN, or automatic downloads.',
        bullets: [
          'Loopback-only Compose publishing by default',
          'Operator-supplied, SHA-256 verified flyto-core updates',
          'Network access occurs only when a workflow deliberately uses it',
        ],
      },
    ],
    answers: [
      {
        question: 'What is Flyto2 Flow?',
        answer:
          'Flyto2 Flow is a visual workflow and MCP builder. It lets operators assemble deterministic automation, run it locally, and publish the same workflow as an MCP tool for compatible AI clients.',
      },
      {
        question: 'Is Flyto2 Flow open source?',
        answer:
          'The Flow application source repository is not public. Flow CE is currently available through its public Docker image and documentation. Its flyto-core execution runtime is open source under Apache-2.0.',
      },
      {
        question: 'Does Flow require a cloud account?',
        answer:
          'No. The self-hosted edition starts with one local accountless workspace on loopback. Hosted collaboration and managed services are separate product boundaries.',
      },
      {
        question: 'Is there a Flyto2 Flow Community Edition Docker image?',
        answer:
          'Yes. Flyto2 publishes the multi-architecture Community Edition image at docker.io/flyto2/flow. Pin a reviewed version or release digest, keep the default loopback binding, and retain the flyto-flow-data volume when replacing the container.',
      },
    ],
    related: [
      { label: 'Visual MCP builder', href: '/flow/mcp-builder' },
      { label: 'Self-hosted browser automation', href: '/flow/browser-automation' },
      { label: 'n8n alternative', href: '/flow/n8n-alternative' },
      { label: 'Flow articles', href: 'https://blog.flyto2.com/flow/' },
    ],
  },
  {
    family: 'flow',
    slug: ['mcp-builder'],
    path: 'flow/mcp-builder',
    eyebrow: 'Visual MCP Builder',
    title: 'Use a visual MCP builder to turn workflows into agent tools.',
    lede:
      'Design the workflow, add an MCP trigger, inspect its generated contract, test it in the browser, and connect Codex, Claude Code, desktop clients, or another Streamable HTTP client.',
    metaTitle: 'Visual MCP Builder for Workflow Automation',
    metaDescription:
      'Flyto2 Flow is a self-hosted visual MCP builder. Publish a tested workflow as an agent tool with generated JSON Schema, stdio and Streamable HTTP transports, and audit metadata.',
    screenshot: flowScreenshot,
    screenshotAlt:
      'Visual MCP builder in Flyto2 Flow with workflow tool discovery, generated arguments, and response testing',
    primaryCta: { label: 'Read the Flow docs', href: FLOW_DOCS },
    secondaryCta: { label: 'MCP builder docs', href: 'https://docs.flyto2.com/flow/mcp-builder' },
    sections: [
      {
        title: 'Contract first',
        body:
          'Each published tool is backed by a workflow contract rather than an opaque prompt. The studio shows the generated input schema before an agent calls it.',
        bullets: [
          'JSON Schema generated from workflow inputs',
          'Stable tool identity and deterministic fingerprint',
          'Explicit contract version and source workflow',
        ],
      },
      {
        title: 'Test before connecting',
        body:
          'Run the tool from MCP Studio with the same schema an external client receives, then inspect response history and evidence before sharing configuration.',
        bullets: [
          'Schema-driven test form',
          'Live response and session history',
          'Copy-ready client configuration',
        ],
      },
      {
        title: 'Audit every tool',
        body:
          'Tool metadata records risk, approval policy, evidence references, and the workflow that produced the contract.',
        bullets: [
          'Risk and approval context',
          'Evidence references for completed runs',
          'Stdio and Streamable HTTP transports',
        ],
      },
    ],
    answers: [
      {
        question: 'Do I need to write an MCP server?',
        answer:
          'Not for a Flow workflow. Add an MCP trigger and Flow exposes the workflow through its built-in MCP runtime with a generated schema and tool metadata.',
      },
      {
        question: 'Which MCP clients can connect?',
        answer:
          'Flow provides configuration for compatible stdio and Streamable HTTP clients, including Codex, Claude Code, desktop clients, and other clients that implement the MCP transport.',
      },
    ],
    related: [
      { label: 'Flow overview', href: '/flow' },
      { label: 'MCP server documentation', href: 'https://docs.flyto2.com/mcp/' },
      { label: 'MCP implementation guide', href: 'https://blog.flyto2.com/posts/mcp-server-guide' },
    ],
  },
  {
    family: 'flow',
    slug: ['browser-automation'],
    path: 'flow/browser-automation',
    eyebrow: 'Self-Hosted Browser Automation',
    title: 'Run self-hosted browser automation with evidence and replay.',
    lede:
      'Use visual browser steps with APIs, files, data transforms, and verification in one workflow you host yourself. Keep screenshots, run history, and replay context beside the automation that produced them.',
    metaTitle: 'Self-Hosted Browser Automation with Replay',
    metaDescription:
      'Build self-hosted browser automation with visual steps, Playwright and Chromium, evidence capture, deterministic replay, APIs, files, and data workflows.',
    screenshot: flowScreenshot,
    screenshotAlt:
      'Flyto2 Flow interface for self-hosted browser and MCP workflow automation',
    primaryCta: { label: 'Run Flow locally', href: FLOW_DOCKER },
    secondaryCta: {
      label: 'Browser automation docs',
      href: 'https://docs.flyto2.com/flow/browser-automation',
    },
    sections: [
      {
        title: 'Browser plus workflow context',
        body:
          'A browser action can sit beside API calls, parsing, files, verification, notifications, and control flow without moving data between unrelated tools.',
        bullets: [
          'Chromium and Playwright in the supported image',
          'Visual actions and reusable workflow atoms',
          'API, file, data, and notification steps in the same run',
        ],
      },
      {
        title: 'Evidence, not just success',
        body:
          'Runs can preserve screenshots, outputs, and step context so teams can inspect what the automation actually did.',
        bullets: [
          'Step-level outputs and run history',
          'Replay and diff surfaces',
          'Verification steps for expected results',
        ],
      },
      {
        title: 'Deliberate network access',
        body:
          'The local application has no implicit phone-home requirement. A workflow reaches a site only when the operator adds and runs a network-capable step.',
        bullets: [
          'Loopback binding by default',
          'No required hosted identity or analytics',
          'Operator-controlled reverse proxy and MCP token',
        ],
      },
    ],
    answers: [
      {
        question: 'Is Flyto2 Flow a Playwright replacement?',
        answer:
          'Flow uses proven browser automation components and adds a visual workflow, module contracts, evidence, replay, and MCP publishing. Playwright remains a better fit when a team wants to author and own browser code directly.',
      },
      {
        question: 'Can browser workflows run without the Flyto2 cloud?',
        answer:
          'Yes. The self-hosted edition runs locally with Chromium and Playwright included in its supported public Docker image.',
      },
    ],
    related: [
      { label: 'Flow overview', href: '/flow' },
      { label: 'Browser module reference', href: 'https://docs.flyto2.com/modules/browser' },
      { label: 'Browser automation guide', href: 'https://blog.flyto2.com/posts/ai-browser-automation-guide' },
    ],
  },
  {
    family: 'flow',
    slug: ['n8n-alternative'],
    path: 'flow/n8n-alternative',
    eyebrow: 'n8n Alternative',
    title: 'A local-first n8n alternative for visual MCP and browser workflows.',
    lede:
      'Choose Flyto2 Flow when the important requirement is a self-hosted visual workflow that can become an MCP tool, run browser automation, and retain evidence and replay context. Choose n8n when its integration ecosystem and operating model fit better.',
    metaTitle: 'Local-First n8n Alternative for MCP Workflows',
    metaDescription:
      'Compare Flyto2 Flow as a self-hosted n8n alternative for visual MCP tools, browser automation, deterministic modules, evidence, and replay.',
    screenshot: flowScreenshot,
    screenshotAlt:
      'Flyto2 Flow visual MCP workflow interface for teams evaluating an n8n alternative',
    primaryCta: { label: 'Explore Flyto2 Flow', href: '/flow' },
    secondaryCta: {
      label: 'Read the full comparison',
      href: 'https://blog.flyto2.com/posts/n8n-alternative',
    },
    sections: [
      {
        title: 'Where Flow is different',
        body:
          'Flow centers on visual MCP publishing, browser execution, deterministic flyto-core modules, and evidence-aware replay.',
        bullets: [
          'A workflow can become an MCP tool',
          'Browser automation ships inside the supported image',
          'Run evidence and replay are first-class surfaces',
        ],
      },
      {
        title: 'Where n8n may fit better',
        body:
          'n8n has a large connector ecosystem and a mature automation community. A useful comparison should evaluate the actual integrations, licensing, hosting, and operations a team needs.',
        bullets: [
          'Compare required integrations, not logo counts',
          'Review each product\'s current distribution and terms before deployment',
          'Test the same workflow and failure cases in both tools',
        ],
      },
      {
        title: 'A reproducible evaluation',
        body:
          'Build one real workflow, force one step to fail, inspect the recovery path, and compare how each product exposes inputs, outputs, credentials, logs, and evidence.',
        bullets: [
          'Use the same browser and API task',
          'Record setup time and recovery behavior',
          'Keep the workflow definition and outputs with the comparison',
        ],
      },
    ],
    answers: [
      {
        question: 'Is the Flyto2 Flow application source public?',
        answer:
          'No. The Flow application source repository is not public. The flyto-core runtime remains open source under Apache-2.0; that does not make the complete Flow application open source.',
      },
      {
        question: 'Is Flyto2 Flow free?',
        answer:
          'Flow CE is currently available through its public Docker image and documentation. Review current product terms for your intended use; do not infer application-source availability from the public image.',
      },
    ],
    related: [
      { label: 'Flow overview', href: '/flow' },
      { label: 'MCP builder', href: '/flow/mcp-builder' },
      { label: 'n8n comparison article', href: 'https://blog.flyto2.com/posts/n8n-alternative' },
    ],
  },
  {
    family: 'warroom',
    slug: [],
    path: 'warroom',
    eyebrow: 'Flyto2 Warroom',
    title: 'Validate findings and remediation in one security validation workspace.',
    lede:
      'Flyto2 Warroom is a security validation and CTEM operations platform. Warroom CE is currently available through public Docker images and documentation; the Warroom application source repository is not public.',
    metaTitle: 'CTEM and Security Validation Platform',
    metaDescription:
      'Flyto2 Warroom is a CTEM and security validation platform for attack surface context, findings, evidence, remediation, scoring, and reports.',
    screenshot: warroomScreenshot,
    screenshotAlt:
      'Flyto2 Warroom security validation workspace showing projects, posture, evidence, and operational status',
    primaryCta: { label: 'Get Warroom CE on Docker Hub', href: WARROOM_DOCKER },
    secondaryCta: { label: 'Read Warroom documentation', href: WARROOM_DOCS },
    sections: [
      {
        title: 'Bring existing findings',
        body:
          'Warroom is an operational layer above existing scanners and security systems, not a claim to replace every tool in the stack.',
        bullets: [
          'ASM, EASM, SAST, DAST, CSPM, SIEM, and code inputs',
          'Source-labeled findings tied to owned assets',
          'BYO integration and bridge contracts',
        ],
      },
      {
        title: 'Validate before mobilizing',
        body:
          'Promote prioritized findings into controlled validation plans, then attach the resulting evidence to the decision and remediation record.',
        bullets: [
          'Consent and scope checks for active validation',
          'Attack-path and pentest evidence',
          'Replayable screenshots, logs, and reports',
        ],
      },
      {
        title: 'Operate the CTEM loop',
        body:
          'Use one workspace for discovery, prioritization, validation, remediation, and proof instead of moving static exports between teams.',
        bullets: [
          'Posture and score events',
          'Remediation ownership and status',
          'Evidence-backed reporting and compliance context',
        ],
      },
    ],
    answers: [
      {
        question: 'What is Flyto2 Warroom?',
        answer:
          'Flyto2 Warroom is a CTEM and security validation workspace that correlates findings, assets, repositories, evidence, remediation, scoring, and reports.',
      },
      {
        question: 'Is Flyto2 Warroom open source?',
        answer:
          'The Warroom application source repository is not public. Warroom CE is currently available through public Docker images and documentation; review current product terms before use.',
      },
      {
        question: 'Does Warroom replace vulnerability scanners?',
        answer:
          'No. It accepts findings from existing tools, adds asset and code context, supports controlled validation, and keeps evidence beside remediation decisions.',
      },
    ],
    related: [
      { label: 'CTEM platform', href: '/warroom/ctem' },
      { label: 'Security validation', href: '/warroom/security-validation' },
      { label: 'Attack surface management', href: '/warroom/attack-surface-management' },
      { label: 'Security articles', href: 'https://blog.flyto2.com/security/' },
    ],
  },
  {
    family: 'warroom',
    slug: ['ctem'],
    path: 'warroom/ctem',
    eyebrow: 'CTEM Platform',
    title: 'Run continuous threat exposure management as an evidence-backed loop.',
    lede:
      'Connect discovery, prioritization, validation, remediation, and verification without flattening every scanner signal into one undifferentiated queue.',
    metaTitle: 'Evidence-Backed Continuous Threat Exposure Management',
    metaDescription:
      'Operate a continuous threat exposure management program with asset context, prioritization, controlled validation, remediation ownership, evidence, and verification.',
    screenshot: warroomScreenshot,
    screenshotAlt:
      'Flyto2 Warroom CTEM platform for security posture, findings, evidence, and remediation operations',
    primaryCta: { label: 'Read Warroom CE docs', href: WARROOM_DOCS },
    secondaryCta: { label: 'CTEM implementation docs', href: 'https://docs.flyto2.com/warroom/closed-loop' },
    sections: [
      {
        title: 'Scope and discover',
        body:
          'Start with owned assets, repositories, domains, and source-labeled findings so later validation remains tied to scope.',
        bullets: [
          'Asset and repository context',
          'External exposure and scanner inputs',
          'Ownership and source provenance',
        ],
      },
      {
        title: 'Prioritize and validate',
        body:
          'Use business context, reachability, evidence, and safe validation to distinguish an urgent exposure from an unverified alert.',
        bullets: [
          'Risk and posture signals',
          'Consent-aware validation plans',
          'Evidence attached to findings and attack paths',
        ],
      },
      {
        title: 'Remediate and verify',
        body:
          'Assign remediation, preserve the decision trail, and verify the result with the same context used to prioritize the work.',
        bullets: [
          'Remediation ownership and status',
          'Score events and reports',
          'Closed-loop verification evidence',
        ],
      },
    ],
    answers: [
      {
        question: 'What does a CTEM platform do?',
        answer:
          'A CTEM platform supports a continuous operating loop for scoping, discovery, prioritization, validation, remediation, and verification. It should preserve context and evidence across those stages.',
      },
      {
        question: 'Is CTEM the same as vulnerability management?',
        answer:
          'No. Vulnerability management is an important input, while CTEM broadens the program to exposure scope, attack paths, validation, remediation, and repeated verification.',
      },
    ],
    related: [
      { label: 'Warroom overview', href: '/warroom' },
      { label: 'CTEM explainer', href: 'https://blog.flyto2.com/posts/what-is-ctem-continuous-threat-exposure-management' },
      { label: 'Closed-loop docs', href: 'https://docs.flyto2.com/warroom/closed-loop' },
    ],
  },
  {
    family: 'warroom',
    slug: ['security-validation'],
    path: 'warroom/security-validation',
    eyebrow: 'Security Validation Platform',
    title: 'Turn prioritized findings into controlled security validation and defensible evidence.',
    lede:
      'Plan what is safe to test, enforce ownership and consent, capture the result, and keep proof beside remediation instead of treating a scanner export as the final answer.',
    metaTitle: 'Security Validation Platform with Evidence',
    metaDescription:
      'Flyto2 Warroom runs security validation on prioritized findings. Active testing is gated by ownership and consent, and the evidence stays beside remediation.',
    screenshot: '/assets/img/warroom/16-security-queue.png',
    screenshotAlt:
      'Flyto2 Warroom security validation queue with scoped findings and evidence-backed operational status',
    primaryCta: { label: 'Read validation docs', href: WARROOM_DOCS },
    secondaryCta: { label: 'Validation workflow docs', href: 'https://docs.flyto2.com/warroom/surfaces/pentest' },
    sections: [
      {
        title: 'Validate the right thing',
        body:
          'Security validation starts from a prioritized, owned, and scoped finding rather than a generic request to attack a target.',
        bullets: [
          'Asset ownership and source context',
          'Explicit consent for active testing',
          'Role and capability checks before execution',
        ],
      },
      {
        title: 'Capture useful proof',
        body:
          'Evidence should explain what ran, what happened, and what an operator should do next.',
        bullets: [
          'Screenshots, DOM, network, and API context where available',
          'Step history and replay references',
          'Reports tied to findings and remediation',
        ],
      },
      {
        title: 'Fail closed',
        body:
          'A missing entitlement, denied role, invalid scope, connector error, or failed evidence check should stop the action rather than silently downgrade controls.',
        bullets: [
          'Backend authorization before active work',
          'Tenant and organization isolation',
          'Audit trail for decisions and execution',
        ],
      },
    ],
    answers: [
      {
        question: 'What is automated security validation?',
        answer:
          'Automated security validation uses controlled checks to test whether a prioritized exposure is reachable or exploitable, then records evidence and remediation context. It must still enforce scope, consent, and authorization.',
      },
      {
        question: 'Can validation run against any target?',
        answer:
          'No. Active testing should require verified ownership, explicit scope, consent, and the correct operator capability before execution.',
      },
    ],
    related: [
      { label: 'Warroom overview', href: '/warroom' },
      { label: 'Pentest vs vulnerability scan', href: 'https://blog.flyto2.com/posts/pentest-vs-vulnerability-scan-vs-red-team' },
      { label: 'Pentest docs', href: 'https://docs.flyto2.com/warroom/surfaces/pentest' },
    ],
  },
  {
    family: 'warroom',
    slug: ['attack-surface-management'],
    path: 'warroom/attack-surface-management',
    eyebrow: 'Attack Surface Management',
    title: 'Run attack surface management as the discovery stage of the CTEM loop.',
    lede:
      'Use attack surface data as an input to an operating loop. Reconcile domains, repositories, scanner findings, ownership, validation evidence, and remediation instead of stopping at discovery.',
    metaTitle: 'Attack Surface Management for CTEM Operations',
    metaDescription:
      'Flyto2 Warroom treats attack surface management as a CTEM input, connecting EASM findings to owned assets, repositories, consent-gated validation, and remediation.',
    screenshot: '/assets/img/warroom/26-asset-map.png',
    screenshotAlt:
      'Flyto2 Warroom attack surface asset map connecting domains, repositories, findings, and security context',
    primaryCta: { label: 'Get Warroom CE images', href: WARROOM_DOCKER },
    secondaryCta: {
      label: 'Attack surface docs',
      href: 'https://docs.flyto2.com/warroom/surfaces/attack-surface',
    },
    sections: [
      {
        title: 'Discovery is an input',
        body:
          'External attack surface management tools find assets and exposure. Warroom keeps their source labels and connects them to internal ownership and code context.',
        bullets: [
          'Domains, services, repositories, and source provenance',
          'Imported EASM, ASM, and scanner findings',
          'Ownership and business context',
        ],
      },
      {
        title: 'Prioritize with context',
        body:
          'A public service, vulnerable dependency, reachable path, and business-critical owner together tell a more useful story than an isolated severity score.',
        bullets: [
          'Asset and repository relationships',
          'Exposure, exploitability, and evidence context',
          'Score events with traceable inputs',
        ],
      },
      {
        title: 'Close the loop',
        body:
          'Promote important exposure into validation, assign remediation, and preserve proof that the change actually reduced risk.',
        bullets: [
          'Controlled validation plans',
          'Remediation records and ownership',
          'Verification evidence and reports',
        ],
      },
    ],
    answers: [
      {
        question: 'Does Flyto2 replace EASM tools?',
        answer:
          'No. Warroom can ingest external attack surface findings and connect them to assets, repositories, validation, remediation, and evidence. Existing EASM and ASM tools remain useful discovery inputs.',
      },
      {
        question: 'What is the difference between ASM and CTEM?',
        answer:
          'Attack surface management focuses on discovering and monitoring assets and exposure. CTEM uses that data inside a broader loop that includes prioritization, validation, remediation, and verification.',
      },
    ],
    related: [
      { label: 'Warroom overview', href: '/warroom' },
      { label: 'Attack surface guide', href: 'https://blog.flyto2.com/posts/attack-surface-management-guide' },
      { label: 'Attack surface docs', href: 'https://docs.flyto2.com/warroom/surfaces/attack-surface' },
    ],
  },
];

export function productIntentPage(family: ProductFamily, slug: string[] = []) {
  const normalizedSlug = slug.join('/');
  return productIntentPages.find(
    (page) => page.family === family && page.slug.join('/') === normalizedSlug,
  );
}

export function productIntentParams(family: ProductFamily) {
  return productIntentPages
    .filter((page) => page.family === family)
    .map((page) => ({ slug: page.slug }));
}
