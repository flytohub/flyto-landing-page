export type ProductId = 'platform' | 'cloud' | 'code';

export interface NavItem {
  key: string;
  href: string;
  external?: boolean;
}

export interface NavGroup {
  key: 'product' | 'resources' | 'community';
  items: NavItem[];
}

export const products = [
  { id: 'code'  as const, name: 'Warroom',  href: '/code',  icon: 'ShieldCheck', status: 'beta' as const },
  { id: 'cloud' as const, name: 'Cloud', href: '/cloud', icon: 'Cloud',       status: 'live' as const },
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
        { key: 'overview',  href: '/cloud' },
        { key: 'pricing',   href: '/cloud/pricing' },
        { key: 'download',  href: '/cloud/download' },
        { key: 'changelog', href: '/cloud/changelog' },
      ],
    },
    {
      key: 'resources',
      items: [
        { key: 'integrations', href: '/cloud/integrations' },
        { key: 'recipes',      href: '/cloud/recipes' },
        { key: 'templates',    href: '/cloud/templates' },
        { key: 'useCases',     href: '/cloud/use-cases' },
      ],
    },
    {
      key: 'community',
      items: [
        { key: 'discussions', href: '/cloud/discussions' },
        { key: 'docs',        href: 'https://docs.flyto2.com', external: true },
      ],
    },
  ],
  code: [
    {
      key: 'product',
      items: [
        { key: 'overview', href: '/code' },
        { key: 'platform', href: '/code/platform' },
        { key: 'security', href: '/code/security' },
        { key: 'pricing',  href: '/code/pricing' },
      ],
    },
    {
      key: 'resources',
      items: [
        { key: 'integrations', href: '/code/integrations' },
        { key: 'useCases',     href: '/code/use-cases' },
        { key: 'oss',          href: 'https://pypi.org/project/flyto-indexer/', external: true },
      ],
    },
    {
      key: 'community',
      items: [{ key: 'discussions', href: '/code/discussions' }],
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
  if (stripped.startsWith('/cloud')) return 'cloud';
  if (stripped.startsWith('/code')) return 'code';
  return 'platform';
}
