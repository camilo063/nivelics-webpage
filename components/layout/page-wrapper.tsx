import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageSchema } from "@/components/shared/page-schema";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * `false` en las páginas que ya emiten su propio subtipo de WebPage con el
   * mismo `@id` (industrias, hub de productos): así no salen dos.
   */
  webPage?: boolean;
}

export function PageWrapper({ children, className, webPage = true }: PageWrapperProps) {
  // div, no <main>: el <main id="main-content"> único lo provee el layout
  // de marketing (a11y skip-link + landmark único por página).
  return (
    <div className={cn("flex-1 pt-16", className)}>
      {webPage && <PageSchema />}
      <Breadcrumb />
      {children}
    </div>
  );
}
