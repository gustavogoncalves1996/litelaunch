// Mirrors supabase/migrations. After changing the schema, regenerate with:
// pnpm dlx supabase gen types typescript --project-id <project-ref> > src/types/database.ts

export type Database = {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          created_at: string;
          customer_id: string;
          ends_at: string | null;
          id: string;
          renews_at: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at: string | null;
          updated_at: string;
          user_id: string;
          variant_id: string;
          variant_name: string;
        };
        Insert: {
          created_at?: string;
          customer_id: string;
          ends_at?: string | null;
          id: string;
          renews_at?: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          updated_at?: string;
          user_id: string;
          variant_id: string;
          variant_name: string;
        };
        Update: {
          created_at?: string;
          customer_id?: string;
          ends_at?: string | null;
          id?: string;
          renews_at?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          updated_at?: string;
          user_id?: string;
          variant_id?: string;
          variant_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          image_url: string | null;
          locale: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          image_url?: string | null;
          locale?: string;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          image_url?: string | null;
          locale?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_status:
        | "on_trial"
        | "active"
        | "paused"
        | "past_due"
        | "unpaid"
        | "cancelled"
        | "expired";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Subscription =
  Database["public"]["Tables"]["subscriptions"]["Row"];
export type SubscriptionStatus =
  Database["public"]["Enums"]["subscription_status"];
