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
      media: {
        Row: {
          created_at: string
          delete_flag: boolean | null
          plan_id: string | null
          uid: string
          upload_user_id: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          delete_flag?: boolean | null
          plan_id?: string | null
          uid?: string
          upload_user_id?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          delete_flag?: boolean | null
          plan_id?: string | null
          uid?: string
          upload_user_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["uid"]
          },
        ]
      }
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
        Relationships: []
      }
      plan: {
        Row: {
          created_at: string
          delete_flag: boolean | null
          member_id: string[] | null
          memo: string | null
          title: string | null
          uid: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delete_flag?: boolean | null
          member_id?: string[] | null
          memo?: string | null
          title?: string | null
          uid?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delete_flag?: boolean | null
          member_id?: string[] | null
          memo?: string | null
          title?: string | null
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
          delete_flag: boolean | null
          display_name: string | null
          enabled_schedule_notification: boolean | null
          notification_token: string | null
          payment_end_at: string | null
          payment_plan: Database["public"]["Enums"]["PaymentPlan"] | null
          role: Database["public"]["Enums"]["Role"] | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          delete_flag?: boolean | null
          display_name?: string | null
          enabled_schedule_notification?: boolean | null
          notification_token?: string | null
          payment_end_at?: string | null
          payment_plan?: Database["public"]["Enums"]["PaymentPlan"] | null
          role?: Database["public"]["Enums"]["Role"] | null
          uid: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          delete_flag?: boolean | null
          display_name?: string | null
          enabled_schedule_notification?: boolean | null
          notification_token?: string | null
          payment_end_at?: string | null
          payment_plan?: Database["public"]["Enums"]["PaymentPlan"] | null
          role?: Database["public"]["Enums"]["Role"] | null
          uid?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule: {
        Row: {
          category: Database["public"]["Enums"]["ScheduleCategory"] | null
          created_at: string
          delete_flag: boolean | null
          description: string | null
          from: string | null
          place_list: string[] | null
          plan_id: string | null
          title: string | null
          to: string | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["ScheduleCategory"] | null
          created_at?: string
          delete_flag?: boolean | null
          description?: string | null
          from?: string | null
          place_list?: string[] | null
          plan_id?: string | null
          title?: string | null
          to?: string | null
          uid?: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["ScheduleCategory"] | null
          created_at?: string
          delete_flag?: boolean | null
          description?: string | null
          from?: string | null
          place_list?: string[] | null
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
      subscription: {
        Row: {
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string
          end_at: string | null
          invoice_id: string
          price_id: string
          start_at: string | null
          status: string | null
          trial_end: string | null
          trial_start: string | null
          uid: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id: string
          end_at?: string | null
          invoice_id: string
          price_id: string
          start_at?: string | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          uid: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string
          end_at?: string | null
          invoice_id?: string
          price_id?: string
          start_at?: string | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          uid?: string
          updated_at?: string | null
          user_id?: string | null
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
      PaymentPlan: "Free" | "Basic" | "Premium"
      Role: "Admin" | "SuperUser" | "User"
      schedule_category: "movement" | "meals" | "sightseeing" | "other"
      ScheduleCategory:
        | "Movement"
        | "Shopping"
        | "Cafe"
        | "Meals"
        | "amusement"
        | "Other"
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
      PaymentPlan: ["Free", "Basic", "Premium"],
      Role: ["Admin", "SuperUser", "User"],
      schedule_category: ["movement", "meals", "sightseeing", "other"],
      ScheduleCategory: [
        "Movement",
        "Shopping",
        "Cafe",
        "Meals",
        "amusement",
        "Other",
      ],
    },
  },
} as const

