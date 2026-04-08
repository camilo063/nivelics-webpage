import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface IndustryItem {
  name: string;
  description: string;
  url: string;
}

interface IndustryGridProps {
  title: string;
  industries: IndustryItem[];
}

export function IndustryGrid({ title, industries }: IndustryGridProps) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100">{title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <Link
              key={ind.url}
              href={ind.url}
              className="glass glow-hover rounded-xl p-5 flex items-center justify-between group"
            >
              <div>
                <span className="text-sm font-semibold text-text-100 group-hover:text-primary transition-colors">
                  {ind.name}
                </span>
                <p className="mt-1 text-[12px] text-text-40">{ind.description}</p>
              </div>
              <ArrowRight
                size={14}
                className="shrink-0 text-text-40 group-hover:text-primary transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
