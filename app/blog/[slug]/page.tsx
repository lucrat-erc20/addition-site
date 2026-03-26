// app/blog/[slug]/page.tsx

import { getPost, getAllSlugs, formatDate } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Pre-render all blog post pages at build time
export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

// Dynamic SEO metadata per post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title:       `${post.title} — ASMR Calculator Blog`,
    description: post.description,
    openGraph: {
      title:       post.title,
      description: post.description,
      type:        'article',
      publishedTime: post.date,
      tags:        post.tags,
    },
  };
}

// Insert an ad div every AD_INTERVAL paragraphs
const AD_INTERVAL = 5;
const AD_ID = 'container-38d4986bf6dea79bb7233722f8c2b358';

function AdSlot() {
  return (
    <div style={{
      margin: '32px 0',
      padding: '16px',
      background: '#0a0a0a',
      border: '1px solid #1a1a1a',
      borderRadius: 8,
      minHeight: 90,
    }}>
      <div id={AD_ID} />
    </div>
  );
}

// Split markdown into paragraphs and inject ads every N paragraphs
function renderContentWithAds(content: string) {
  // Split on double newlines to get paragraph blocks
  const blocks = content.split(/\n\n+/);
  const result: React.ReactNode[] = [];

  blocks.forEach((block, i) => {
    // Render the block as pre-formatted (we use a simple prose renderer below)
    result.push(
      <div key={`block-${i}`} className="prose-block" dangerouslySetInnerHTML={{ __html: markdownToHtml(block) }} />
    );

    // Insert ad every AD_INTERVAL blocks (but not at the very end)
    if ((i + 1) % AD_INTERVAL === 0 && i < blocks.length - 1) {
      result.push(<AdSlot key={`ad-${i}`} />);
    }
  });

  return result;
}

// Lightweight markdown → HTML converter (no external deps)
function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#c8a84b">$1</a>')
    // Inline code
    .replace(/`(.+?)`/g, '<code style="background:#1a1a1a;padding:2px 6px;border-radius:3px;font-family:monospace;color:#c8a84b">$1</code>')
    // Unordered lists
    // Unordered lists
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[^]*?<\/li>(\s*<li>[^]*?<\/li>)*)/g, '<ul style="margin:12px 0;padding-left:24px;color:#d1d5db">$1</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #c8a84b;padding-left:16px;color:#9ca3af;margin:16px 0">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #1e1e1e;margin:24px 0">')
    // Paragraphs (wrap bare text)
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p style="margin:0 0 16px;line-height:1.75;color:#d1d5db">$1</p>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // JSON-LD Article schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'ASMR Calculator' },
    publisher: { '@type': 'Organization', name: 'ASMR Calculator', url: 'https://addition.site' },
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #000)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      padding: '48px 24px',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Back link */}
        <Link href="/blog" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Blog
        </Link>

        {/* Post header */}
        <div style={{ marginTop: 24, marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ background: '#1e1e1e', color: '#6b7280', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, border: '1px solid #2a2a2a' }}>
                #{tag}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.25, marginBottom: 16, color: '#fff' }}>
            {post.title}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, marginBottom: 16 }}>
            {post.description}
          </p>
          <span style={{ color: '#4b5563', fontSize: '0.8rem' }}>
            {formatDate(post.date)}
          </span>
          <hr style={{ border: 'none', borderTop: '1px solid #1e1e1e', margin: '24px 0' }} />
        </div>

        {/* Post content with injected ads */}
        <div style={{ fontSize: '1rem' }}>
          {renderContentWithAds(post.content)}
        </div>

        {/* Bottom ad */}
        <AdSlot />

        {/* CTA back to calculator */}
        <div style={{
          marginTop: 48,
          padding: '24px 28px',
          background: '#111',
          border: '1px solid #2a2a2a',
          borderLeft: '4px solid #c8a84b',
          borderRadius: 10,
        }}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: 12 }}>
            Try the calculations from this post yourself →
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            background: '#c8a84b',
            color: '#000',
            fontWeight: 600,
            fontSize: '0.85rem',
            padding: '10px 20px',
            borderRadius: 8,
            textDecoration: 'none',
          }}>
            Open ASMR Calculator
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/blog" style={{ color: '#4b5563', fontSize: '0.8rem', textDecoration: 'none' }}>
            ← Back to all posts
          </Link>
        </div>

      </div>
    </main>
  );
}