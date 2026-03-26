// lib/blog.ts

/**
 * Blog utilities — reads .mdx files from /content/blog/
 * Each file must have frontmatter: title, description, date, tags
 * Filename format: YYYY-MM-DD-slug-here.mdx
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

// Get all post metadata sorted newest first
export function getAllPosts(): PostMeta[] {
  ensureBlogDir();
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  return files
    .map(filename => {
      const slug    = filename.replace(/\.mdx?$/, '');
      const raw     = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);

      return {
        slug,
        title:       data.title       || slug,
        description: data.description || '',
        date:        data.date        || slug.slice(0, 10),
        tags:        data.tags        || [],
      } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get a single post including content
export function getPost(slug: string): Post | null {
  ensureBlogDir();

  // Try .mdx then .md
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath  = path.join(BLOG_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw             = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title:       data.title       || slug,
    description: data.description || '',
    date:        data.date        || slug.slice(0, 10),
    tags:        data.tags        || [],
    content,
  };
}

// Get all slugs (for generateStaticParams)
export function getAllSlugs(): string[] {
  ensureBlogDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.mdx?$/, ''));
}

// Format date nicely: "2026-03-24" → "March 24, 2026"
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
