export type ConfirmationLocale = "es" | "en";

export interface ConfirmationData {
  nombre: string;
  locale: ConfirmationLocale;
  servicio?: string | null;
  /** Absolute URL to the Nivelics logo. Falls back to text when omitted. */
  logoUrl?: string | null;
}

const COPY = {
  es: {
    greeting: (name: string) => `Hola ${name},`,
    intro:
      "Recibimos tu mensaje. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas hábiles.",
    badgeLabel: "Tema de interés",
    inMeantime: "Mientras tanto",
    links: [
      { label: "Nuestros servicios", url: "https://www.nivelics.com/servicios" },
      { label: "Casos de éxito", url: "https://www.nivelics.com/casos-de-exito" },
      { label: "Blog", url: "https://www.nivelics.com/blog" },
    ],
    tagline: "Nivelics — Transforma más rápido.",
    pillars: "IA · Cloud · Staffing Premium",
    locations: "Bogotá, Colombia · Miami, FL",
    preheader:
      "Recibimos tu mensaje. Nuestro equipo te contactará en las próximas 24 horas hábiles.",
  },
  en: {
    greeting: (name: string) => `Hi ${name},`,
    intro: "We received your message. Our team will get back to you within 24 business hours.",
    badgeLabel: "Topic",
    inMeantime: "In the meantime",
    links: [
      { label: "Our services", url: "https://www.nivelics.com/en/services" },
      { label: "Success stories", url: "https://www.nivelics.com/en/success-stories" },
      { label: "Blog", url: "https://www.nivelics.com/en/blog" },
    ],
    tagline: "Nivelics — Transform faster.",
    pillars: "AI · Cloud · Premium Staffing",
    locations: "Bogotá, Colombia · Miami, FL",
    preheader: "We received your message. Our team will get back to you within 24 business hours.",
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildLeadConfirmationHtml(data: ConfirmationData): string {
  const copy = COPY[data.locale];
  const name = escapeHtml(data.nombre);
  // Logo block — three layers of robustness:
  //   1. Outlook (MSO): conditional comment renders text only (Outlook mangles
  //      SVG/PNG sizing and often blocks remote images by default).
  //   2. Modern clients: <img> with alt="NIVELICS" so if the network fetch
  //      fails the alt text still conveys branding.
  //   3. No logo URL configured: fall through to pure text.
  const brandText = `<span style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#f0f6fc;letter-spacing:2px;">NIVELICS</span>`;
  const logoBlock = data.logoUrl
    ? `<!--[if mso]>${brandText}<![endif]-->
       <!--[if !mso]><!--><img src="${escapeHtml(data.logoUrl)}" alt="NIVELICS" width="160" height="40" style="display:block;margin:0 auto;height:40px;width:auto;max-width:160px;border:0;outline:none;text-decoration:none;" /><!--<![endif]-->`
    : brandText;

  const servicioBadge = data.servicio
    ? `<tr>
         <td style="padding:0 40px 24px 40px;">
           <table role="presentation" cellpadding="0" cellspacing="0" border="0">
             <tr>
               <td style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);border-radius:20px;padding:6px 16px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:13px;color:#00d4ff;font-weight:500;">
                 ${escapeHtml(copy.badgeLabel)}: ${escapeHtml(data.servicio)}
               </td>
             </tr>
           </table>
         </td>
       </tr>`
    : "";

  const linksRow = copy.links
    .map(
      (link, idx) =>
        `<a href="${link.url}" style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;color:#00d4ff;text-decoration:none;font-weight:500;${idx > 0 ? "margin-left:24px;" : ""}">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${data.locale}">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(copy.tagline)}</title>
  <!--[if mso]>
  <style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#0d1117;width:100%;" bgcolor="#0d1117">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#0d1117;">
    ${escapeHtml(copy.preheader)}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0d1117" style="background:#0d1117;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 40px 24px 40px;">
              ${logoBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 8px 40px;">
              <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:20px;font-weight:600;color:#f0f6fc;letter-spacing:-0.01em;">
                ${copy.greeting(name)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 24px 40px;">
              <p style="margin:0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#8b949e;">
                ${escapeHtml(copy.intro)}
              </p>
            </td>
          </tr>
          ${servicioBadge}
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 8px 40px;">
              <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:0.08em;">
                ${escapeHtml(copy.inMeantime)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 40px 32px 40px;">
              ${linksRow}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 32px 40px;">
              <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:12px;color:#484f58;line-height:1.6;">
                ${escapeHtml(copy.tagline)}<br />
                ${escapeHtml(copy.pillars)}
              </div>
              <div style="margin-top:10px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:11px;color:#30363d;">
                ${escapeHtml(copy.locations)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
