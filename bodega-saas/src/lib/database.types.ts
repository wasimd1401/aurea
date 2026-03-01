// Supabase database types — matches the migration schema

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: string
          plan_status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          max_products: number
          max_users: number
          max_locations: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: string
          plan_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          max_products?: number
          max_users?: number
          max_locations?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: string
          plan_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          max_products?: number
          max_users?: number
          max_locations?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          org_id: string
          role: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          org_id: string
          role?: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          org_id?: string
          role?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          org_id: string
          name: string
          sku: string
          category: string
          unit: string
          storage_zone: string
          current_stock: number
          min_stock: number
          max_stock: number
          cost_per_unit: number
          supplier: string
          shelf_life_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          sku: string
          category: string
          unit?: string
          storage_zone?: string
          current_stock?: number
          min_stock?: number
          max_stock?: number
          cost_per_unit?: number
          supplier?: string
          shelf_life_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          sku?: string
          category?: string
          unit?: string
          storage_zone?: string
          current_stock?: number
          min_stock?: number
          max_stock?: number
          cost_per_unit?: number
          supplier?: string
          shelf_life_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      stock_batches: {
        Row: {
          id: string
          product_id: string
          org_id: string
          lot_number: string
          quantity: number
          expiration_date: string
          received_date: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          org_id: string
          lot_number: string
          quantity?: number
          expiration_date: string
          received_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          org_id?: string
          lot_number?: string
          quantity?: number
          expiration_date?: string
          received_date?: string
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          org_id: string
          type: string
          quantity: number
          date: string
          responsible: string
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          org_id: string
          type: string
          quantity: number
          date?: string
          responsible?: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          org_id?: string
          type?: string
          quantity?: number
          date?: string
          responsible?: string
          notes?: string
          created_at?: string
        }
      }
      loss_records: {
        Row: {
          id: string
          product_id: string
          org_id: string
          quantity: number
          reason: string
          cost_impact: number
          date: string
          responsible: string
          preventable: boolean
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          org_id: string
          quantity: number
          reason: string
          cost_impact?: number
          date?: string
          responsible?: string
          preventable?: boolean
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          org_id?: string
          quantity?: number
          reason?: string
          cost_impact?: number
          date?: string
          responsible?: string
          preventable?: boolean
          notes?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
