import { connection } from "next/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getBlogPosts } from "@/lib/admin/actions/blog.actions";
import { BlogListClient } from "@/components/admin/forms/BlogListClient";

export default async function AdminBlogPage() {
  await connection();
  const { posts, total } = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-text-70">{total} artículos en total</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Link>
      </div>

      <BlogListClient initialPosts={posts} initialTotal={total} />
    </div>
  );
}
