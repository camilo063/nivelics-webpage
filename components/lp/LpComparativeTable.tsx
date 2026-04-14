interface Row {
  criterio: string;
  values: string[];
}

interface LpComparativeTableProps {
  title: string;
  subtitle?: string;
  columns: string[];
  highlightColIdx: number;
  rows: Row[];
  footnote?: string;
  accentColor?: string;
}

export function LpComparativeTable({
  title,
  subtitle,
  columns,
  highlightColIdx,
  rows,
  footnote,
  accentColor = "#00E5A0",
}: LpComparativeTableProps) {
  return (
    <section className="bg-[#0A0A0F] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-white/70">{subtitle}</p>}
        </div>

        {/* Desktop table */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-white/10 md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-[#12121A]">
                <th className="px-5 py-5 text-left text-sm font-semibold text-white/60">
                  Criterio
                </th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-5 py-5 text-left text-sm font-semibold ${i === highlightColIdx ? "text-white" : "text-white/60"}`}
                    style={i === highlightColIdx ? { backgroundColor: `${accentColor}08` } : {}}
                  >
                    <div className="flex items-center gap-2">
                      {col}
                      {i === highlightColIdx && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-black"
                          style={{ backgroundColor: accentColor }}
                        >
                          Recomendado
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 last:border-b-0">
                  <td className="px-5 py-4 text-sm font-medium text-white/80">{row.criterio}</td>
                  {row.values.map((v, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-4 text-sm ${ci === highlightColIdx ? "text-white" : "text-white/60"}`}
                      style={ci === highlightColIdx ? { backgroundColor: `${accentColor}05` } : {}}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: cards */}
        <div className="mt-12 space-y-4 md:hidden">
          {rows.map((row, ri) => (
            <div key={ri} className="rounded-xl border border-white/10 bg-[#12121A] p-5">
              <div className="mb-3 text-sm font-bold text-white">{row.criterio}</div>
              <div className="space-y-2">
                {row.values.map((v, ci) => (
                  <div
                    key={ci}
                    className={`rounded-lg p-3 text-sm ${ci === highlightColIdx ? "text-white border" : "text-white/60"}`}
                    style={
                      ci === highlightColIdx
                        ? { borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }
                        : {}
                    }
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {columns[ci]}
                    </div>
                    <div className="mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {footnote && <p className="mt-6 text-center text-xs text-white/40">{footnote}</p>}
      </div>
    </section>
  );
}

export default LpComparativeTable;
