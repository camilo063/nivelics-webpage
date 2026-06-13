import Link from "next/link";
import type { ServiceDef } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { TiltCard } from "@/components/effects/tilt-card";

interface ServiceCardProps {
  service: ServiceDef;
  index?: number;
  className?: string;
}

export function ServiceCard({ service, index = 0, className }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Reveal delay={index * 80} className="h-full">
      <TiltCard>
        <Link
          href={service.href}
          className={cn(
            "group glass glow-hover block h-full rounded-xl p-6 transition-colors duration-200 ease-out",
            className,
          )}
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ background: `${service.color}20` }}
          >
            <Icon size={24} style={{ color: service.color }} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text-100">{service.label}</h3>
          <p className="mb-4 text-sm leading-relaxed text-text-70">{service.description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
            Conocer más <ArrowRight size={14} />
          </span>
        </Link>
      </TiltCard>
    </Reveal>
  );
}
