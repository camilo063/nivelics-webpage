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
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr>
                <th
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--text-55)",
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: ".05em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "left",
                    width: "28%",
                  }}
                >
                  Criterio
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.025)",
                    color: "var(--text-40)",
                    fontWeight: 400,
                    fontSize: "11px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "left",
                  }}
                >
                  {alternativeLabel}
                </th>
                {hasExtra && (
                  <th
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.025)",
                      color: "var(--text-40)",
                      fontWeight: 400,
                      fontSize: "11px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "left",
                    }}
                  >
                    {extraLabel}
                  </th>
                )}
                <th
                  style={{
                    padding: "10px 14px",
                    background: "rgba(0,212,255,0.07)",
                    color: "#00D4FF",
                    fontWeight: 600,
                    fontSize: "11px",
                    letterSpacing: ".04em",
                    borderBottom: "2px solid rgba(0,212,255,0.3)",
                    borderTop: "1px solid rgba(0,212,255,0.2)",
                    borderLeft: "2px solid rgba(0,212,255,0.3)",
                    textAlign: "left",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Check size={14} />
                    {nivelicsLabel}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.criterion}
                  className={cn(
                    "transition-colors",
                    i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent",
                  )}
                >
                  <td
                    style={{
                      padding: "9px 14px",
                      color: "var(--text-70)",
                      fontSize: "13px",
                      fontWeight: 500,
                      borderBottom: ".5px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {row.criterion}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      color: "var(--text-40)",
                      fontSize: "13px",
                      borderBottom: ".5px solid rgba(255,255,255,0.06)",
                      textDecoration: "line-through",
                      textDecorationColor: "rgba(239,68,68,0.5)",
                    }}
                  >
                    {row.alternative}
                  </td>
                  {hasExtra && (
                    <td
                      style={{
                        padding: "9px 14px",
                        color: "var(--text-40)",
                        fontSize: "13px",
                        borderBottom: ".5px solid rgba(255,255,255,0.06)",
                        textDecoration: "line-through",
                        textDecorationColor: "rgba(239,68,68,0.5)",
                      }}
                    >
                      {row.extra}
                    </td>
                  )}
                  <td
                    style={{
                      padding: "9px 14px",
                      color: "var(--text-100)",
                      fontSize: "13px",
                      fontWeight: 600,
                      borderBottom: ".5px solid rgba(0,212,255,0.08)",
                      background: "rgba(0,212,255,0.05)",
                      borderLeft: "2px solid rgba(0,212,255,0.3)",
                    }}
                  >
                    <span style={{ color: "#4ade80", marginRight: "6px" }}>✓</span>
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
