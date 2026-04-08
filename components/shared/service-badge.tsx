import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  ia: "bg-ia/15 text-ia border-ia/30",
  cloud: "bg-cloud/15 text-blue-400 border-cloud/30",
  staffing: "bg-staffing/15 text-staffing border-staffing/30",
  finops: "bg-finops/15 text-finops border-finops/30",
  dev: "bg-dev/15 text-dev border-dev/30",
};

interface ServiceBadgeProps {
  variant: keyof typeof badgeStyles;
  children: React.ReactNode;
  className?: string;
}

export function ServiceBadge({ variant, children, className }: ServiceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        badgeStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
