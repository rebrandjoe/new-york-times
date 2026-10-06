export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Supabase Database typing.
 * Kept permissive so client queries stay flexible after schema changes
 * (e.g. ticker_items.href). Prefer regenerating full types from Supabase CLI
 * when convenient: `supabase gen types typescript`.
 */
export type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
        Relationships: any[]
      }
    >
    Views: Record<
      string,
      {
        Row: Record<string, any>
        Relationships: any[]
      }
    >
    Functions: Record<
      string,
      {
        Args: Record<string, any> | never
        Returns: any
      }
    >
    Enums: Record<string, string>
    CompositeTypes: Record<string, Record<string, any>>
  }
}
