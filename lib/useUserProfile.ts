import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import type { UserProfile, ContentGeneration, ImageGeneration, UsageTracking, Plan } from './database.types';

const PLAN_LIMITS: Record<Plan, { content: number; images: number }> = {
  free: { content: 5, images: 3 },
  starter: { content: 50, images: 20 },
  growth: { content: 150, images: 75 },
  business: { content: Infinity, images: 200 },
  agency: { content: Infinity, images: Infinity },
};

const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Growth',
  business: 'Business',
  agency: 'Agency',
};

export { PLAN_LIMITS, PLAN_LABELS };

export type RecentItem = {
  id: string;
  type: 'content' | 'image';
  title: string;
  subtitle: string;
  created_at: string;
};

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UsageTracking | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUsage(null);
      setRecentItems([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // Fetch current month usage
      const now = new Date();
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', monthStr)
        .single();

      setUsage(usageData as UsageTracking | null);

      // Fetch recent content generations
      const { data: contentData } = await supabase
        .from('content_generations')
        .select('id, input_idea, platform, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent image generations
      const { data: imageData } = await supabase
        .from('image_generations')
        .select('id, prompt, style, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Merge and sort
      const items: RecentItem[] = [];
      if (contentData) {
        for (const c of contentData) {
          items.push({
            id: c.id,
            type: 'content',
            title: c.input_idea,
            subtitle: c.platform,
            created_at: c.created_at,
          });
        }
      }
      if (imageData) {
        for (const img of imageData) {
          items.push({
            id: img.id,
            type: 'image',
            title: img.prompt,
            subtitle: img.style,
            created_at: img.created_at,
          });
        }
      }
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentItems(items.slice(0, 5));

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const plan = profile?.plan || 'free';
  const limits = PLAN_LIMITS[plan];

  return {
    profile,
    usage,
    recentItems,
    loading,
    plan,
    limits,
    planLabel: PLAN_LABELS[plan],
  };
}
