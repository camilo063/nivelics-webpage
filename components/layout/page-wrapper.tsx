import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn("flex-1 pt-16", className)}>
      <Breadcrumb />
      {children}
    </main>
  );
}
