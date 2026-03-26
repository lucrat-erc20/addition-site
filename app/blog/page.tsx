// app/blog/page.tsx

import { getAllPosts, formatDate } from '@/lib/blog';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — ASMR Calculator',
  description: 'Calculator guides, tips, financial advice, and ASMR keyboard content.',
  openGraph: {
    title: 'Blog — ASMR Calculator',
    description: 'Calculator guides, tips, financial advice, and ASMR keyboard content.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const latest = posts[0];
  const recent = posts.slice(1, 6);
  const rest   = posts.slice(6);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #000)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      padding: '48px 24px',
    }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto 48px' }}>
        <Link href="/" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← ASMR Calculator
        </Link>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', letterSpacing: '0.1em', color: '#c8a84b', marginTop: 16, marginBottom: 4 }}>
          The Blog
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Calculator guides, financial tips, and ASMR keyboard content — posted daily.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Latest post — hero */}
        {latest && (
          <Link href={`/blog/${latest.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1c1c1c, #141414)',
              border: '1px solid #2a2a2a',
              borderLeft: '4px solid #c8a84b',
              borderRadius: 12,
              padding: '32px 36px',
              marginBottom: 40,
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ background: '#c8a84b', color: '#000', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4 }}>
                  Latest
                </span>
                {latest.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{ background: '#1e1e1e', color: '#6b7280', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, border: '1px solid #2a2a2a' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
                {latest.title}
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
                {latest.description}
              </p>
              <span style={{ color: '#c8a84b', fontSize: '0.8rem' }}>
                {formatDate(latest.date)} &nbsp;→ Read post
              </span>
            </div>
          </Link>
        )}

        {/* Recent posts grid */}
        {recent.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', color: '#6b7280', marginBottom: 20 }}>
              Recent Posts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
              {recent.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#111',
                    border: '1px solid #1e1e1e',
                    borderRadius: 10,
                    padding: '20px 22px',
                    height: '100%',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{ color: '#6b7280', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e5e7eb', marginBottom: 8, lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: 12 }}>
                      {post.description.slice(0, 100)}{post.description.length > 100 ? '...' : ''}
                    </p>
                    <span style={{ color: '#c8a84b', fontSize: '0.72rem' }}>
                      {formatDate(post.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* All posts list */}
        {rest.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', color: '#6b7280', marginBottom: 16 }}>
              All Posts
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 4px',
                    borderBottom: '1px solid #1a1a1a',
                    gap: 16,
                  }}>
                    <span style={{ color: '#d1d5db', fontSize: '0.88rem' }}>{post.title}</span>
                    <span style={{ color: '#4b5563', fontSize: '0.72rem', flexShrink: 0 }}>{formatDate(post.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4b5563', padding: '80px 0' }}>
            <p>No posts yet. Add .mdx files to /content/blog/ to get started.</p>
          </div>
        )}

      </div>
    </main>
  );
}
