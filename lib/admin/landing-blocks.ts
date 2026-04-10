export const BLOCK_TYPES = {
  B01: {
    label: "Hero Corto",
    icon: "layout",
    defaultData: {
      badge_text: "",
      h1: "",
      subtitulo: "",
      cta_primario_texto: "",
      cta_primario_url: "",
      cta_secundario_texto: "",
      imagen_hero: "",
    },
  },
  B02: {
    label: "Hero + Formulario",
    icon: "layout-panel-left",
    defaultData: {
      h1: "",
      subtitulo: "",
      campos_formulario: ["nombre", "email", "empresa", "mensaje"],
      cta_texto: "",
    },
  },
  B03: {
    label: "Barra de Logos",
    icon: "image",
    defaultData: { titulo: "", logos: [] as string[] },
  },
  B04: {
    label: "Metricas",
    icon: "bar-chart-3",
    defaultData: {
      metricas: [] as Array<{ valor: string; label: string }>,
    },
  },
  B05: {
    label: "Propuesta de Valor",
    icon: "star",
    defaultData: {
      titulo: "",
      items: [] as Array<{ icono: string; titulo: string; descripcion: string }>,
    },
  },
  B06: {
    label: "Card Servicio",
    icon: "credit-card",
    defaultData: {
      badge: "",
      h2: "",
      parrafo: "",
      bullets: [] as string[],
      imagen: "",
      cta_texto: "",
      cta_url: "",
    },
  },
  B07: {
    label: "Proceso en Pasos",
    icon: "list-ordered",
    defaultData: {
      titulo: "",
      pasos: [] as Array<{ numero: number; titulo: string; descripcion: string }>,
    },
  },
  B08: {
    label: "Caso de Exito",
    icon: "award",
    defaultData: { caso_id: "", modo: "referencia" },
  },
  B09: {
    label: "Testimonial",
    icon: "quote",
    defaultData: {
      quote: "",
      autor_nombre: "",
      autor_cargo: "",
      autor_empresa: "",
      autor_foto: "",
    },
  },
  B10: {
    label: "FAQ",
    icon: "help-circle",
    defaultData: {
      preguntas: [] as Array<{ pregunta: string; respuesta: string }>,
    },
  },
  B11: {
    label: "CTA Intermedio",
    icon: "megaphone",
    defaultData: { copy: "", boton_texto: "", boton_url: "" },
  },
  B12: {
    label: "Formulario Completo",
    icon: "file-text",
    defaultData: {
      titulo: "",
      subtitulo: "",
      campos: ["nombre", "email", "empresa", "mensaje"],
      cta_texto: "",
      trust_signals: [] as string[],
      form_destination: "webhook",
      webhook_url: "",
    },
  },
  B13: {
    label: "Comparativa",
    icon: "columns",
    defaultData: {
      titulo: "",
      columna_nivelics_label: "Nivelics",
      columna_alternativa_label: "Alternativa",
      filas: [] as Array<{ criterio: string; nivelics: boolean; alternativa: boolean }>,
    },
  },
  B14: {
    label: "Vertical Nicho",
    icon: "target",
    defaultData: { nicho_nombre: "", copy_es: "", icono_nicho: "" },
  },
  B15: {
    label: "Contador Urgencia",
    icon: "clock",
    defaultData: {
      texto_antes: "",
      texto_despues: "",
      fecha_fin: "",
      cta_texto: "",
      cta_url: "",
    },
  },
  B16: {
    label: "Video",
    icon: "play-circle",
    defaultData: { video_url: "", thumbnail: "", caption: "" },
  },
  B17: {
    label: "Beneficios",
    icon: "check-circle",
    defaultData: {
      titulo: "",
      beneficios: [] as Array<{ icono: string; titulo: string; descripcion: string }>,
    },
  },
  B18: {
    label: "Footer Minimo",
    icon: "minus",
    defaultData: {
      mostrar_whatsapp: true,
      whatsapp_numero: "+573103926621",
      whatsapp_mensaje: "",
    },
  },
} as const;

export type BlockTypeKey = keyof typeof BLOCK_TYPES;

export const TEMPLATES: Record<string, BlockTypeKey[]> = {
  A: ["B01", "B04", "B05", "B07", "B08", "B12", "B18"],
  B: ["B02", "B03", "B04", "B06", "B10", "B12", "B18"],
  C: ["B01", "B14", "B04", "B08", "B05", "B12", "B18"],
  D: ["B01", "B13", "B04", "B08", "B09", "B12", "B18"],
  E: ["B02", "B04", "B05", "B16", "B09", "B12", "B18"],
};
