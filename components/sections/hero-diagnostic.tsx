"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DiagnosticQuestion {
  id: string;
  label: string;
  type: "select";
  options?: string[];
}

interface DiagnosticResult {
  title: string;
  description: string;
  recommendation: string;
  cta: string;
  ctaUrl: string;
}

interface HeroDiagnosticProps {
  title: string;
  questions: DiagnosticQuestion[];
  getResult: (answers: Record<string, string>) => DiagnosticResult;
  accentColor: string;
}

export function HeroDiagnostic({ title, questions, getResult, accentColor }: HeroDiagnosticProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;

  const result = allAnswered ? getResult(answers) : null;

  return (
    <div role="region" aria-label={title}>
      <p className="text-sm font-semibold text-text-100 mb-4">{title}</p>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className={i < answered + 1 ? "" : "opacity-40 pointer-events-none"}>
            <label className="block text-xs font-medium text-text-70 mb-1">{q.label}</label>
            <select
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              className="w-full rounded-lg border border-border bg-bg-base px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
            >
              <option value="">Seleccionar...</option>
              {q.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {result && (
        <div
          className="mt-5 rounded-lg p-4"
          style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}25` }}
        >
          <p className="text-sm font-bold text-text-100">{result.title}</p>
          <p className="mt-1 text-xs text-text-70">{result.description}</p>
          <p className="mt-2 text-xs font-medium" style={{ color: accentColor }}>
            {result.recommendation}
          </p>
          <Button asChild variant="cta" size="sm" className="mt-3 w-full">
            <Link href={result.ctaUrl}>{result.cta}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
