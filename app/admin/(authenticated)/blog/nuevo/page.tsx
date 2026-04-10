import BlogForm from "@/components/admin/forms/BlogForm";

export default function NuevoBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo artículo</h1>
      <BlogForm isNew />
    </div>
  );
}
