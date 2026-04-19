"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { TranslationBadge } from "@/components/admin/ui/BilingualEditor";
import { deleteBlogPost } from "@/lib/admin/actions/blog.actions";

interface BlogPost {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  categoryId: string | null;
  createdAt: Date;
  publishedAt: Date | null;
}

interface CategorySummary {
  id: string;
  nameEs: string;
  color: string | null;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  draft: { label: "Borrador", class: "bg-finops/10 text-finops" },
  published: { label: "Publicado", class: "bg-staffing/10 text-staffing" },
  scheduled: { label: "Programado", class: "bg-ia/10 text-ia" },
  archived: { label: "Archivado", class: "bg-white/10 text-white/50" },
};

export function BlogListClient({
  initialPosts,
  categoryMap,
}: {
  initialPosts: BlogPost[];
  initialTotal: number;
  categoryMap: Record<string, CategorySummary>;
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;
    await deleteBlogPost(id);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="w-[32%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Título
            </th>
            <th className="w-[16%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Categoría
            </th>
            <th className="w-[12%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Estado
            </th>
            <th className="w-[14%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Trad. EN
            </th>
            <th className="w-[14%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Fecha
            </th>
            <th className="w-[12%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {initialPosts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-text-40">
                No hay artículos que coincidan con los filtros.{" "}
                <Link href="/admin/blog/nuevo" className="text-primary hover:underline">
                  Crear el primero
                </Link>
              </td>
            </tr>
          ) : (
            initialPosts.map((post) => {
              const statusInfo = statusLabels[post.status] || statusLabels.draft;
              const category = post.categoryId ? categoryMap[post.categoryId] : null;
              return (
                <tr key={post.id} className="hover:bg-bg-elevated/50 transition-colors">
                  <td className="px-4 py-4 overflow-hidden">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="block truncate font-medium text-text-100 hover:text-primary transition-colors"
                    >
                      {post.titleEs}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-text-40 font-mono">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    {category ? (
                      <span
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs font-medium text-white/70"
                        style={
                          category.color
                            ? { borderColor: `${category.color}40`, color: category.color }
                            : undefined
                        }
                      >
                        {category.nameEs}
                      </span>
                    ) : (
                      <span className="text-xs text-text-40">Sin categoría</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.class}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <TranslationBadge status={post.translationStatusEn} />
                  </td>
                  <td className="px-4 py-4 text-sm text-text-40">
                    {new Date(post.createdAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-lg p-2 text-text-40 hover:bg-bg-elevated hover:text-primary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
