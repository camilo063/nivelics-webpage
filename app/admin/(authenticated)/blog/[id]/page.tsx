import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogCategories } from "@/lib/admin/actions/blog.actions";
import BlogForm from "@/components/admin/forms/BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [post, categories] = await Promise.all([getBlogPost(id), getBlogCategories()]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar artículo</h1>
      <BlogForm
        isNew={false}
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, nameEs: c.nameEs }))}
        initialData={{
          id: post.id,
          slug: post.slug,
          titleEs: post.titleEs,
          titleEn: post.titleEn || "",
          excerptEs: post.excerptEs || "",
          excerptEn: post.excerptEn || "",
          contentEs: post.contentEs || "",
          contentEn: post.contentEn || "",
          coverImage: post.coverImage || "",
          seoTitleEs: post.seoTitleEs || "",
          seoTitleEn: post.seoTitleEn || "",
          seoDescriptionEs: post.seoDescriptionEs || "",
          seoDescriptionEn: post.seoDescriptionEn || "",
          status: post.status as "draft" | "published" | "scheduled",
          translationStatusEn: post.translationStatusEn as
            | "complete"
            | "partial"
            | "pending"
            | "auto",
          readingTimeMinutes: post.readingTimeMinutes,
          tags: (post.tags as string[]) || [],
          categoryId: post.categoryId,
        }}
      />
    </div>
  );
}
