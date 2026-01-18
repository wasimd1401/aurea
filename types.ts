export type Language = 'es' | 'en';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  detailedDesc?: string;
  features?: string[];
}
