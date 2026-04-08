import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceProcessCtaProps {
  title: string;
  subtitle: string;
  checks: string[];
  ctaText: string;
  ctaHref: string;
  trustText?: string;
}

export function ServiceProcessCta({
  title,
  subtitle,
  checks,
  ctaText,
  ctaHref,
  trustText = "Respondemos en menos de 24 horas. Sin compromiso.",
}: ServiceProcessCtaProps) {
  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-5" />
      <div className="relative mx-auto max-w-[800px] px-6 text-center md:px-20">
        <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-text-70">{subtitle}</p>
        <div className="mt-6 flex flex-col items-center gap-2">
          {checks.map((check) => (
            <div key={check} className="flex items-center gap-2">
              <Check size={16} className="text-[#10B981] shrink-0" />
              <span className="text-sm text-text-70">{check}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="cta" size="lg">
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        </div>
        <p className="mt-4 text-[12px] text-text-40">{trustText}</p>
      </div>
    </section>
  );
}
