interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const HOME_FAQ: FAQItem[] = [
  {
    question: "¿Cuánto tarda Nivelics en presentar candidatos de Staff Augmentation?",
    answer:
      "Presentamos candidatos calificados en 5 días hábiles. La integración completa al equipo del cliente se logra en 6 días hábiles, con garantía de reemplazo sin costo.",
  },
  {
    question: "¿En qué plataformas cloud trabaja Nivelics?",
    answer:
      "Trabajamos con las tres principales plataformas cloud: Amazon Web Services (AWS), Google Cloud Platform (GCP) y Microsoft Azure. Diseñamos arquitecturas multi-cloud según las necesidades del proyecto.",
  },
  {
    question: "¿Qué es FinOps y cuánto puedo ahorrar?",
    answer:
      "FinOps es la práctica de optimización y gobernanza financiera del gasto en cloud. Con nuestra implementación de FinOps, los clientes logran ahorros típicos del 30-40% en su factura cloud sin perder rendimiento.",
  },
  {
    question: "¿En qué países opera Nivelics?",
    answer:
      "Nivelics opera en Colombia (sede principal en Bogotá), México, Estados Unidos (oficina en Miami), Argentina, El Salvador, Panamá, Ecuador y Perú.",
  },
];
