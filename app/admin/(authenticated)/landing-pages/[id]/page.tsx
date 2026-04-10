import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getLandingPage } from "@/lib/admin/actions/landings.actions";
import { LandingEditor } from "@/components/admin/forms/LandingEditor";

export default async function EditarLandingPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const landing = await getLandingPage(id);

  if (!landing) notFound();

  return <LandingEditor landing={landing} />;
}
