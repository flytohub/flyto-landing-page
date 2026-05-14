export type ProductId = 'platform' | 'cloud' | 'code';

export interface NavItem {
  key: string;
  href: string;
  external?: boolean;
}

export const products = [
  { id: 'cloud' as const, name: 'Cloud', href: '/cloud', icon: 'Cloud',       status: 'live' as const },
  { id: 'code'  as const, name: 'Warroom',  href: '/code',  icon: 'ShieldCheck', status: 'beta' as const },
];

// Row-2 navigation per product context.
// Keys map to messages/<locale>.json -> nav.<key>.
export const productNav: Record<ProductId, NavItem[]> = {
  platform: [],
  cloud: [
    { key: 'overview',     href: '/cloud' },
    { key: 'pricing',      href: '/cloud/pricing' },
    { key: 'integrations', href: '/cloud/integrations' },
    { key: 'recipes',      href: '/cloud/recipes' },
    { key: 'useCases',     href: '/cloud/use-cases' },
    { key: 'templates',    href: '/cloud/templates' },
    { key: 'download',     href: '/cloud/download' },
    { key: 'changelog',    href: '/cloud/changelog' },
    { key: 'discussions',  href: '/cloud/discussions' },
    { key: 'docs',         href: 'https://docs.flyto2.com', external: true },
  ],
  code: [
    { key: 'overview',     href: '/code' },
    { key: 'security',     href: '/code/security' },
    { key: 'integrations', href: '/code/integrations' },
    { key: 'useCases',     href: '/code/use-cases' },
    { key: 'pricing',      href: '/code/pricing' },
    { key: 'oss',          href: 'https://pypi.org/project/flyto-indexer/', external: true },
    { key: 'discussions',  href: '/code/discussions' },
  ],
};

export function detectProduct(pathname: string): ProductId {
  // Strip leading /<locale>/ if present
  const stripped = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  if (stripped.startsWith('/cloud')) return 'cloud';
  if (stripped.startsWith('/code')) return 'code';
  return 'platform';
}
