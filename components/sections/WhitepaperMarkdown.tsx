'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/**
 * Render a whitepaper markdown body with GFM (tables, strikethrough) and
 * code highlighting. Styled to match the rest of the site (dark surfaces,
 * violet accents, mono labels).
 */
export function WhitepaperMarkdown({ source }: { source: string }) {
  return (
    <div className="whitepaper-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {source}
      </ReactMarkdown>

      <style jsx global>{`
        .whitepaper-md { color: var(--color-bone-200); font-size: 15px; line-height: 1.75; }

        .whitepaper-md h1 {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.05; letter-spacing: -0.02em;
          margin: 0 0 1.5rem; color: var(--color-bone-100);
        }
        .whitepaper-md h2 {
          font-family: var(--font-display);
          font-size: clamp(24px, 3.5vw, 32px);
          margin: 3rem 0 1rem; color: var(--color-bone-100);
          border-top: 1px solid var(--color-line);
          padding-top: 2rem;
        }
        .whitepaper-md h3 {
          font-family: var(--font-display);
          font-size: 20px; margin: 2rem 0 0.75rem;
          color: var(--color-bone-100);
        }
        .whitepaper-md h4 {
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(167, 139, 250, 0.95);
          margin: 1.5rem 0 0.5rem;
        }
        .whitepaper-md p { margin: 0.75rem 0; }
        .whitepaper-md ul, .whitepaper-md ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .whitepaper-md li { margin: 0.35rem 0; }
        .whitepaper-md strong { color: var(--color-bone-100); font-weight: 600; }
        .whitepaper-md em { color: rgba(167, 139, 250, 0.95); font-style: italic; }
        .whitepaper-md a {
          color: rgb(196, 181, 253);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .whitepaper-md a:hover { color: rgb(221, 214, 254); }

        .whitepaper-md hr {
          border: 0;
          border-top: 1px solid var(--color-line);
          margin: 2.5rem 0;
        }

        .whitepaper-md blockquote {
          border-left: 2px solid rgba(167, 139, 250, 0.5);
          padding: 0.5rem 0 0.5rem 1rem;
          margin: 1rem 0;
          color: var(--color-bone-200);
          font-style: italic;
          background: rgba(167, 139, 250, 0.04);
          border-radius: 0 4px 4px 0;
        }

        .whitepaper-md code {
          font-family: var(--font-mono);
          font-size: 0.875em;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.12em 0.4em;
          border-radius: 4px;
          color: rgb(221, 214, 254);
        }

        .whitepaper-md pre {
          background: var(--color-ink-900);
          border: 1px solid var(--color-line);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-size: 13px;
        }
        .whitepaper-md pre code { background: none; padding: 0; color: var(--color-bone-100); }

        .whitepaper-md table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.25rem 0;
          font-size: 13.5px;
        }
        .whitepaper-md thead { background: rgba(255, 255, 255, 0.04); }
        .whitepaper-md th, .whitepaper-md td {
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--color-line);
          text-align: left;
          vertical-align: top;
        }
        .whitepaper-md th {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-bone-300);
          font-weight: 500;
        }
        .whitepaper-md tbody tr:hover { background: rgba(167, 139, 250, 0.03); }
      `}</style>
    </div>
  );
}
