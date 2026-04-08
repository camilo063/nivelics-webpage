import Link from "next/link";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="font-mono text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-text-100">Página no encontrada</h2>
        <p className="mt-2 text-text-70">La página que buscas no existe o fue movida.</p>
        <Button asChild variant="cta" size="lg" className="mt-8">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}
