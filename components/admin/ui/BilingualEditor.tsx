"use client";

import { useState } from "react";
import { Languages, Bot, Check, AlertCircle } from "lucide-react";

interface BilingualFieldProps {
  labelEs: string;
  labelEn: string;
  valueEs: string;
  valueEn: string;
  onChangeEs: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  onTranslate?: () => void;
  translating?: boolean;
}

export function BilingualField({
  labelEs,
  labelEn,
  valueEs,
  valueEn,
  onChangeEs,
  onChangeEn,
  multiline = false,
  rows = 4,
  placeholder,
  onTranslate,
  translating = false,
}: BilingualFieldProps) {
  const InputComponent = multiline ? "textarea" : "input";
  const inputClass =
    "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Spanish */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-70">{labelEs}</label>
        <InputComponent
          value={valueEs}
          onChange={(e) => onChangeEs(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
          {...(multiline ? { rows } : { type: "text" })}
        />
      </div>

      {/* English */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-text-70">{labelEn}</label>
          {onTranslate && valueEs && (
            <button
              type="button"
              onClick={onTranslate}
              disabled={translating}
              className="flex items-center gap-1.5 rounded-md bg-ia/10 px-2.5 py-1 text-xs font-medium text-ia hover:bg-ia/20 transition-colors disabled:opacity-50"
            >
              <Bot className="h-3.5 w-3.5" />
              {translating ? "Traduciendo..." : "Auto-traducir"}
            </button>
          )}
        </div>
        <InputComponent
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
          {...(multiline ? { rows } : { type: "text" })}
        />
      </div>
    </div>
  );
}

type Tab = "es" | "en" | "side-by-side";

interface BilingualEditorProps {
  children: (props: { activeTab: Tab }) => React.ReactNode;
  translationStatus: "complete" | "partial" | "pending" | "auto";
  onTranslationStatusChange: (status: "complete" | "partial" | "pending" | "auto") => void;
}

const statusConfig = {
  complete: { label: "Completo", color: "text-staffing", bg: "bg-staffing/10" },
  partial: { label: "Parcial", color: "text-finops", bg: "bg-finops/10" },
  pending: { label: "Pendiente", color: "text-red-400", bg: "bg-red-400/10" },
  auto: { label: "Auto-traducido", color: "text-ia", bg: "bg-ia/10" },
};

export function BilingualEditor({
  children,
  translationStatus,
  onTranslationStatusChange,
}: BilingualEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("side-by-side");

  const tabs: { value: Tab; label: string; icon?: React.ReactNode }[] = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
    { value: "side-by-side", label: "Side by Side", icon: <Languages className="h-3.5 w-3.5" /> },
  ];

  const status = statusConfig[translationStatus];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary/10 text-primary"
                  : "text-text-70 hover:text-text-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Translation status badge */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.color}`}
          >
            {translationStatus === "complete" ? (
              <Check className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {status.label}
          </span>
          <select
            value={translationStatus}
            onChange={(e) =>
              onTranslationStatusChange(
                e.target.value as "complete" | "partial" | "pending" | "auto",
              )
            }
            className="rounded-lg border border-border bg-bg-elevated px-2 py-1 text-xs text-text-70 focus:border-primary focus:outline-none"
          >
            <option value="pending">Pendiente</option>
            <option value="partial">Parcial</option>
            <option value="complete">Completo</option>
            <option value="auto">Auto-traducido</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {children({ activeTab })}
    </div>
  );
}

export function TranslationBadge({
  status,
}: {
  status: "complete" | "partial" | "pending" | "auto";
}) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
    >
      {status === "complete" ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
