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

export interface CreativeConcept {
  title: string;
  tagline: string;
  visualDescription: string;
  rationale: string;
  imageUrl?: string;
}

export interface GeneratorResult {
  brandVoiceAnalysis: string;
  concepts: CreativeConcept[];
}

export enum LoadState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}