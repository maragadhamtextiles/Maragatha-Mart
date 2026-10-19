import { supabase } from "./supabase";
import { BLOG_ARTICLES, DEFAULT_ARTICLE_IMAGE, blogImagePath } from "../data/blogPosts";

/*
 * One list of posts from two places: the articles that ship in the build
 * (src/data/blogPosts.ts) and the older ones in the `blogs` table. A slug in
 * the build wins, so a database post can be rewritten in the repo without a
 * duplicate showing up.
 */

export interface BlogSummary {
  slug: string;
  title: string;
  /** File name under /assets/img/blogs/, a path from the site root, or blank. */
  image: string;
  publishedAt: string;
}

export const DEFAULT_BLOG_IMAGE = DEFAULT_ARTICLE_IMAGE;

/** Where to load a post's picture from; one rule shared with the build. */
export function blogImageSrc(image: string | null | undefined): string {
  return blogImagePath(image);
}

export async function fetchBlogSummaries(limit?: number): Promise<BlogSummary[]> {
  const local: BlogSummary[] = BLOG_ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    image: a.image,
    publishedAt: a.publishedAt,
  }));

  let remote: BlogSummary[] = [];
  const { data, error } = await supabase
    .from("blogs")
    .select("slug, title, image_url, published_at")
    .order("published_at", { ascending: false });
  if (error) {
    // The build's own posts are still worth showing.
    console.error("Error fetching blogs:", error);
  } else {
    const taken = new Set(local.map((b) => b.slug));
    remote = (data || [])
      .filter((b) => !taken.has(b.slug))
      .map((b) => ({
        slug: b.slug,
        title: b.title,
        image: b.image_url,
        publishedAt: b.published_at,
      }));
  }

  const all = [...local, ...remote].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  return limit ? all.slice(0, limit) : all;
}
