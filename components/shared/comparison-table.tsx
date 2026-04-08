import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  criterion: string;
  alternative: string;
  nivelics: string;
  /** For 4-column variant (e.g., apps móviles) */
  extra?: string;
}

interface ComparisonTableProps {
  title: string;
  alternativeLabel: string;
  nivelicsLabel: string;
  /** Optional extra column label for 4-column variant */
  extraLabel?: string;
  rows: ComparisonRow[];
}

export function ComparisonTable({
  title,
  alternativeLabel,
  nivelicsLabel,
  extraLabel,
  rows,
}: ComparisonTableProps) {
  const hasExtra = extraLabel && rows.some((r) => r.extra);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-2xl font-bold text-text-100 md:text-3xl">{title}</h2>
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-surface">
                <th className="px-5 py-4 font-semibold text-text-40 w-[28%]">Criterio</th>
                <th className="px-5 py-4 font-semibold text-text-40">{alternativeLabel}</th>
                {hasExtra && <th className="px-5 py-4 font-semibold text-text-40">{extraLabel}</th>}
                <th className="px-5 py-4 font-semibold text-primary bg-primary/5">
                  <span className="flex items-center gap-2">
                    <Check size={16} className="text-staffing" />
                    {nivelicsLabel}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.criterion} className="transition-colors hover:bg-bg-surface/50">
                  <td className="px-5 py-4 font-medium text-text-100">{row.criterion}</td>
                  <td className="px-5 py-4 text-text-40">{row.alternative}</td>
                  {hasExtra && <td className="px-5 py-4 text-text-40">{row.extra}</td>}
                  <td className={cn("px-5 py-4 text-text-100 bg-primary/[0.03]")}>
                    {row.nivelics}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
