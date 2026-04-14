import { Check } from "lucide-react";
import { LpHero } from "./LpHero";
import { LpHeroWithForm } from "./LpHeroWithForm";
import { LpLogosBar } from "./LpLogosBar";
import { LpMetrics } from "./LpMetrics";
import { LpValueProps } from "./LpValueProps";
import { LpSteps } from "./LpSteps";
import { LpCaseStudy } from "./LpCaseStudy";
import { LpTestimonial } from "./LpTestimonial";
import { LpFAQ } from "./LpFAQ";
import { LpCTABanner } from "./LpCTABanner";
import { LpForm } from "./LpForm";
import { LpComparativeTable } from "./LpComparativeTable";
import { LpNicheSection } from "./LpNicheSection";
import { LpVideoEmbed } from "./LpVideoEmbed";
import { LpFooterMin } from "./LpFooterMin";
import { resolveIcon } from "./icon-resolver";

export interface LandingBlock {
  type: string;
  order: number;
  data: Record<string, unknown>;
}

interface BlockRendererProps {
  block: LandingBlock;
  accentColor: string;
  fuente: string;
  defaultServicio?: string;
  serviceTypeToServicio?: string;
}

type D = Record<string, unknown>;
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const arr = <T,>(v: unknown, fallback: T[] = []): T[] => (Array.isArray(v) ? (v as T[]) : fallback);
const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);

export function BlockRenderer({ block, accentColor, fuente, defaultServicio }: BlockRendererProps) {
  const d: D = block.data || {};

  switch (block.type) {
    // ─── B01 Hero Corto ─────────────────────────────────
    case "B01": {
      const ctaPrimary = {
        text: str(d.cta_primario_texto, "Contactar"),
        href: str(d.cta_primario_url, "#formulario"),
      };
      const ctaSecondary = str(d.cta_secundario_texto)
        ? {
            text: str(d.cta_secundario_texto),
            href: str(d.cta_secundario_url, "#"),
          }
        : undefined;
      return (
        <LpHero
          badge={str(d.badge_text)}
          h1={str(d.h1)}
          subtitle={str(d.subtitulo)}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
          trustBadge={str(d.trust_badge)}
          accentColor={accentColor}
        />
      );
    }

    // ─── B02 Hero + Formulario ─────────────────────────
    case "B02":
      return (
        <LpHeroWithForm
          fuente={fuente}
          badge={str(d.badge_text)}
          h1={str(d.h1)}
          subtitle={str(d.subtitulo)}
          formTitle={str(d.form_title, "Agenda tu diagnóstico")}
          formCtaText={str(d.cta_texto, "Quiero mi diagnóstico →")}
          accentColor={accentColor}
          defaultServicio={defaultServicio}
        />
      );

    // ─── B03 Barra de Logos ────────────────────────────
    case "B03":
      return (
        <LpLogosBar
          title={str(d.titulo, "Empresas que confían en nosotros")}
          logos={arr<string>(d.logos)}
        />
      );

    // ─── B04 Métricas ──────────────────────────────────
    case "B04": {
      const items = arr<{
        valor?: string;
        numero?: string;
        label?: string;
        descripcion?: string;
        isZeroSpecial?: string;
      }>(d.metricas);
      const metrics = items.map((m) => ({
        value: m.valor || m.numero || "",
        label: m.label || m.descripcion || "",
        isZeroSpecial: m.isZeroSpecial,
      }));
      return <LpMetrics metrics={metrics} title={str(d.titulo)} accentColor={accentColor} />;
    }

    // ─── B05 Propuesta de Valor / B17 Beneficios ───────
    case "B05":
    case "B17": {
      const raw = arr<{ icono?: string; titulo?: string; descripcion?: string; copy?: string }>(
        block.type === "B17" ? d.beneficios : d.items,
      );
      const items = raw.map((i) => ({
        icon: resolveIcon(i.icono),
        title: i.titulo || "",
        copy: i.copy || i.descripcion || "",
      }));
      return (
        <LpValueProps
          title={str(d.titulo, "Propuesta de valor")}
          subtitle={str(d.subtitulo)}
          items={items}
          accentColor={accentColor}
        />
      );
    }

    // ─── B06 Card Servicio ─────────────────────────────
    case "B06": {
      const bullets = arr<string>(d.bullets);
      return (
        <section className="bg-[#0A0A0F] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-[#12121A] p-8 backdrop-blur-sm md:p-10">
              {str(d.badge) && (
                <span
                  className="inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: `${accentColor}50`,
                    color: accentColor,
                    backgroundColor: `${accentColor}10`,
                  }}
                >
                  {str(d.badge)}
                </span>
              )}
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white md:text-3xl">
                {str(d.h2)}
              </h2>
              {str(d.parrafo) && (
                <p className="mt-4 text-white/70 leading-relaxed">{str(d.parrafo)}</p>
              )}
              {bullets.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5"
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-white/85 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {str(d.cta_texto) && (
                <a
                  href={str(d.cta_url, "#formulario")}
                  className="mt-8 inline-flex h-11 items-center rounded-full px-5 text-sm font-bold text-black"
                  style={{ backgroundColor: accentColor }}
                >
                  {str(d.cta_texto)}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    }

    // ─── B07 Proceso en Pasos ──────────────────────────
    case "B07": {
      const pasos = arr<{ titulo?: string; descripcion?: string; duracion?: string }>(d.pasos);
      const steps = pasos.map((p) => ({
        title: p.titulo || "",
        copy: p.descripcion || "",
      }));
      return (
        <LpSteps
          title={str(d.titulo, "Cómo funciona")}
          subtitle={str(d.subtitulo)}
          steps={steps}
          accentColor={accentColor}
        />
      );
    }

    // ─── B08 Caso de Éxito ─────────────────────────────
    case "B08":
      return (
        <LpCaseStudy
          clientName={str(d.client_name, str(d.clientName, "Cliente"))}
          country={str(d.country, "🇨🇴 LATAM")}
          sector={str(d.sector, "")}
          resultado={str(d.resultado, "")}
          extracto={str(d.extracto, "")}
          accentColor={accentColor}
          logoUrl={str(d.logo_url) || undefined}
        />
      );

    // ─── B09 Testimonial ───────────────────────────────
    case "B09":
      return (
        <LpTestimonial
          quote={str(d.quote)}
          author={str(d.autor_nombre, "Cliente")}
          role={`${str(d.autor_cargo)}${str(d.autor_empresa) ? `, ${str(d.autor_empresa)}` : ""}`}
          photo={str(d.autor_foto) || undefined}
          accentColor={accentColor}
        />
      );

    // ─── B10 FAQ ──────────────────────────────────────
    case "B10": {
      const preguntas = arr<{ pregunta: string; respuesta: string }>(d.preguntas);
      const items = preguntas.map((p) => ({ question: p.pregunta, answer: p.respuesta }));
      return (
        <LpFAQ
          title={str(d.titulo, "Preguntas frecuentes")}
          items={items}
          accentColor={accentColor}
        />
      );
    }

    // ─── B11 CTA Intermedio ────────────────────────────
    case "B11":
      return (
        <LpCTABanner
          title={str(d.copy, "¿Listo para dar el siguiente paso?")}
          subtitle={str(d.subtitulo)}
          ctaText={str(d.boton_texto, "Contactar →")}
          ctaHref={str(d.boton_url, "#formulario")}
          accentColor={accentColor}
        />
      );

    // ─── B12 Formulario Completo ───────────────────────
    case "B12": {
      const trustSignals = arr<string>(d.trust_signals);
      return (
        <div className="bg-[#0A0A0F] py-20 md:py-24">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <LpForm
              fuente={fuente}
              title={str(d.titulo, "Solicita más información")}
              subtitle={str(d.subtitulo, "En menos de 24h te respondemos.")}
              ctaText={str(d.cta_texto, "Enviar →")}
              accentColor={accentColor}
              defaultServicio={defaultServicio}
              trustSignals={trustSignals.length > 0 ? trustSignals : undefined}
            />
          </div>
        </div>
      );
    }

    // ─── B13 Comparativa ───────────────────────────────
    case "B13": {
      const rawRows = arr<{ criterio: string; values: string[] }>(d.filas);
      const columns = arr<string>(d.columnas);
      const highlightIdx = typeof d.highlight_col_idx === "number" ? d.highlight_col_idx : 1;
      return (
        <div id={str(d.anchor_id) || undefined}>
          <LpComparativeTable
            title={str(d.titulo, "Comparativa")}
            subtitle={str(d.subtitulo)}
            columns={columns}
            highlightColIdx={highlightIdx}
            rows={rawRows}
            footnote={str(d.footnote)}
            accentColor={accentColor}
          />
        </div>
      );
    }

    // ─── B14 Vertical Nicho ────────────────────────────
    case "B14": {
      const items = arr<{ icono?: string; titulo?: string; descripcion?: string; copy?: string }>(
        d.items,
      );
      if (items.length > 0) {
        return (
          <LpNicheSection
            title={str(d.titulo, str(d.nicho_nombre, "Vertical"))}
            subtitle={str(d.subtitulo)}
            items={items.map((i) => ({
              icon: resolveIcon(i.icono),
              title: i.titulo || "",
              copy: i.copy || i.descripcion || "",
            }))}
            accentColor={accentColor}
          />
        );
      }
      return null;
    }

    // ─── B16 Video ─────────────────────────────────────
    case "B16":
      return (
        <LpVideoEmbed
          videoUrl={str(d.video_url)}
          poster={str(d.thumbnail) || undefined}
          title={str(d.titulo)}
          caption={str(d.caption)}
        />
      );

    // ─── B18 Footer Mínimo ─────────────────────────────
    case "B18":
      return <LpFooterMin whatsappMessage={str(d.whatsapp_mensaje)} />;

    default:
      // Unknown block — silently skip in production
      if (process.env.NODE_ENV !== "production") {
        return (
          <div className="bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
            Block type &quot;{block.type}&quot; no implementado.
          </div>
        );
      }
      return null;
  }
}

interface BlocksRendererProps {
  blocks: LandingBlock[];
  accentColor: string;
  fuente: string;
  defaultServicio?: string;
}

export function BlocksRenderer({
  blocks,
  accentColor,
  fuente,
  defaultServicio,
}: BlocksRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map((block, i) => (
        <BlockRenderer
          key={`${block.type}-${i}`}
          block={block}
          accentColor={accentColor}
          fuente={fuente}
          defaultServicio={defaultServicio}
        />
      ))}
    </>
  );
}

export default BlocksRenderer;
