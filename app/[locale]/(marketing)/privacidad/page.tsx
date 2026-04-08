import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Política de Privacidad | Nivelics",
  description:
    "Política de privacidad de Nivelics SAS. Información sobre el tratamiento de datos personales.",
  alternates: {
    canonical: "https://www.nivelics.com/privacidad",
    languages: {
      es: "https://www.nivelics.com/privacidad",
      en: "https://www.nivelics.com/en/privacy",
      "x-default": "https://www.nivelics.com/privacidad",
    },
  },
};

export default function PrivacidadPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Política de Privacidad", url: "/privacidad" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">Política de Privacidad</h1>
          <p className="mt-4 text-sm text-text-40">Fecha de vigencia: Abril 2026</p>
          <p className="mt-6 text-text-70 leading-relaxed">
            En Nivelics SAS (en adelante &quot;Nivelics&quot;), con domicilio en Bogotá, Colombia,
            nos comprometemos a proteger la privacidad y los datos personales de nuestros usuarios,
            clientes y visitantes. Esta política describe cómo recopilamos, usamos, almacenamos y
            protegemos su información personal.
          </p>

          <div className="mt-12 space-y-10">
            {/* Sección 1 */}
            <div>
              <h2 className="text-2xl font-bold text-text-100">1. Datos que recopilamos</h2>
              <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                <p>Podemos recopilar los siguientes tipos de datos personales:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-100">Datos de identificación:</strong> nombre
                    completo, email, número de teléfono, empresa y cargo.
                  </li>
                  <li>
                    <strong className="text-text-100">Datos de navegación:</strong> dirección IP,
                    tipo de navegador, páginas visitadas, tiempo de permanencia y datos de cookies.
                  </li>
                  <li>
                    <strong className="text-text-100">Datos de formularios:</strong> información
                    proporcionada voluntariamente a través de formularios de contacto, solicitudes
                    de empleo o suscripciones.
                  </li>
                  <li>
                    <strong className="text-text-100">Datos profesionales:</strong> perfil de
                    LinkedIn, experiencia laboral y rol de interés (en caso de aplicaciones
                    laborales).
                  </li>
                </ul>
              </div>
            </div>

            {/* Sección 2 */}
            <div>
              <h2 className="text-2xl font-bold text-text-100">2. Uso de la información</h2>
              <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                <p>Utilizamos los datos recopilados para:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Responder a solicitudes de contacto y brindar soporte.</li>
                  <li>
                    Enviar información sobre nuestros servicios, novedades y contenido relevante
                    (solo con consentimiento previo).
                  </li>
                  <li>Evaluar candidatos para posiciones laborales.</li>
                  <li>Mejorar la experiencia de navegación en nuestro sitio web.</li>
                  <li>Cumplir con obligaciones legales y regulatorias aplicables en Colombia.</li>
                  <li>Realizar análisis estadísticos anónimos para mejorar nuestros servicios.</li>
                </ul>
              </div>
            </div>

            {/* Sección 3 */}
            <div>
              <h2 className="text-2xl font-bold text-text-100">3. Cookies</h2>
              <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                <p>
                  Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario. Las
                  cookies son pequeños archivos de texto que se almacenan en su dispositivo.
                  Utilizamos los siguientes tipos de cookies:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-100">Cookies esenciales:</strong> necesarias para
                    el funcionamiento básico del sitio web.
                  </li>
                  <li>
                    <strong className="text-text-100">Cookies de análisis:</strong> nos ayudan a
                    entender cómo los visitantes interactúan con el sitio (Google Analytics).
                  </li>
                  <li>
                    <strong className="text-text-100">Cookies de preferencias:</strong> recuerdan
                    sus preferencias de idioma y tema.
                  </li>
                </ul>
                <p>
                  Puede configurar su navegador para rechazar cookies o recibir una notificación
                  cuando se envíe una cookie. Sin embargo, algunas funcionalidades del sitio pueden
                  no estar disponibles si las cookies están deshabilitadas.
                </p>
              </div>
            </div>

            {/* Sección 4 */}
            <div>
              <h2 className="text-2xl font-bold text-text-100">4. Derechos del usuario</h2>
              <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                <p>
                  De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia,
                  usted tiene los siguientes derechos sobre sus datos personales:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-100">Acceso:</strong> conocer qué datos personales
                    tenemos sobre usted.
                  </li>
                  <li>
                    <strong className="text-text-100">Rectificación:</strong> solicitar la
                    corrección de datos inexactos o incompletos.
                  </li>
                  <li>
                    <strong className="text-text-100">Supresión:</strong> solicitar la eliminación
                    de sus datos cuando no sean necesarios para la finalidad para la cual fueron
                    recopilados.
                  </li>
                  <li>
                    <strong className="text-text-100">Revocación:</strong> revocar el consentimiento
                    otorgado para el tratamiento de sus datos.
                  </li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, puede contactarnos a través de los
                  canales indicados en la sección de contacto.
                </p>
              </div>
            </div>

            {/* Sección 5 */}
            <div>
              <h2 className="text-2xl font-bold text-text-100">5. Contacto</h2>
              <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                <p>
                  Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos,
                  puede contactarnos:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-100">Responsable del tratamiento:</strong> Nivelics
                    SAS
                  </li>
                  <li>
                    <strong className="text-text-100">Ubicación:</strong> Bogotá, Colombia
                  </li>
                  <li>
                    <strong className="text-text-100">Email:</strong>{" "}
                    <a href="mailto:contacto@nivelics.com" className="text-primary hover:underline">
                      contacto@nivelics.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-text-100">WhatsApp:</strong>{" "}
                    <a
                      href="https://wa.me/573103926621"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      +57 310-3926621
                    </a>
                  </li>
                </ul>
                <p>
                  Esta política puede ser actualizada periódicamente. Cualquier cambio será
                  publicado en esta página con la fecha de vigencia actualizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
