"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualEditor, BilingualField } from "@/components/admin/ui/BilingualEditor";
import { SlugInput } from "@/components/admin/ui/SlugInput";
import { PublishControls } from "@/components/admin/ui/PublishControls";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { TiptapEditor } from "@/components/admin/ui/TiptapEditor";
import { Bot, Sparkles } from "lucide-react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/admin/actions/blog.actions";

interface BlogPostData {
  id?: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  contentEs: string;
  contentEn: string;
  coverImage: string;
  coverImageAltEs: string;
  coverImageAltEn: string;
  ogImage: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  status: "draft" | "published" | "scheduled";
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  readingTimeMinutes: number | null;
  tags: string[];
  categoryId: string | null;
}

const defaultPost: BlogPostData = {
  slug: "",
  titleEs: "",
  titleEn: "",
  excerptEs: "",
  excerptEn: "",
  contentEs: "",
  contentEn: "",
  coverImage: "",
  coverImageAltEs: "",
  coverImageAltEn: "",
  ogImage: "",
  seoTitleEs: "",
  seoTitleEn: "",
  seoDescriptionEs: "",
  seoDescriptionEn: "",
  status: "draft",
  translationStatusEn: "pending",
  readingTimeMinutes: null,
  tags: [],
  categoryId: null,
};

interface CategoryOption {
  id: string;
  slug: string;
  nameEs: string;
}

interface BlogFormProps {
  initialData?: Partial<BlogPostData> & { id?: string };
  isNew?: boolean;
  categories?: CategoryOption[];
}

export default function BlogForm({ initialData, isNew = true, categories = [] }: BlogFormProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPostData>({
    ...defaultPost,
    ...initialData,
    titleEn: initialData?.titleEn || "",
    excerptEn: initialData?.excerptEn || "",
    contentEn: initialData?.contentEn || "",
    seoTitleEn: initialData?.seoTitleEn || "",
    seoDescriptionEn: initialData?.seoDescriptionEn || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestedByAi, setSuggestedByAi] = useState(false);
  const autoSuggestTriedRef = useRef(false);

  async function suggestCategory(options?: { silentAuto?: boolean }): Promise<void> {
    if (!post.titleEs.trim()) return;
    if (categories.length === 0) return;
    setSuggesting(true);
    try {
      const res = await fetch("/api/admin/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.titleEs,
          excerpt: post.excerptEs,
          content: post.contentEs,
        }),
      });
      const data = (await res.json()) as {
        categoryId?: string;
        categoryName?: string;
        confidence?: string;
        error?: string;
      };
      if (!res.ok || !data.categoryId) return;

      if (
        !options?.silentAuto &&
        post.categoryId &&
        post.categoryId !== data.categoryId &&
        !confirm(`¿Cambiar categoría a "${data.categoryName}"?`)
      ) {
        return;
      }

      // In silent-auto mode, never overwrite a category the user already picked.
      if (options?.silentAuto && post.categoryId) return;

      update("categoryId", data.categoryId);
      setSuggestedByAi(true);
    } catch {
      // silent fail — user can retry
    } finally {
      setSuggesting(false);
    }
  }

  // Auto-suggest once on new posts when title and excerpt are populated and
  // no category has been chosen yet. Runs at most once per mount.
  useEffect(() => {
    if (!isNew) return;
    if (autoSuggestTriedRef.current) return;
    if (post.categoryId) return;
    if (!post.titleEs.trim() || !post.excerptEs.trim()) return;
    autoSuggestTriedRef.current = true;
    void suggestCategory({ silentAuto: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.titleEs, post.excerptEs, isNew]);

  function update<K extends keyof BlogPostData>(key: K, value: BlogPostData[K]) {
    setPost((prev) => ({ ...prev, [key]: value }));
  }

  async function translateField(fieldEs: keyof BlogPostData, fieldEn: keyof BlogPostData) {
    const textEs = post[fieldEs];
    if (!textEs || typeof textEs !== "string") return;

    setTranslatingField(fieldEs as string);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textEs,
          sourceField: fieldEs,
          contentType: "blog",
        }),
      });
      const data = await res.json();
      if (data.translation) {
        update(fieldEn, data.translation);
      }
    } catch {
      // silent fail, user can retry
    } finally {
      setTranslatingField(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      if (isNew) {
        const result = await createBlogPost(post);
        router.push(`/admin/blog/${result.id}`);
      } else if (initialData?.id) {
        await updateBlogPost(initialData.id, post);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

    await deleteBlogPost(initialData.id);
    router.push("/admin/blog");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main content area */}
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <BilingualEditor
          translationStatus={post.translationStatusEn}
          onTranslationStatusChange={(s) => update("translationStatusEn", s)}
        >
          {({ activeTab }) => (
            <div className="space-y-6">
              {/* Title */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="Título *"
                  labelEn="Title"
                  valueEs={post.titleEs}
                  valueEn={post.titleEn}
                  onChangeEs={(v) => update("titleEs", v)}
                  onChangeEn={(v) => update("titleEn", v)}
                  onTranslate={() => translateField("titleEs", "titleEn")}
                  translating={translatingField === "titleEs"}
                  placeholder="Título del artículo"
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "Título *" : "Title"}
                  </label>
                  <input
                    type="text"
                    value={activeTab === "es" ? post.titleEs : post.titleEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "titleEs" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Título del artículo"
                  />
                </div>
              )}

              {/* Slug */}
              <SlugInput
                value={post.slug}
                onChange={(v) => update("slug", v)}
                sourceText={post.titleEs}
                prefix="/blog/"
              />

              {/* Excerpt */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="Extracto"
                  labelEn="Excerpt"
                  valueEs={post.excerptEs}
                  valueEn={post.excerptEn}
                  onChangeEs={(v) => update("excerptEs", v)}
                  onChangeEn={(v) => update("excerptEn", v)}
                  multiline
                  rows={3}
                  onTranslate={() => translateField("excerptEs", "excerptEn")}
                  translating={translatingField === "excerptEs"}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "Extracto" : "Excerpt"}
                  </label>
                  <textarea
                    value={activeTab === "es" ? post.excerptEs : post.excerptEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "excerptEs" : "excerptEn", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              )}

              {/* Content — WYSIWYG editor */}
              {activeTab === "side-by-side" ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Contenido</label>
                    <TiptapEditor
                      value={post.contentEs}
                      onChange={(v) => update("contentEs", v)}
                      placeholder="Escribe el contenido en español…"
                      ariaLabel="Contenido en español"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-text-70">Content</label>
                      {post.contentEs && (
                        <button
                          type="button"
                          onClick={() => translateField("contentEs", "contentEn")}
                          disabled={translatingField === "contentEs"}
                          className="flex items-center gap-1.5 rounded-md bg-ia/10 px-2.5 py-1 text-xs font-medium text-ia hover:bg-ia/20 transition-colors disabled:opacity-50"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          {translatingField === "contentEs" ? "Traduciendo..." : "Auto-traducir"}
                        </button>
                      )}
                    </div>
                    <TiptapEditor
                      value={post.contentEn}
                      onChange={(v) => update("contentEn", v)}
                      placeholder="Write the content in English…"
                      ariaLabel="Content in English"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "Contenido" : "Content"}
                  </label>
                  <TiptapEditor
                    key={activeTab}
                    value={activeTab === "es" ? post.contentEs : post.contentEn}
                    onChange={(v) => update(activeTab === "es" ? "contentEs" : "contentEn", v)}
                    placeholder={
                      activeTab === "es"
                        ? "Escribe el contenido en español…"
                        : "Write the content in English…"
                    }
                    ariaLabel={activeTab === "es" ? "Contenido en español" : "Content in English"}
                  />
                </div>
              )}

              {/* SEO section */}
              <details className="rounded-xl border border-border bg-bg-surface">
                <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-text-100 hover:text-primary transition-colors">
                  SEO
                </summary>
                <div className="space-y-4 border-t border-border px-6 py-4">
                  {activeTab === "side-by-side" ? (
                    <>
                      <BilingualField
                        labelEs="SEO Título"
                        labelEn="SEO Title"
                        valueEs={post.seoTitleEs}
                        valueEn={post.seoTitleEn}
                        onChangeEs={(v) => update("seoTitleEs", v)}
                        onChangeEn={(v) => update("seoTitleEn", v)}
                        onTranslate={() => translateField("seoTitleEs", "seoTitleEn")}
                        translating={translatingField === "seoTitleEs"}
                      />
                      <BilingualField
                        labelEs="SEO Descripción"
                        labelEn="SEO Description"
                        valueEs={post.seoDescriptionEs}
                        valueEn={post.seoDescriptionEn}
                        onChangeEs={(v) => update("seoDescriptionEs", v)}
                        onChangeEn={(v) => update("seoDescriptionEn", v)}
                        multiline
                        rows={2}
                        onTranslate={() => translateField("seoDescriptionEs", "seoDescriptionEn")}
                        translating={translatingField === "seoDescriptionEs"}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-text-70">
                          {activeTab === "es" ? "SEO Título" : "SEO Title"}
                        </label>
                        <input
                          type="text"
                          value={activeTab === "es" ? post.seoTitleEs : post.seoTitleEn}
                          onChange={(e) =>
                            update(activeTab === "es" ? "seoTitleEs" : "seoTitleEn", e.target.value)
                          }
                          className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-text-70">
                          {activeTab === "es" ? "SEO Descripción" : "SEO Description"}
                        </label>
                        <textarea
                          value={activeTab === "es" ? post.seoDescriptionEs : post.seoDescriptionEn}
                          onChange={(e) =>
                            update(
                              activeTab === "es" ? "seoDescriptionEs" : "seoDescriptionEn",
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </details>
            </div>
          )}
        </BilingualEditor>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <PublishControls
          status={post.status}
          onStatusChange={(s) => update("status", s)}
          onSave={handleSave}
          onDelete={isNew ? undefined : handleDelete}
          saving={saving}
          isNew={isNew}
        />

        {/* Cover image */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Imagen de portada</h3>
          <ImageUploader
            value={post.coverImage}
            onChange={(url) => update("coverImage", url)}
            folder="blog"
            aspectRatio="16/9"
          />
        </div>

        {/* Reading time */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Tiempo de lectura</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={post.readingTimeMinutes || ""}
              onChange={(e) =>
                update("readingTimeMinutes", e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-20 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-text-40">minutos</span>
          </div>
        </div>

        {/* Category */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-100">Categoría</h3>
            {suggestedByAi && post.categoryId ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ia/10 px-2 py-0.5 text-[10px] font-medium text-ia">
                <Sparkles className="h-3 w-3" />
                Sugerido por IA
              </span>
            ) : null}
          </div>
          <select
            value={post.categoryId || ""}
            onChange={(e) => {
              update("categoryId", e.target.value || null);
              setSuggestedByAi(false);
            }}
            className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm text-text-100 focus:border-primary focus:outline-none"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEs}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void suggestCategory()}
            disabled={suggesting || !post.titleEs.trim() || categories.length === 0}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-ia/10 px-2.5 py-1.5 text-xs font-medium text-ia hover:bg-ia/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {suggesting ? "Analizando..." : "Sugerir con IA"}
          </button>
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Tags</h3>
          <input
            type="text"
            value={post.tags.join(", ")}
            onChange={(e) =>
              update(
                "tags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            placeholder="tag1, tag2, tag3"
            className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
