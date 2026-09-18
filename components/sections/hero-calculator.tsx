"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const LABELS = {
  es: {
    talkToExpert: "Hablar con un experto →",
    requestAudit: "Solicitar auditoría gratuita →",
    adjustValue: "Ajustar valor",
    adjustAmount: "Ajustar monto",
    staffLabel: "¿Cuánto pagas hoy por un perfil senior?",
    cloudLabel: "¿Cuánto es tu factura cloud mensual?",
    staffResult: "Con Nivelics pagarías:",
    cloudResult: "Ahorro potencial con FinOps:",
    staffNote: "Basado en proyectos reales. El ahorro exacto depende del perfil y la dedicación.",
    cloudNote: "Promedio de 30-40% en nuestros proyectos. La auditoría inicial es gratuita.",
    staffTrust: "Candidatos en 5 días · Sin compromiso",
    cloudTrust: "Auditoría gratuita · Sin compromiso",
    region: "Calculadora de ahorro",
    perMonth: "/mes",
    monthlySavings: "Ahorro mensual",
    annualSavings: "Ahorro anual",
  },
  en: {
    talkToExpert: "Talk to an expert →",
    requestAudit: "Request a free audit →",
    adjustValue: "Adjust value",
    adjustAmount: "Adjust amount",
    staffLabel: "How much do you pay today for a senior profile?",
    cloudLabel: "How much is your monthly cloud bill?",
    staffResult: "With Nivelics you would pay:",
    cloudResult: "Potential savings with FinOps:",
    staffNote: "Based on real projects. Exact savings depend on the profile and time commitment.",
    cloudNote: "30-40% average across our projects. The initial audit is free.",
    staffTrust: "Candidates in 5 days · No commitment",
    cloudTrust: "Free audit · No commitment",
    region: "Savings calculator",
    perMonth: "/mo",
    monthlySavings: "Monthly savings",
    annualSavings: "Annual savings",
  },
} as const;

interface CustomOutput {
  primary: string;
  primaryLabel: string;
  secondary: string;
  secondaryLabel: string;
}

type HeroCalculatorProps =
  | {
      type: "staff" | "cloud";
      accentColor: string;
      ctaText?: string;
      ctaUrl?: string;
      title?: never;
      inputLabel?: never;
      inputMin?: never;
      inputMax?: never;
      inputDefault?: never;
      outputFn?: never;
    }
  | {
      type: "custom";
      accentColor: string;
      ctaText?: string;
      ctaUrl?: string;
      title: string;
      inputLabel: string;
      inputMin: number;
      inputMax: number;
      inputDefault: number;
      outputFn: (value: number) => CustomOutput;
    };

export function HeroCalculator(props: HeroCalculatorProps) {
  const { type, accentColor, ctaUrl = "/contacto" } = props;
  const t = LABELS[useLocale() === "en" ? "en" : "es"];

  const isCustom = type === "custom";

  const defaultVal = isCustom ? props.inputDefault : type === "staff" ? 12000 : 15000;
  const max = isCustom ? props.inputMax : type === "staff" ? 25000 : 100000;
  const min = isCustom ? props.inputMin : type === "staff" ? 5000 : 1000;

  const [value, setValue] = useState(defaultVal);

  // Custom mode
  if (isCustom) {
    const output = props.outputFn(value);
    const cta = props.ctaText ?? t.talkToExpert;
    return (
      <div role="region" aria-label={props.title}>
        <p className="text-sm font-medium text-text-100 mb-3">{props.inputLabel}</p>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
          aria-label={props.inputLabel}
          className="w-full rounded-lg border border-border bg-bg-base px-4 py-2.5 font-mono text-lg text-text-100 focus:border-primary focus:outline-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={Math.max(1, Math.round((max - min) / 100))}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="mt-3 w-full accent-[var(--accent)]"
          style={{ "--accent": accentColor } as React.CSSProperties}
          aria-label={t.adjustValue}
        />
        <div className="mt-5" aria-live="polite">
          <p className="mt-1 font-mono text-2xl font-bold" style={{ color: accentColor }}>
            {output.primary}
          </p>
          <p className="text-xs text-text-40">{output.primaryLabel}</p>
          <p className="mt-3 font-mono text-lg font-bold" style={{ color: accentColor }}>
            {output.secondary}
          </p>
          <p className="text-xs text-text-40">{output.secondaryLabel}</p>
        </div>
        <Button asChild variant="cta" size="default" className="mt-4 w-full">
          <Link href={ctaUrl}>{cta}</Link>
        </Button>
      </div>
    );
  }

  // Staff / Cloud mode
  const pct = type === "staff" ? 0.4 : 0.35;
  const savings = Math.round(value * pct);
  const result = Math.round(value * (1 - pct));
  const annual = savings * 12;

  const isStaff = type === "staff";
  const label = isStaff ? t.staffLabel : t.cloudLabel;
  const resultLabel = isStaff ? t.staffResult : t.cloudResult;
  const note = isStaff ? t.staffNote : t.cloudNote;
  const cta = props.ctaText ?? (isStaff ? t.talkToExpert : t.requestAudit);
  const trustLine = isStaff ? t.staffTrust : t.cloudTrust;

  return (
    <div role="region" aria-label={t.region}>
      <p className="text-sm font-medium text-text-100 mb-3">{label}</p>
      <div className="relative">
        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-40" />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
          aria-label={label}
          className="w-full rounded-lg border border-border bg-bg-base pl-8 pr-4 py-2.5 font-mono text-lg text-text-100 focus:border-primary focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={type === "staff" ? 500 : 1000}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
        style={{ "--accent": accentColor } as React.CSSProperties}
        aria-label={t.adjustAmount}
      />
      <div className="mt-5" aria-live="polite">
        <p className="text-xs text-text-40 uppercase tracking-wider">{resultLabel}</p>
        <p className="mt-1 font-mono text-3xl font-bold" style={{ color: accentColor }}>
          ${(type === "staff" ? result : savings).toLocaleString()}
          <span className="text-base font-normal text-text-40">{t.perMonth}</span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-bg-base/50 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-text-40">{t.monthlySavings}</p>
            <p className="mt-0.5 font-mono text-lg font-bold" style={{ color: accentColor }}>
              ${savings.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-bg-base/50 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-text-40">{t.annualSavings}</p>
            <p className="mt-0.5 font-mono text-lg font-bold" style={{ color: accentColor }}>
              ${annual.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-text-40">{note}</p>
      <Button asChild variant="cta" size="default" className="mt-4 w-full">
        <Link href={ctaUrl}>{cta}</Link>
      </Button>
      <p className="mt-2 text-center text-[11px] text-text-40">
        <Zap size={12} className="inline mr-1" style={{ color: accentColor }} />
        {trustLine}
      </p>
    </div>
  );
}
