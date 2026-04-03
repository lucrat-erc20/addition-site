// lib/blog.ts

/**
 * Blog utilities — reads .md / .mdx files from /content/blog/
 * Each file should have frontmatter: title, description, date, slug, tags, author, draft
 * Filename format: slug-here.md  (date prefix stripped by sync action)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  tags:        string[];
  author:      string;
}

export interface Post extends PostMeta {
  content: string;
}

// Ensure the blog directory exists
function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

// Derive a date from the slug as a fallback (handles both date-prefixed and clean slugs)
function dateFromSlug(slug: string): string {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : new Date().toISOString().slice(0, 10);
}

// Get all post metadata sorted newest first, excluding drafts
export function getAllPosts(): PostMeta[] {
  ensureBlogDir();
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  return files
    .map(filename => {
      const filenameSlug = filename.replace(/\.mdx?$/, '');
      const raw          = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data }     = matter(raw);

      // Skip drafts
      if (data.draft === true) return null;

      return {
        slug:        data.slug        || filenameSlug,
        title:       data.title       || filenameSlug,
        description: data.description || '',
        date:        data.date        || dateFromSlug(filenameSlug),
        tags:        data.tags        || [],
        author:      data.author      || 'Bux',
      } as PostMeta;
    })
    .filter(Boolean)
    .sort((a, b) => (a!.date < b!.date ? 1 : -1)) as PostMeta[];
}

// Get a single post including content
export function getPost(slug: string): Post | null {
  ensureBlogDir();

  // Try matching by frontmatter slug first, then fall back to filename
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  for (const filename of files) {
    const filePath         = path.join(BLOG_DIR, filename);
    const raw              = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const filenameSlug     = filename.replace(/\.mdx?$/, '');
    const resolvedSlug     = data.slug || filenameSlug;

    if (resolvedSlug === slug) {
      if (data.draft === true) return null;

      return {
        slug:        resolvedSlug,
        title:       data.title       || filenameSlug,
        description: data.description || '',
        date:        data.date        || dateFromSlug(filenameSlug),
        tags:        data.tags        || [],
        author:      data.author      || 'Bux',
        content,
      };
    }
  }

  return null;
}

// Get all slugs (for generateStaticParams) — uses frontmatter slug if present
export function getAllSlugs(): string[] {
  ensureBlogDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => {
      const raw      = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
      const { data } = matter(raw);
      if (data.draft === true) return null;
      return data.slug || f.replace(/\.mdx?$/, '');
    })
    .filter(Boolean) as string[];
}

// Format date nicely: "2026-03-24" → "March 24, 2026"
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}