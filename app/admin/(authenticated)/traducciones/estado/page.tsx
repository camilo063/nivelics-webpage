import { connection } from "next/server";
import { getTranslationStats } from "@/lib/admin/actions/traducciones.actions";
import { Check, AlertCircle, Bot, Clock } from "lucide-react";

export default async function EstadoTraduccionesPage() {
  await connection();
  const stats = await getTranslationStats();

  const totals = stats.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      complete: acc.complete + s.complete,
      auto: acc.auto + s.auto,
      partial: acc.partial + s.partial,
      pending: acc.pending + s.pending,
    }),
    { total: 0, complete: 0, auto: 0, partial: 0, pending: 0 },
  );

  const pct = totals.total > 0 ? Math.round((totals.complete / totals.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estado de Traducciones EN</h1>
          <p className="text-text-70">
            {pct}% completado — {totals.pending} pendientes
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="flex items-center gap-2 text-staffing">
            <Check className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Completo</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totals.complete}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="flex items-center gap-2 text-ia">
            <Bot className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Auto</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totals.auto}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="flex items-center gap-2 text-finops">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Parcial</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totals.partial}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Pendiente</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totals.pending}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Sección
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Completo
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Auto
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Parcial
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Pendiente
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Progreso
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stats.map((row) => {
              const rowPct = row.total > 0 ? Math.round((row.complete / row.total) * 100) : 0;
              return (
                <tr key={row.section} className="hover:bg-bg-elevated/50">
                  <td className="px-6 py-4 font-medium text-text-100">{row.section}</td>
                  <td className="px-6 py-4 text-text-70">{row.total}</td>
                  <td className="px-6 py-4 text-staffing">{row.complete}</td>
                  <td className="px-6 py-4 text-ia">{row.auto}</td>
                  <td className="px-6 py-4 text-finops">{row.partial}</td>
                  <td className="px-6 py-4 text-red-400">{row.pending}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-bg-elevated overflow-hidden">
                        <div
                          className="h-full rounded-full bg-staffing"
                          style={{ width: `${rowPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-40">{rowPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* Totals row */}
            <tr className="bg-bg-elevated/30 font-semibold">
              <td className="px-6 py-4 text-text-100">TOTAL</td>
              <td className="px-6 py-4 text-text-100">{totals.total}</td>
              <td className="px-6 py-4 text-staffing">{totals.complete}</td>
              <td className="px-6 py-4 text-ia">{totals.auto}</td>
              <td className="px-6 py-4 text-finops">{totals.partial}</td>
              <td className="px-6 py-4 text-red-400">{totals.pending}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-bg-elevated overflow-hidden">
                    <div className="h-full rounded-full bg-staffing" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-text-100">{pct}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
