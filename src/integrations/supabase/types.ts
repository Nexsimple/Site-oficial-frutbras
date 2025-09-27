export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          user_email?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_info: Json
          id: string
          items: Json
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_info?: Json
          id?: string
          items?: Json
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_info?: Json
          id?: string
          items?: Json
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          images: string[] | null
          long_desc: string | null
          price: number
          seo_meta: Json | null
          short_desc: string | null
          slug: string
          specs: Json | null
          stock: number
          title: string
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          long_desc?: string | null
          price: number
          seo_meta?: Json | null
          short_desc?: string | null
          slug: string
          specs?: Json | null
          stock?: number
          title: string
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          long_desc?: string | null
          price?: number
          seo_meta?: Json | null
          short_desc?: string | null
          slug?: string
          specs?: Json | null
          stock?: number
          title?: string
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          colors: Json | null
          created_at: string
          email: string | null
          id: string
          logo: string | null
          payment_methods: string[] | null
          phone: string | null
          policies: string | null
          seo_default: Json | null
          site_name: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          colors?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          policies?: string | null
          seo_default?: Json | null
          site_name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          colors?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          policies?: string | null
          seo_default?: Json | null
          site_name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      teste: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_pedido_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean
          avatar_url: string
          bio: string
          company_name: string
          contatos: Json
          created_at: string
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          servicos: string[]
          tipo_usuario: Database["public"]["Enums"]["user_type"]
          updated_at: string
          user_id: string
        }[]
      }
      get_profile_contact_info: {
        Args: { profile_id: string }
        Returns: Json
      }
      get_public_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean
          avatar_url: string
          bio: string
          created_at: string
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          servicos: string[]
          tipo_usuario: Database["public"]["Enums"]["user_type"]
          updated_at: string
        }[]
      }
    }
    Enums: {
      order_status: "pending" | "confirmed" | "delivered" | "cancelled"
      post_type: "oportunidade" | "servico"
      user_role: "ADMIN" | "FATURISTA" | "VENDEDOR"
      user_type: "profissional" | "empresario"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: ["pending", "confirmed", "delivered", "cancelled"],
      post_type: ["oportunidade", "servico"],
      user_role: ["ADMIN", "FATURISTA", "VENDEDOR"],
      user_type: ["profissional", "empresario"],
    },
  },
} as const
