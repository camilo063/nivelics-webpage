import { connection } from "next/server";
import {
  getTeamMembers,
  getHistoriaItems,
  getCertificaciones,
} from "@/lib/admin/actions/nosotros.actions";
import NosotrosClient from "@/components/admin/forms/NosotrosClient";

export default async function NosotrosPage() {
  await connection();

  const [members, historia, certs] = await Promise.all([
    getTeamMembers(),
    getHistoriaItems(),
    getCertificaciones(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nosotros</h1>
      <NosotrosClient
        initialMembers={members.map((m) => ({
          id: m.id,
          name: m.name,
          roleEs: m.roleEs || "",
          roleEn: m.roleEn || "",
          bioEs: m.bioEs || "",
          bioEn: m.bioEn || "",
          photo: m.photo || "",
          linkedinUrl: m.linkedinUrl || "",
          isFounder: m.isFounder,
          isFeatured: m.isFeatured,
          sortOrder: m.sortOrder,
          status: m.status as "draft" | "published" | "scheduled" | "archived",
        }))}
        initialHistoria={historia.map((h) => ({
          id: h.id,
          year: h.year,
          month: h.month ?? undefined,
          titleEs: h.titleEs,
          titleEn: h.titleEn || "",
          descriptionEs: h.descriptionEs || "",
          descriptionEn: h.descriptionEn || "",
          icon: h.icon || "",
          image: h.image || "",
          milestoneType: h.milestoneType as
            | "founding"
            | "growth"
            | "award"
            | "expansion"
            | "product",
          sortOrder: h.sortOrder,
        }))}
        initialCerts={certs.map((c) => ({
          id: c.id,
          nameEs: c.nameEs,
          nameEn: c.nameEn || "",
          issuer: c.issuer || "",
          year: c.year ?? undefined,
          logo: c.logo || "",
          certificateUrl: c.certificateUrl || "",
          descriptionEs: c.descriptionEs || "",
          descriptionEn: c.descriptionEn || "",
          sortOrder: c.sortOrder,
        }))}
      />
    </div>
  );
}
