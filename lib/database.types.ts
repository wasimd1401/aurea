export type Plan = 'free' | 'starter' | 'growth' | 'business' | 'agency';
export type VoiceTone = 'profesional' | 'casual' | 'inspirador' | 'educativo' | 'vendedor';
export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'facebook' | 'twitter';
export type ImageStyle = 'minimalista' | 'bold' | 'elegante' | 'creativo';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  voice_tone: VoiceTone;
  industry: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  is_default: boolean;
  created_at: string;
}

export interface ContentGeneration {
  id: string;
  user_id: string;
  brand_id: string;
  input_idea: string;
  platform: Platform;
  generated_content: string;
  hashtags: string[];
  created_at: string;
}

export interface ImageGeneration {
  id: string;
  user_id: string;
  brand_id: string;
  prompt: string;
  style: ImageStyle;
  image_url: string;
  platform_size: string;
  created_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  month: string;
  content_count: number;
  image_count: number;
}
