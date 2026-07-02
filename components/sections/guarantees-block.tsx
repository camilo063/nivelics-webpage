import { type LucideIcon } from "lucide-react";

interface Guarantee {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface GuaranteesBlockProps {
  title: string;
  guarantees: Guarantee[];
}

export function GuaranteesBlock({ title, guarantees }: GuaranteesBlockProps) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100">{title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)] p-5"
              >
                <Icon size={24} className="text-[#10B981] mb-3" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-text-100">{g.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-70">{g.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
