interface HubStat {
  value: string;
  label: string;
}

interface Props {
  locale: string;
  positioningTitle?: string;
  positioningCopy?: string;
  stats?: HubStat[];
}

const DEFAULT_STATS_ES: HubStat[] = [
  { value: "7", label: "Países con proyectos activos" },
  { value: "40%", label: "Reducción promedio en costos cloud" },
  { value: "5 días", label: "Al primer candidato en Staff Augmentation" },
];

const DEFAULT_STATS_EN: HubStat[] = [
  { value: "7", label: "Countries with active projects" },
  { value: "40%", label: "Average cloud cost reduction" },
  { value: "5 days", label: "To the first Staff Augmentation candidate" },
];

export function IndustriasHubExtras({ locale, positioningTitle, positioningCopy, stats }: Props) {
  const isEn = locale === "en";
  const resolvedTitle =
    positioningTitle ||
    (isEn
      ? "13 years delivering technology in the most demanding sectors"
      : "13 años entregando tecnología en los sectores más exigentes");
  const resolvedCopy =
    positioningCopy ||
    (isEn
      ? "We combine AI, Cloud and Staff Augmentation into a single accountable partner. No generic slides — domain depth and contracts with SLAs."
      : "Integramos IA, Cloud y Staff Augmentation en un solo aliado con cuenta de resultados. Sin slides genéricos — profundidad de dominio y contratos con SLAs.");
  const resolvedStats = stats?.length ? stats : isEn ? DEFAULT_STATS_EN : DEFAULT_STATS_ES;

  return (
    <section
      className="border-t border-white/[0.06] bg-bg-surface py-14"
      data-section="industrias-hub-positioning"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-text-100 md:text-3xl">{resolvedTitle}</h2>
            <p className="mt-4 max-w-2xl text-text-70">{resolvedCopy}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {resolvedStats.map((s) => (
              <div
                key={s.value + s.label}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center"
              >
                <div className="text-2xl font-bold tabular-nums text-primary md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] leading-tight text-text-55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
