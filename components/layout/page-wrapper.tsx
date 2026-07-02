import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  // div, no <main>: el <main id="main-content"> único lo provee el layout
  // de marketing (a11y skip-link + landmark único por página).
  return (
    <div className={cn("flex-1 pt-16", className)}>
      <Breadcrumb />
      {children}
    </div>
  );
}
