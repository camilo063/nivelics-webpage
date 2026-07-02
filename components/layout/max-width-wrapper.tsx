import { cn } from "@/lib/utils";

/**
 * Contenedor estándar de contenido (Fase 0 §0.5 — docs/mejoras).
 * Reemplaza el patrón repetido `mx-auto max-w-[1280px] px-6 md:px-20`.
 * La migración de páginas existentes es incremental; todo código nuevo
 * debe usar este componente.
 */
export function MaxWidthWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-[1280px] px-6 md:px-20", className)}>{children}</div>;
}
