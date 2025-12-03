import { NavItem, Service } from './types';

export const CONTENT = {
  es: {
    nav: [
      { label: 'Servicios', href: '#services' },
      { label: 'Laboratorio Creativo', href: '#generator' },
      { label: 'Contacto', href: '#contact' },
    ],
    hero: {
      eyebrow: "INTELIGENCIA ESTRATÉGICA DESDE EL SUR",
      headline: "Marketing Orgánico & Digital.",
      tagline: "Instinto humano. Precisión artificial.",
      description: "Fusionamos la potencia generativa con estrategia pura.\nResultados tangibles para el mercado de alta gama.",
      cta: "Auditoría Gratuita",
      ctaSecondary: "Ver Servicios",
      metrics: [
        { value: "+35%", label: "Leads Calificados" },
        { value: "40hrs", label: "Ahorro Semanal" },
        { value: "3.5x", label: "ROI Promedio" },
      ]
    },
    services: {
      title: "Artesanía Digital",
      subtitle: "Estrategia técnica para marcas que buscan el liderazgo.",
      items: [
        { 
          title: "Automatización de Ventas", 
          desc: "El motor silencioso de tu crecimiento.",
          detailedDesc: "Implementamos ecosistemas autónomos (n8n, Zapier, HubSpot) que capturan y nutren leads sin intervención humana. Tu equipo cierra acuerdos, no tickets.",
          features: ["Ecosistema n8n & Make", "Chatbots con Memoria", "Integración CRM Bidireccional"]
        },
        { 
          title: "Contenido Orgánico", 
          desc: "Narrativa de marca impulsada por datos.",
          detailedDesc: "Modelos de lenguaje afinados específicamente para tu voz. Generamos contenido que resuena por su autenticidad y convierte por su estrategia, no por azar.",
          features: ["Fine-tuning de Voz", "Visuales Editoriales", "Calendarios Automatizados"]
        },
        { 
          title: "Analítica Predictiva", 
          desc: "Decisiones tomadas con datos del futuro.",
          detailedDesc: "Dejamos de mirar el retrovisor. Utilizamos algoritmos predictivos para anticipar tendencias de consumo y ajustar tu oferta antes que la competencia reaccione.",
          features: ["Forecast de Demanda", "Análisis de Sentimiento", "Detección de Tendencias"]
        },
        { 
          title: "Posicionamiento de Marca", 
          desc: "Diferenciación en mercados saturados.",
          detailedDesc: "Estrategias de identidad visual y verbal diseñadas para cortar el ruido digital. Establecemos tu autoridad indiscutible en el nicho.",
          features: ["Auditoría de Competencia", "Identidad Verbal", "Arquitectura de Marca"]
        },
        { 
          title: "Diseño Web & E-commerce", 
          desc: "Infraestructura digital para la conversión.",
          detailedDesc: "Transformación digital completa: desde sitios corporativos minimalistas hasta arquitecturas Shopify/WooCommerce robustas diseñadas para escalar.",
          features: ["Diseño UX/UI Premium", "Integración Shopify/WooCommerce", "Transformación Digital"]
        },
      ],
      stackTitle: "Ecosistema Técnico",
      stack: ["n8n", "Zapier", "Notion", "Make", "HubSpot", "OpenAI", "Anthropic", "Shopify"]
    },
    generator: {
      title: "Ignición Creativa",
      subtitle: "Así trabajamos tras bambalinas: nuestra IA diseña conceptos de campaña en segundos, sin mostrar el código.",
      inputLabel1: "Nombre de Marca",
      inputLabel2: "Producto / Servicio",
      inputLabel3: "Público Objetivo",
      cta: "Generar Conceptos",
      loading: "Diseñando tu campaña...",
      microcopy: "Sin registro. Sin spam. Solo ideas.",
      example: "Ejemplo: Aurea / Consultoría / CEOs"
    },
    contact: {
      title: "Hablemos de Futuro",
      whatsapp: "Chat en WhatsApp",
      whatsappBadge: "Responde en < 5m",
      email: "contacto@aurea.cl",
      phoneDisplay: "+56 9 8765 4321",
      phoneLink: "https://wa.me/56987654321", 
      form: {
        name: "Nombre Completo",
        email: "Correo Corporativo",
        message: "¿Qué desafío enfrentas hoy?",
        submit: "Solicitar Propuesta"
      }
    }
  },
  en: {
    nav: [
      { label: 'Services', href: '#services' },
      { label: 'Creative Lab', href: '#generator' },
      { label: 'Contact', href: '#contact' },
    ],
    hero: {
      eyebrow: "STRATEGIC INTELLIGENCE FROM THE SOUTH",
      headline: "Organic & Digital Marketing.",
      tagline: "Human instinct. Artificial precision.",
      description: "Fusing generative power with pure strategy.\nTangible results for the high-end market.",
      cta: "Free Audit",
      ctaSecondary: "View Services",
      metrics: [
        { value: "+35%", label: "Qualified Leads" },
        { value: "40hrs", label: "Saved Weekly" },
        { value: "3.5x", label: "Average ROI" },
      ]
    },
    services: {
      title: "Digital Craft",
      subtitle: "Technical strategy for brands seeking leadership.",
      items: [
        { 
          title: "Sales Automation", 
          desc: "The silent engine of your growth.",
          detailedDesc: "We implement autonomous ecosystems (n8n, Zapier, HubSpot) that capture and nurture leads without human intervention. Your team closes deals, not tickets.",
          features: ["n8n & Make Ecosystem", "Memory-enabled Chatbots", "Bidirectional CRM Integration"]
        },
        { 
          title: "Organic Content", 
          desc: "Data-driven brand narrative.",
          detailedDesc: "Language models fine-tuned specifically for your voice. We generate content that resonates through authenticity and converts through strategy, not luck.",
          features: ["Voice Fine-tuning", "Editorial Visuals", "Automated Calendars"]
        },
        { 
          title: "Predictive Analytics", 
          desc: "Decisions made with future data.",
          detailedDesc: "Stop looking in the rearview mirror. We use predictive algorithms to anticipate consumption trends and adjust your offer before competitors react.",
          features: ["Demand Forecasting", "Sentiment Analysis", "Trend Detection"]
        },
        { 
          title: "Brand Positioning", 
          desc: "Differentiation in saturated markets.",
          detailedDesc: "Visual and verbal identity strategies designed to cut through digital noise. We establish your indisputable authority in the niche.",
          features: ["Competitor Audit", "Verbal Identity", "Brand Architecture"]
        },
        { 
          title: "Web Design & E-commerce", 
          desc: "Digital infrastructure for conversion.",
          detailedDesc: "Complete digital transformation: from minimalist corporate sites to robust Shopify/WooCommerce architectures designed to scale.",
          features: ["Premium UX/UI Design", "Shopify/WooCommerce Integration", "Digital Transformation"]
        },
      ],
      stackTitle: "Technical Ecosystem",
      stack: ["n8n", "Zapier", "Notion", "Make", "HubSpot", "OpenAI", "Anthropic", "Shopify"]
    },
    generator: {
      title: "Creative Ignition",
      subtitle: "How we work behind the scenes: our AI designs campaign concepts in seconds, code unseen.",
      inputLabel1: "Brand Name",
      inputLabel2: "Product / Service",
      inputLabel3: "Target Audience",
      cta: "Generate Concepts",
      loading: "Designing campaign...",
      microcopy: "No signup. No spam. Just ideas.",
      example: "Example: Aurea / Consulting / CEOs"
    },
    contact: {
      title: "Let's Talk Future",
      whatsapp: "Chat on WhatsApp",
      whatsappBadge: "Reply in < 5m",
      email: "contact@aurea.cl",
      phoneDisplay: "+56 9 8765 4321",
      phoneLink: "https://wa.me/56987654321",
      form: {
        name: "Full Name",
        email: "Work Email",
        message: "What challenge are you facing?",
        submit: "Request Proposal"
      }
    }
  }
};