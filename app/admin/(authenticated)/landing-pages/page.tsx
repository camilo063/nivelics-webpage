import { connection } from "next/server";
import { getLandingPages } from "@/lib/admin/actions/landings.actions";
import { LandingListClient } from "@/components/admin/forms/LandingListClient";

export default async function LandingPagesPage() {
  await connection();
  const { landings, total } = await getLandingPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <p className="text-text-70">{total} landings en total</p>
      </div>

      <LandingListClient initialLandings={landings} initialTotal={total} />
    </div>
  );
}
