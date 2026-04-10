import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getCasoExito } from "@/lib/admin/actions/casos.actions";
import CasoForm from "@/components/admin/forms/CasoForm";

export default async function EditCasoPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const caso = await getCasoExito(id);

  if (!caso) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar caso de éxito</h1>
      <CasoForm
        isNew={false}
        initialData={{
          id: caso.id,
          slug: caso.slug,
          clientName: caso.clientName,
          clientLogo: caso.clientLogo || "",
          clientCountry: caso.clientCountry || "",
          clientSector: caso.clientSector || "",
          titleEs: caso.titleEs,
          titleEn: caso.titleEn || "",
          challengeEs: caso.challengeEs || "",
          challengeEn: caso.challengeEn || "",
          solutionEs: caso.solutionEs || "",
          solutionEn: caso.solutionEn || "",
          resultsEs: caso.resultsEs || "",
          resultsEn: caso.resultsEn || "",
          metric1Value: caso.metric1Value || "",
          metric1LabelEs: caso.metric1LabelEs || "",
          metric1LabelEn: caso.metric1LabelEn || "",
          metric2Value: caso.metric2Value || "",
          metric2LabelEs: caso.metric2LabelEs || "",
          metric2LabelEn: caso.metric2LabelEn || "",
          metric3Value: caso.metric3Value || "",
          metric3LabelEs: caso.metric3LabelEs || "",
          metric3LabelEn: caso.metric3LabelEn || "",
          testimonialQuoteEs: caso.testimonialQuoteEs || "",
          testimonialQuoteEn: caso.testimonialQuoteEn || "",
          testimonialAuthor: caso.testimonialAuthor || "",
          testimonialRole: caso.testimonialRole || "",
          coverImage: caso.coverImage || "",
          servicesUsed: (caso.servicesUsed as string[]) || [],
          featured: caso.featured,
          seoTitleEs: caso.seoTitleEs || "",
          seoTitleEn: caso.seoTitleEn || "",
          seoDescriptionEs: caso.seoDescriptionEs || "",
          seoDescriptionEn: caso.seoDescriptionEn || "",
          status: caso.status as "draft" | "published" | "scheduled",
          translationStatusEn: caso.translationStatusEn as
            | "complete"
            | "partial"
            | "pending"
            | "auto",
        }}
      />
    </div>
  );
}
