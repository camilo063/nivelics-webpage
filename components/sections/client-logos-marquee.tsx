const CLIENTS = [
  { name: "Televisa", abbr: "TV" },
  { name: "AB InBev", abbr: "ABI" },
  { name: "Univision", abbr: "UNI" },
  { name: "Grupo Bolívar", abbr: "GB" },
  { name: "Pulzo", abbr: "PLZ" },
  { name: "Crónica", abbr: "CRN" },
  { name: "Two Maids", abbr: "TM" },
];

function LogoItem({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div
      aria-label={name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 24px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          background: "rgba(0,212,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 700,
          color: "#00D4FF",
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}
      >
        {abbr}
      </span>
      <span
        style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export function ClientLogosMarquee() {
  const triple = [...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section
      aria-label="Empresas que confían en Nivelics"
      style={{
        padding: "24px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "18px",
          marginTop: 0,
        }}
      >
        Empresas en LATAM y USA que ya transformaron con Nivelics
      </p>

      <div style={{ overflow: "hidden" }}>
        <div
          className="client-logos-marquee__track"
          style={{
            display: "flex",
            gap: "14px",
            width: "max-content",
          }}
        >
          {triple.map((c, i) => (
            <LogoItem key={`${c.abbr}-${i}`} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
