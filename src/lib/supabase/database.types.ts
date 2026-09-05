export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      article_revisions: {
        Row: {
          article_id: string
          edited_at: string
          edited_by: string | null
          id: string
          snapshot: Json
        }
        Insert: {
          article_id: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          snapshot: Json
        }
        Update: {
          article_id?: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "article_revisions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_topics: {
        Row: {
          article_id: string
          topic_id: string
        }
        Insert: {
          article_id: string
          topic_id: string
        }
        Update: {
          article_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_topics_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          body: Json
          canonical_url: string | null
          category_id: string
          country: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image_id: string | null
          id: string
          premium: boolean
          publication_date: string
          read_time_minutes: number | null
          region: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          social_image_id: string | null
          source_additional: string | null
          source_author: string | null
          source_institution: string | null
          source_name: string | null
          source_published_at: string | null
          source_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body?: Json
          canonical_url?: string | null
          category_id: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_id?: string | null
          id?: string
          premium?: boolean
          publication_date?: string
          read_time_minutes?: number | null
          region?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          social_image_id?: string | null
          source_additional?: string | null
          source_author?: string | null
          source_institution?: string | null
          source_name?: string | null
          source_published_at?: string | null
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: Json
          canonical_url?: string | null
          category_id?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_id?: string | null
          id?: string
          premium?: boolean
          publication_date?: string
          read_time_minutes?: number | null
          region?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          social_image_id?: string | null
          source_additional?: string | null
          source_author?: string | null
          source_institution?: string | null
          source_name?: string | null
          source_published_at?: string | null
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_social_image_id_fkey"
            columns: ["social_image_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          id: string
          name: string
          slug: string
          title: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          title?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          article_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          article_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          article_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          organisation: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          organisation?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          organisation?: string | null
          subject?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          credit: string | null
          id: string
          link_url: string | null
          source: string | null
          type: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          link_url?: string | null
          source?: string | null
          type: string
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          link_url?: string | null
          source?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirm_token: string
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          status: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          status?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          status?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          newsletter_subscribed: boolean
          subscription_status: string
          subscription_tier: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          newsletter_subscribed?: boolean
          subscription_status?: string
          subscription_tier?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          newsletter_subscribed?: boolean
          subscription_status?: string
          subscription_tier?: string
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          article_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticker_items: {
        Row: {
          created_at: string
          headline: string
          id: string
          published_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          headline: string
          id?: string
          published_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          headline?: string
          id?: string
          published_at?: string | null
          status?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
