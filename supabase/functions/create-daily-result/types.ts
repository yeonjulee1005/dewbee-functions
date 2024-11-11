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
      dailyResultList: {
        Row: {
          created_at: string
          currency_id: string | null
          deleted: boolean | null
          id: string
          summary_amount: number | null
          update_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          id?: string
          summary_amount?: number | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          id?: string
          summary_amount?: number | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dailyResultList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dailyResultList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "viewProfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          currency_id: string | null
          deleted: boolean | null
          email: string | null
          end_date_id: string | null
          id: string
          nickname: string | null
          plan_id: string | null
          updated_at: string | null
          weekly_target_amount: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          email?: string | null
          end_date_id?: string | null
          id?: string
          nickname?: string | null
          plan_id?: string | null
          updated_at?: string | null
          weekly_target_amount?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          email?: string | null
          end_date_id?: string | null
          id?: string
          nickname?: string | null
          plan_id?: string | null
          updated_at?: string | null
          weekly_target_amount?: number | null
        }
        Relationships: []
      }
      spendList: {
        Row: {
          amount: number | null
          created_at: string
          currency_id: string | null
          deleted: boolean | null
          id: string
          spend_category_id: string | null
          update_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          id?: string
          spend_category_id?: string | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          id?: string
          spend_category_id?: string | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spendList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spendList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "viewProfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weeklyResultList: {
        Row: {
          created_at: string
          currency_id: string | null
          deleted: boolean | null
          end_date_id: string | null
          id: string
          is_success: boolean | null
          summary_amount: number | null
          update_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          end_date_id?: string | null
          id?: string
          is_success?: boolean | null
          summary_amount?: number | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          currency_id?: string | null
          deleted?: boolean | null
          end_date_id?: string | null
          id?: string
          is_success?: boolean | null
          summary_amount?: number | null
          update_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weeklyResultList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weeklyResultList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "viewProfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      viewProfiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          currency: Json | null
          currency_id: string | null
          deleted: boolean | null
          email: string | null
          end_date_id: string | null
          endDate: Json | null
          id: string | null
          nickname: string | null
          plan: Json | null
          plan_id: string | null
          updated_at: string | null
          weekly_target_amount: number | null
        }
        Relationships: []
      }
      viewSpendList: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: Json | null
          currency_id: string | null
          deleted: boolean | null
          id: string | null
          spend_category_id: string | null
          spendCategory: Json | null
          update_user_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spendList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spendList_update_user_id_fkey"
            columns: ["update_user_id"]
            isOneToOne: false
            referencedRelation: "viewProfiles"
            referencedColumns: ["id"]
          },
        ]
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
