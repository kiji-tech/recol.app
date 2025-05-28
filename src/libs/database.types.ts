export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      message: {
        Row: {
          created_at: string
          is_view: string[] | null
          message: string | null
          plan_id: string | null
          sender_id: string | null
          uid: string
        }
        Insert: {
          created_at?: string
          is_view?: string[] | null
          message?: string | null
          plan_id?: string | null
          sender_id?: string | null
          uid?: string
        }
        Update: {
          created_at?: string
          is_view?: string[] | null
          message?: string | null
          plan_id?: string | null
          sender_id?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["uid"]
          },
        ]
      }
      plan: {
        Row: {
          created_at: string
          delete_flag: boolean | null
          from: string | null
          locations: string[] | null
          memo: string | null
          place_id_list: string[] | null
          title: string | null
          to: string | null
          uid: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delete_flag?: boolean | null
          from?: string | null
          locations?: string[] | null
          memo?: string | null
          place_id_list?: string[] | null
          title?: string | null
          to?: string | null
          uid?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delete_flag?: boolean | null
          from?: string | null
          locations?: string[] | null
          memo?: string | null
          place_id_list?: string[] | null
          title?: string | null
          to?: string | null
          uid?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          uid: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          uid?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule: {
        Row: {
          category: Database["public"]["Enums"]["schedule_category"] | null
          created_at: string
          delete_flag: boolean | null
          description: string | null
          from: string | null
          place_list: Json[] | null
          plan_id: string | null
          title: string | null
          to: string | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["schedule_category"] | null
          created_at?: string
          delete_flag?: boolean | null
          description?: string | null
          from?: string | null
          place_list?: Json[] | null
          plan_id?: string | null
          title?: string | null
          to?: string | null
          uid?: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["schedule_category"] | null
          created_at?: string
          delete_flag?: boolean | null
          description?: string | null
          from?: string | null
          place_list?: Json[] | null
          plan_id?: string | null
          title?: string | null
          to?: string | null
          uid?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["uid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      schedule_category: "movement" | "meals" | "sightseeing" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      schedule_category: ["movement", "meals", "sightseeing", "other"],
    },
  },
} as const

