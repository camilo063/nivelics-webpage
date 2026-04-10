import { connection } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, casosExito, servicios, industrias } from "@/lib/db/schema/admin";
import { isNull } from "drizzle-orm";
import { Check, AlertTriangle } from "lucide-react";

interface SeoEntry {
  page: string;
  url: string;
  titleEs: string | null;
  titleEn: string | null;
  descEs: string | null;
  descEn: string | null;
}

async function getSeoData(): Promise<SeoEntry[]> {
  if (!db) return [];

  const entries: SeoEntry[] = [];

  const svcs = await db
    .select({
      slugEs: servicios.slugEs,
      titleEs: servicios.titleEs,
      seoTitleEs: servicios.seoTitleEs,
      seoTitleEn: servicios.seoTitleEn,
      seoDescriptionEs: servicios.seoDescriptionEs,
      seoDescriptionEn: servicios.seoDescriptionEn,
    })
    .from(servicios)
    .where(isNull(servicios.deletedAt));

  for (const s of svcs) {
    entries.push({
      page: s.titleEs,
      url: `/servicios/${s.slugEs}`,
      titleEs: s.seoTitleEs,
      titleEn: s.seoTitleEn,
      descEs: s.seoDescriptionEs,
      descEn: s.seoDescriptionEn,
    });
  }

  const inds = await db
    .select({
      slugEs: industrias.slugEs,
      nameEs: industrias.nameEs,
      seoTitleEs: industrias.seoTitleEs,
      seoTitleEn: industrias.seoTitleEn,
      seoDescriptionEs: industrias.seoDescriptionEs,
      seoDescriptionEn: industrias.seoDescriptionEn,
    })
    .from(industrias)
    .where(isNull(industrias.deletedAt));

  for (const i of inds) {
    entries.push({
      page: i.nameEs,
      url: `/industrias/${i.slugEs}`,
      titleEs: i.seoTitleEs,
      titleEn: i.seoTitleEn,
      descEs: i.seoDescriptionEs,
      descEn: i.seoDescriptionEn,
    });
  }

  const posts = await db
    .select({
      slug: blogPosts.slug,
      titleEs: blogPosts.titleEs,
      seoTitleEs: blogPosts.seoTitleEs,
      seoTitleEn: blogPosts.seoTitleEn,
      seoDescriptionEs: blogPosts.seoDescriptionEs,
      seoDescriptionEn: blogPosts.seoDescriptionEn,
    })
    .from(blogPosts)
    .where(isNull(blogPosts.deletedAt));

  for (const p of posts) {
    entries.push({
      page: p.titleEs,
      url: `/blog/${p.slug}`,
      titleEs: p.seoTitleEs,
      titleEn: p.seoTitleEn,
      descEs: p.seoDescriptionEs,
      descEn: p.seoDescriptionEn,
    });
  }

  return entries;
}

function SeoCheck({ value, maxLen }: { value: string | null; maxLen: number }) {
  if (!value)
    return (
      <span className="text-red-400">
        <AlertTriangle className="inline h-3.5 w-3.5" /> vacío
      </span>
    );
  const len = value.length;
  const ok = len > 0 && len <= maxLen;
  return (
    <span className={ok ? "text-staffing" : "text-finops"}>
      {ok ? (
        <Check className="inline h-3.5 w-3.5" />
      ) : (
        <AlertTriangle className="inline h-3.5 w-3.5" />
      )}{" "}
      {len}ch
    </span>
  );
}

export default async function SeoPage() {
  await connection();
  const entries = await getSeoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="text-text-70">Vista global del estado SEO de todas las páginas</p>
      </div>

      <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Página
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Title ES
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Title EN
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Desc ES
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Desc EN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-40">
                  No hay páginas con SEO configurado. Agrega contenido primero.
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-bg-elevated/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-100 truncate max-w-[200px]">
                      {entry.page}
                    </div>
                    <div className="text-xs text-text-40 font-mono">{entry.url}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <SeoCheck value={entry.titleEs} maxLen={60} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <SeoCheck value={entry.titleEn} maxLen={60} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <SeoCheck value={entry.descEs} maxLen={155} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <SeoCheck value={entry.descEn} maxLen={155} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-40">
        Para editar el SEO de cada página, ve a la sección correspondiente (Servicios, Industrias,
        Blog) y usa la pestaña SEO del editor.
      </p>
    </div>
  );
}
