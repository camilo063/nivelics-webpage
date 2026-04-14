interface LpLogosBarProps {
  title?: string;
  logos: string[];
}

export function LpLogosBar({ title = "Empresas que confían en nosotros", logos }: LpLogosBarProps) {
  return (
    <section className="border-y border-white/5 bg-[#0A0A0F] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/40">
          {title}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {logos.map((logo, i) => (
            <div key={i} className="text-lg font-bold tracking-tight text-white/50 md:text-xl">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LpLogosBar;
