import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getIndustria } from "@/lib/admin/actions/industrias.actions";
import IndustriaForm from "@/components/admin/forms/IndustriaForm";

export default async function EditIndustriaPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const industria = await getIndustria(slug);

  if (!industria) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar industria: {industria.nameEs}</h1>
      <IndustriaForm
        initialData={{
          slugEs: industria.slugEs,
          nameEs: industria.nameEs,
          nameEn: industria.nameEn || "",
          heroTitleEs: industria.heroTitleEs || "",
          heroTitleEn: industria.heroTitleEn || "",
          heroSubtitleEs: industria.heroSubtitleEs || "",
          heroSubtitleEn: industria.heroSubtitleEn || "",
          painPoints:
            (industria.painPoints as Array<{
              icon: string;
              titleEs: string;
              titleEn: string;
              descEs: string;
              descEn: string;
            }>) || [],
          solutions:
            (industria.solutions as Array<{
              icon: string;
              titleEs: string;
              titleEn: string;
              descEs: string;
              descEn: string;
            }>) || [],
          casoDestacadoId: industria.casoDestacadoId || "",
          differentiators:
            (industria.differentiators as Array<{
              titleEs: string;
              titleEn: string;
              descEs: string;
              descEn: string;
            }>) || [],
          ctaTextEs: industria.ctaTextEs || "",
          ctaTextEn: industria.ctaTextEn || "",
          seoTitleEs: industria.seoTitleEs || "",
          seoTitleEn: industria.seoTitleEn || "",
          seoDescriptionEs: industria.seoDescriptionEs || "",
          seoDescriptionEn: industria.seoDescriptionEn || "",
          accentColor: industria.accentColor as "ia" | "cloud" | "staffing" | "finops" | "dev",
          icon: industria.icon || "",
          translationStatusEn: industria.translationStatusEn as
            | "complete"
            | "partial"
            | "pending"
            | "auto",
          status: industria.status as "draft" | "published" | "scheduled" | "archived",
        }}
      />
    </div>
  );
}
