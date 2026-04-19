import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/cms";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  coverImageAlt: string;
  publishedAt: Date | null;
  readingTimeMinutes: number | null;
  categoryName: string | null;
}

interface Props {
  posts: RelatedPost[];
  locale: Locale;
  heading: string;
}

function formatDate(d: Date | null, locale: Locale): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RelatedPosts({ posts, locale, heading }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]">
      <h2 className="mb-6 text-xl font-medium text-white/90">{heading}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group glass block overflow-hidden rounded-xl transition-all hover:border-white/15"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-bg-surface">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/15 to-bg-surface" />
              )}
            </div>
            <div className="p-5">
              {post.categoryName ? (
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  {post.categoryName}
                </span>
              ) : null}
              <h3 className="mt-3 text-base font-medium leading-snug text-white transition-colors group-hover:text-primary line-clamp-2">
                {post.title}
              </h3>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/40">
                {post.publishedAt ? (
                  <time className="font-[family-name:var(--font-jetbrains-mono)]">
                    {formatDate(post.publishedAt, locale)}
                  </time>
                ) : null}
                {post.readingTimeMinutes ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)]">
                      {post.readingTimeMinutes} min
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
