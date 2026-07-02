"use client";

import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";

interface SavingsCalculatorProps {
  title: string;
  type: "staff" | "cloud";
}

export function SavingsCalculator({ title, type }: SavingsCalculatorProps) {
  const [value, setValue] = useState(type === "staff" ? 15000 : 20000);
  const savingsPercent = type === "staff" ? 0.4 : 0.35;
  const monthlySavings = Math.round(value * savingsPercent);
  const annualSavings = monthlySavings * 12;
  const note =
    type === "staff"
      ? "Basado en proyectos reales con clientes en USA"
      : "Basado en promedio de proyectos FinOps";
  const inputLabel =
    type === "staff" ? "Salario mensual actual (USD)" : "Factura cloud mensual (USD)";

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[600px] px-6 md:px-20">
        <div className="glass rounded-xl p-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <Calculator size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-text-100">{title}</h2>
          </div>
          <label className="block text-sm font-medium text-text-100 mb-2">{inputLabel}</label>
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-40"
            />
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-border bg-bg-base pl-8 pr-4 py-3 text-lg font-mono text-text-100 focus:border-primary focus:outline-none"
            />
          </div>
          <input
            type="range"
            min={type === "staff" ? 5000 : 5000}
            max={type === "staff" ? 30000 : 100000}
            step={1000}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="mt-4 w-full accent-primary"
          />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center">
              <p className="text-[11px] uppercase tracking-wider text-text-40">Ahorro mensual</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary">
                ${monthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center">
              <p className="text-[11px] uppercase tracking-wider text-text-40">Ahorro anual</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary">
                ${annualSavings.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-text-40">{note}</p>
        </div>
      </div>
    </section>
  );
}
