import type { Dictionary } from "@/lib/i18n/types";

export const es = {
  metadata: {
    title: "Site2Markdown",
    description: "Extraé una página pública en markdown listo para pegar en workflows con LLM.",
  },
  shell: {
    eyebrow: "Extracción server-first",
    title: "Convertí una página en markdown limpio sin salir del workbench.",
    description:
      "Pegá una URL pública, corré el extractor en el server e inspeccioná el resultado inline como markdown o como vista legible.",
    panelTitle: "Qué optimiza este workbench",
    panelDescription:
      "URLs públicas seguras, extracción legible y markdown que podés inspeccionar antes de copiarlo a tu próximo prompt.",
    localeSwitcher: {
      switchToEnglish: "Switch to English",
      switchToSpanish: "Cambiar a español",
    },
    stats: {
      modeLabel: "Modo",
      modeValue: "Una sola página, resultado inline",
      executionLabel: "Ejecución",
      executionValue: "Server action + estado en la misma página",
      outputLabel: "Salida",
      outputValue: "Markdown primero, vista previa después",
    },
  },
  form: {
    cardTitle: "URL de origen",
    cardDescription:
      "Pegá un artículo público o una página de documentación. El server la va a buscar, extraer y formatear como markdown.",
    label: "URL pública de la página",
    placeholder: "https://example.com/articulo",
    helperIdle: "Pegá una URL pública para extraer markdown.",
    helperError: "Corregí la URL y volvé a correr la conversión inline.",
    helperSuccessPrefix: "Última extracción lista desde",
    capabilityIdle: "Sin fallback de browser rendering en el MVP",
    capabilityPending: "Buscando y convirtiendo",
    capabilityNote: "El extractor corre sólo del lado del server y devuelve una página por request.",
  },
  buttons: {
    copy: "Copiar markdown",
    copied: "Copiado",
    download: "Descargar .md",
    submit: "Extraer markdown",
    submitting: "Convirtiendo…",
  },
  result: {
    badgeReady: "Extracción lista",
    badgeRefreshing: "Actualizando…",
    untitled: "Página sin título",
    unknown: "Desconocido",
    tabs: {
      markdown: "Markdown",
      preview: "Vista previa",
    },
    viewDescriptions: {
      markdown: "Salida exacta, lista para copiar.",
      preview: "Aproximación renderizada para una QA rápida.",
    },
    tabListLabel: "Vistas del resultado",
    metadata: {
      title: "Título",
      site: "Sitio",
      filename: "Archivo",
    },
  },
  emptyState: {
    title: "Workbench de resultado",
    idleDescription: "Pegá una URL pública para generar un artifact de markdown que podés inspeccionar, copiar o descargar.",
    pendingDescription: "Estamos preparando el área de resultado para la próxima extracción.",
    steps: [
      {
        title: "Pegá una URL pública",
        description: "Pegá una URL pública para iniciar el flujo de extracción. Las direcciones privadas y locales se rechazan antes del fetch.",
      },
      {
        title: "Corré el extractor del server",
        description: "La página se busca en el server, se limpia con Readability y se transforma a markdown.",
      },
      {
        title: "Inspeccioná el artifact final",
        description: "Revisá primero el markdown crudo y después pasá a vista previa si querés una validación rápida.",
      },
    ],
  },
  inlineError: {
    title: "La conversión falló",
    description: "Los errores de validación y extracción quedan inline para que puedas corregir el pedido sin perder contexto.",
    fallback: "No pudimos convertir esa URL. Probá con otra página pública.",
    genericHttpPrefix: "Esa página devolvió un HTTP",
    messages: {
      EMPTY_URL: "Ingresá una URL.",
      INVALID_URL: "Ingresá una URL absoluta.",
      UNSUPPORTED_PROTOCOL: "Ingresá una URL pública HTTP(S).",
      PRIVATE_NETWORK: "Esa URL apunta a una red privada o bloqueada.",
      HOST_RESOLUTION_FAILED: "No pudimos resolver ese host. Revisá la URL e intentá de nuevo.",
      REDIRECT_MISSING_LOCATION: "Esa página devolvió un redirect inválido.",
      TOO_MANY_REDIRECTS: "Esa página redirigió demasiadas veces para procesarla con seguridad.",
      REQUEST_TIMEOUT: "La request agotó el tiempo antes de poder traer la página.",
      NON_HTML_CONTENT: "Esa URL no devolvió contenido HTML.",
      PAGE_TOO_LARGE: "Esa página es demasiado grande para procesarla con seguridad.",
      NO_READABLE_CONTENT: "No pudimos encontrar contenido legible con sentido en esa página.",
      UNKNOWN: "No pudimos convertir esa URL. Probá con otra página pública.",
    },
    http: {
      blocked: "Esa página está bloqueando el acceso automatizado en este momento.",
      notFound: "No se pudo encontrar esa página.",
      server: "Esa página está teniendo un error del server ahora mismo.",
    },
  },
  loading: {
    eyebrow: "Preparando workspace",
    title: "Cargando Site2Markdown",
    description: "Estamos levantando la interfaz para que puedas validar la salida markdown en un solo lugar.",
    cardTitle: "Inicializando interfaz",
  },
  routeError: {
    eyebrow: "Recuperación de runtime",
    title: "La app encontró un error inesperado a nivel de ruta.",
    description: "Esto es separado de los fallos de extracción. Reiniciá la ruta y volvamos al workbench.",
    cardTitle: "Error inesperado de la app",
    cardDescription: "El framework interrumpió la página antes de que el formulario pudiera terminar de renderizar.",
    unknownMessage: "Fallo desconocido a nivel de ruta.",
    retry: "Reintentar",
  },
} satisfies Dictionary;
