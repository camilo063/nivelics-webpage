import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getServicio } from "@/lib/admin/actions/servicios.actions";
import ServicioForm from "@/components/admin/forms/ServicioForm";

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const servicio = await getServicio(slug);

  if (!servicio) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar servicio: {servicio.titleEs}</h1>
      <ServicioForm
        initialData={{
          slugEs: servicio.slugEs,
          titleEs: servicio.titleEs,
          titleEn: servicio.titleEn || "",
          subtitleEs: servicio.subtitleEs || "",
          subtitleEn: servicio.subtitleEn || "",
          descriptionEs: servicio.descriptionEs || "",
          descriptionEn: servicio.descriptionEn || "",
          coverImage: servicio.coverImage || "",
          accentColor: servicio.accentColor as "ia" | "cloud" | "staffing" | "finops" | "dev",
          icon: servicio.icon || "",
          benefits:
            (servicio.benefits as Array<{
              icon: string;
              titleEs: string;
              titleEn: string;
              copyEs: string;
              copyEn: string;
            }>) || [],
          processSteps:
            (servicio.processSteps as Array<{
              number: number;
              titleEs: string;
              titleEn: string;
              descEs: string;
              descEn: string;
              duration: string;
            }>) || [],
          metrics:
            (servicio.metrics as Array<{
              value: string;
              unit: string;
              labelEs: string;
              labelEn: string;
            }>) || [],
          faqs:
            (servicio.faqs as Array<{
              questionEs: string;
              questionEn: string;
              answerEs: string;
              answerEn: string;
            }>) || [],
          ctaPrimaryTextEs: servicio.ctaPrimaryTextEs || "",
          ctaPrimaryTextEn: servicio.ctaPrimaryTextEn || "",
          ctaPrimaryUrl: servicio.ctaPrimaryUrl || "",
          ctaSecondaryTextEs: servicio.ctaSecondaryTextEs || "",
          ctaSecondaryTextEn: servicio.ctaSecondaryTextEn || "",
          ctaSecondaryUrl: servicio.ctaSecondaryUrl || "",
          seoTitleEs: servicio.seoTitleEs || "",
          seoTitleEn: servicio.seoTitleEn || "",
          seoDescriptionEs: servicio.seoDescriptionEs || "",
          seoDescriptionEn: servicio.seoDescriptionEn || "",
          translationStatusEn: servicio.translationStatusEn as
            | "complete"
            | "partial"
            | "pending"
            | "auto",
          status: servicio.status as "draft" | "published" | "scheduled" | "archived",
        }}
      />
    </div>
  );
}
