export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Generated Supabase types. `ticker_items.href` is included for clickable
 * live-ticker story links. Full table definitions are structural; unknown
 * columns remain usable via selective casts where needed.
 */
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ticker_items: {
        Row: {
          created_at: string
          headline: string
          href: string | null
          id: string
          published_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          headline: string
          href?: string | null
          id?: string
          published_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          headline?: string
          href?: string | null
          id?: string
          published_at?: string | null
          status?: string
        }
        Relationships: []
      }
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown> | never
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
    CompositeTypes: {
      [key: string]: Record<string, unknown>
    }
  }
}
