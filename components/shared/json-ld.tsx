/**
 * Helper para emitir bloques JSON-LD sin repetir el patrón
 * `<script type="application/ld+json">` en cada página.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
