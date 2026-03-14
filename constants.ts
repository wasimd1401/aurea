import type { PricingTier, Feature } from './types';

export const FEATURES: Feature[] = [
  {
    icon: 'Sparkles',
    title: 'Estudio de Contenido',
    description: 'Genera textos para redes sociales, blogs y emails con IA entrenada en español nativo.',
  },
  {
    icon: 'Image',
    title: 'Creador de Imágenes',
    description: 'Diseña imágenes únicas para tu marca con descripciones simples. Sin necesidad de diseñador.',
  },
  {
    icon: 'Mic',
    title: 'Voz de Marca',
    description: 'Configura el tono y estilo de tu marca una vez. Todo el contenido seguirá tu identidad.',
  },
  {
    icon: 'BarChart3',
    title: 'Analíticas Inteligentes',
    description: 'Mide el rendimiento de tu contenido y recibe sugerencias para mejorar tu engagement.',
  },
  {
    icon: 'Globe',
    title: 'Multi-plataforma',
    description: 'Optimiza contenido para Instagram, TikTok, LinkedIn, X y más con un solo clic.',
  },
  {
    icon: 'Zap',
    title: 'Automatizaciones',
    description: 'Programa publicaciones y conecta con tus herramientas favoritas vía integraciones.',
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mes',
    description: 'Para emprendedores que están comenzando con contenido.',
    features: [
      '50 generaciones de contenido',
      '20 imágenes con IA',
      '5 plataformas',
      '1 voz de marca',
      'Soporte por email',
    ],
    cta: 'Empezar ahora',
  },
  {
    name: 'Growth',
    price: '$59',
    period: '/mes',
    description: 'Para creadores que quieren escalar su presencia.',
    features: [
      '150 generaciones de contenido',
      '75 imágenes con IA',
      '3 voces de marca',
      'Optimizador de hashtags',
      'Soporte prioritario',
    ],
    cta: 'Empezar ahora',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mes',
    description: 'Para negocios con múltiples marcas y alto volumen.',
    features: [
      'Contenido ilimitado',
      '200 imágenes con IA',
      '5 marcas diferentes',
      'Calendario de contenido',
      'Exportación en lote',
    ],
    cta: 'Empezar ahora',
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/mes',
    description: 'Para agencias que manejan múltiples clientes.',
    features: [
      'Todo ilimitado',
      '15 marcas/clientes',
      '5 usuarios del equipo',
      'White-label disponible',
      'Soporte dedicado',
    ],
    cta: 'Contactar ventas',
  },
];

export const NAV_ITEMS = {
  landing: [
    { label: 'Características', href: '#features' },
    { label: 'Precios', href: '#pricing' },
  ],
  dashboard: [
    { label: 'Inicio', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Estudio de Contenido', href: '/content-studio', icon: 'Sparkles' },
    { label: 'Creador de Imágenes', href: '/image-creator', icon: 'Image' },
    { label: 'Configuración', href: '/settings', icon: 'Settings' },
  ],
};
