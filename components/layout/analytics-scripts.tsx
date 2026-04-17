import Script from "next/script";

interface AnalyticsScriptsProps {
  gaId?: string | null;
  gtmId?: string | null;
}

const GA_ID_RE = /^G-[A-Z0-9]+$/i;
const GTM_ID_RE = /^GTM-[A-Z0-9]+$/i;

export function AnalyticsScripts({ gaId, gtmId }: AnalyticsScriptsProps) {
  const ga = gaId?.trim();
  const gtm = gtmId?.trim();
  const validGa = ga && GA_ID_RE.test(ga) ? ga : null;
  const validGtm = gtm && GTM_ID_RE.test(gtm) ? gtm : null;

  if (!validGa && !validGtm) return null;

  return (
    <>
      {validGtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${validGtm}');`}
        </Script>
      )}
      {validGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validGa}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${validGa}');`}
          </Script>
        </>
      )}
    </>
  );
}

export function AnalyticsNoscript({ gtmId }: { gtmId?: string | null }) {
  const gtm = gtmId?.trim();
  const validGtm = gtm && GTM_ID_RE.test(gtm) ? gtm : null;
  if (!validGtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${validGtm}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
