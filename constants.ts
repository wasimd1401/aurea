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
    name: 'Inicio',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para explorar la plataforma y probar las herramientas.',
    features: [
      '10 generaciones de texto al mes',
      '5 imágenes al mes',
      '1 voz de marca',
      'Soporte por email',
    ],
    cta: 'Comenzar gratis',
  },
  {
    name: 'Profesional',
    price: '$29',
    period: '/mes',
    description: 'Para emprendedores que crean contenido regularmente.',
    features: [
      'Generaciones ilimitadas de texto',
      '100 imágenes al mes',
      '5 voces de marca',
      'Analíticas avanzadas',
      'Soporte prioritario',
      'Exportar en múltiples formatos',
    ],
    cta: 'Comenzar prueba gratis',
    highlighted: true,
  },
  {
    name: 'Empresa',
    price: '$79',
    period: '/mes',
    description: 'Para equipos y agencias con necesidades avanzadas.',
    features: [
      'Todo en Profesional',
      'Imágenes ilimitadas',
      'Voces de marca ilimitadas',
      'API access',
      'Miembros de equipo ilimitados',
      'Soporte dedicado 24/7',
      'Integraciones personalizadas',
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
