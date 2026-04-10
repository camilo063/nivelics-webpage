import { connection } from "next/server";
import { getMediaItems } from "@/lib/admin/actions/media.actions";
import MediaClient from "@/components/admin/forms/MediaClient";

export default async function MediaPage() {
  await connection();
  const { items, total } = await getMediaItems();

  return <MediaClient initialItems={items} initialTotal={total} />;
}
