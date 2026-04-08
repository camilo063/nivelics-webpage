import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function CTABanner({
  title = "¿Listo para transformar más rápido?",
  description = "Conversemos sobre cómo la tecnología puede impulsar tus resultados.",
  buttonText = "Agenda una reunión",
  buttonHref = "/contacto",
  className,
}: CTABannerProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-10" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-16 text-center md:px-20 md:py-24">
        <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-70">{description}</p>
        <div className="mt-8">
          <Button asChild variant="cta" size="lg">
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
