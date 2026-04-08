interface TechCategory {
  name: string;
  items: string[];
}

interface TechStackGridProps {
  title: string;
  categories: TechCategory[];
}

export function TechStackGrid({ title, categories }: TechStackGridProps) {
  return (
    <section className="bg-bg-surface py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100">{title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
