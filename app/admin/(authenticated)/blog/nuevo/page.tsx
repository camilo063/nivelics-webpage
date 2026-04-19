import BlogForm from "@/components/admin/forms/BlogForm";
import { getBlogCategories } from "@/lib/admin/actions/blog.actions";

export default async function NuevoBlogPage() {
  const categories = await getBlogCategories();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo artículo</h1>
      <BlogForm
        isNew
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, nameEs: c.nameEs }))}
      />
    </div>
  );
}
