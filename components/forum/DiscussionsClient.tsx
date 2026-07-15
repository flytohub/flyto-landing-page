'use client';

import dynamic from 'next/dynamic';

type Product = 'cloud' | 'code';

const ClientDiscussionsView = dynamic(
  () => import('./DiscussionsView').then((mod) => mod.DiscussionsView),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="mt-4 h-4 w-72 max-w-full rounded bg-white/5" />
      </div>
    ),
  },
);

export function DiscussionsClient({ product }: { product: Product }) {
  return <ClientDiscussionsView product={product} />;
}
