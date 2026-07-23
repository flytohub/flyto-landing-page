export type ProductId = 'platform' | 'cloud' | 'code';

export interface NavItem {
  key: string;
  label?: string;
  href: string;
  external?: boolean;
}

export interface NavGroup {
  key: 'product' | 'resources' | 'community';
  items: NavItem[];
}

export const products = [
  { id: 'cloud' as const, name: 'Flow', href: '/flow', icon: 'Cloud', status: 'live' as const },
  { id: 'code' as const, name: 'Warroom', href: '/warroom', icon: 'ShieldCheck', status: 'beta' as const },
];

/**
 * Grouped product navigation. Header renders these as 3 dropdown columns
 * (Product / Resources / Community) instead of one long row of 10 items.
 * Keys map to messages/<locale>.json -> nav.<key>.
 */
export const productNavGrouped: Record<ProductId, NavGroup[]> = {
  platform: [],
  cloud: [
    {
      key: 'product',
      items: [
        { key: 'overview', label: 'Flow overview', href: '/flow' },
        { key: 'mcpBuilder', label: 'Visual MCP builder', href: '/flow/mcp-builder' },
        { key: 'browserAutomation', label: 'Browser automation', href: '/flow/browser-automation' },
        { key: 'n8nAlternative', label: 'n8n alternative', href: '/flow/n8n-alternative' },
      ],
    },
    {
      key: 'resources',
      items: [
        { key: 'docs', label: 'Flow documentation', href: 'https://docs.flyto2.com/flow/', external: true },
        { key: 'blog', label: 'Flow articles', href: 'https://blog.flyto2.com/flow/', external: true },
        { key: 'recipes', label: 'Workflow recipes', href: '/cloud/recipes' },
      ],
    },
    {
      key: 'community',
      items: [
        { key: 'github', label: 'Flow on GitHub', href: 'https://github.com/flytohub/flyto-flow', external: true },
        { key: 'community', href: '/community' },
        { key: 'discussions', href: '/cloud/discussions' },
      ],
    },
  ],
  code: [
    {
      key: 'product',
      items: [
        { key: 'overview', label: 'Warroom overview', href: '/warroom' },
        { key: 'ctem', label: 'CTEM platform', href: '/warroom/ctem' },
        { key: 'securityValidation', label: 'Security validation', href: '/warroom/security-validation' },
        { key: 'attackSurface', label: 'Attack surface management', href: '/warroom/attack-surface-management' },
      ],
    },
    {
      key: 'resources',
      items: [
        { key: 'docs', label: 'Warroom documentation', href: 'https://docs.flyto2.com/warroom/', external: true },
        { key: 'blog', label: 'Security articles', href: 'https://blog.flyto2.com/security/', external: true },
        { key: 'oss', label: 'Self-hosted CE', href: '/open-source' },
      ],
    },
    {
      key: 'community',
      items: [
        { key: 'github', label: 'Warroom on GitHub', href: 'https://github.com/flytohub/flyto-warroom', external: true },
        { key: 'community', href: '/community' },
        { key: 'discussions', href: '/code/discussions' },
      ],
    },
  ],
};

/**
 * Flat fallback: legacy callers / mobile menu still consume a flat list.
 * Derived from the grouped structure so they stay in sync.
 */
export const productNav: Record<ProductId, NavItem[]> = {
  platform: [],
  cloud: productNavGrouped.cloud.flatMap((g) => g.items),
  code: productNavGrouped.code.flatMap((g) => g.items),
};

export function detectProduct(pathname: string): ProductId {
  const stripped = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  if (stripped.startsWith('/flow') || stripped.startsWith('/cloud')) return 'cloud';
  if (stripped.startsWith('/warroom') || stripped.startsWith('/code')) return 'code';
  return 'platform';
}
