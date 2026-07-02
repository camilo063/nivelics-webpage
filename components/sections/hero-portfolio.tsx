import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  client: string;
  description: string;
  tags: string[];
  imageAlt: string;
}

interface HeroPortfolioProps {
  title: string;
  items: PortfolioItem[];
  accentColor: string;
  ctaText: string;
  ctaUrl: string;
}

export function HeroPortfolio({ title, items, accentColor, ctaText, ctaUrl }: HeroPortfolioProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-text-40 mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.client}
            className="rounded-lg p-3 transition-colors"
            style={{ background: `${accentColor}06`, border: `0.5px solid ${accentColor}20` }}
          >
            <p className="text-xs font-semibold text-text-100">{item.client}</p>
            <p className="mt-1 text-[11px] text-text-40 leading-snug">{item.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-1.5 py-0.5 text-[11px] font-medium"
                  style={{ background: `${accentColor}12`, color: accentColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button asChild variant="outline" size="sm" className="mt-4 w-full">
        <Link href={ctaUrl}>{ctaText}</Link>
      </Button>
    </div>
  );
}
