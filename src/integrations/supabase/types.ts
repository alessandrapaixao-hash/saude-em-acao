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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alimentos: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          cuidados_texto: string | null
          defensivos: string[]
          descricao: string | null
          emoji: string | null
          fontes: string[]
          id: string
          imagem_url: string | null
          nivel_atencao: string
          nome: string
          riscos: string[]
          saiba_mais: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          cuidados_texto?: string | null
          defensivos?: string[]
          descricao?: string | null
          emoji?: string | null
          fontes?: string[]
          id?: string
          imagem_url?: string | null
          nivel_atencao?: string
          nome: string
          riscos?: string[]
          saiba_mais?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          cuidados_texto?: string | null
          defensivos?: string[]
          descricao?: string | null
          emoji?: string | null
          fontes?: string[]
          id?: string
          imagem_url?: string | null
          nivel_atencao?: string
          nome?: string
          riscos?: string[]
          saiba_mais?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      alimentos_consumidos: {
        Row: {
          alimento_id: string
          created_at: string
          id: string
          observacoes: string | null
          quantidade: string | null
          refeicao_id: string
          user_id: string
        }
        Insert: {
          alimento_id: string
          created_at?: string
          id?: string
          observacoes?: string | null
          quantidade?: string | null
          refeicao_id: string
          user_id: string
        }
        Update: {
          alimento_id?: string
          created_at?: string
          id?: string
          observacoes?: string | null
          quantidade?: string | null
          refeicao_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alimentos_consumidos_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alimentos_consumidos_refeicao_id_fkey"
            columns: ["refeicao_id"]
            isOneToOne: false
            referencedRelation: "refeicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      conquistas: {
        Row: {
          descricao: string | null
          emoji: string | null
          id: string
          nome: string
          ordem: number
          slug: string
        }
        Insert: {
          descricao?: string | null
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
        }
        Update: {
          descricao?: string | null
          emoji?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
        }
        Relationships: []
      }
      conquistas_usuario: {
        Row: {
          conquista_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          conquista_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          conquista_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conquistas_usuario_conquista_id_fkey"
            columns: ["conquista_id"]
            isOneToOne: false
            referencedRelation: "conquistas"
            referencedColumns: ["id"]
          },
        ]
      }
      cuidados: {
        Row: {
          aplicabilidade: string[]
          ativo: boolean
          descricao: string | null
          id: string
          nome: string
          ordem: number
          pontos: number
          slug: string
        }
        Insert: {
          aplicabilidade?: string[]
          ativo?: boolean
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number
          pontos?: number
          slug: string
        }
        Update: {
          aplicabilidade?: string[]
          ativo?: boolean
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          pontos?: number
          slug?: string
        }
        Relationships: []
      }
      cuidados_realizados: {
        Row: {
          consumo_id: string
          created_at: string
          cuidado_id: string
          dia: string
          id: string
          user_id: string
        }
        Insert: {
          consumo_id: string
          created_at?: string
          cuidado_id: string
          dia?: string
          id?: string
          user_id: string
        }
        Update: {
          consumo_id?: string
          created_at?: string
          cuidado_id?: string
          dia?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuidados_realizados_consumo_id_fkey"
            columns: ["consumo_id"]
            isOneToOne: false
            referencedRelation: "alimentos_consumidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuidados_realizados_cuidado_id_fkey"
            columns: ["cuidado_id"]
            isOneToOne: false
            referencedRelation: "cuidados"
            referencedColumns: ["id"]
          },
        ]
      }
      papeis_usuario: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pontos: {
        Row: {
          chave: string
          consumo_id: string | null
          created_at: string
          dia: string
          id: string
          motivo: string
          quantidade: number
          refeicao_id: string | null
          user_id: string
        }
        Insert: {
          chave: string
          consumo_id?: string | null
          created_at?: string
          dia?: string
          id?: string
          motivo: string
          quantidade: number
          refeicao_id?: string | null
          user_id: string
        }
        Update: {
          chave?: string
          consumo_id?: string | null
          created_at?: string
          dia?: string
          id?: string
          motivo?: string
          quantidade?: number
          refeicao_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pontos_consumo_id_fkey"
            columns: ["consumo_id"]
            isOneToOne: false
            referencedRelation: "alimentos_consumidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pontos_refeicao_id_fkey"
            columns: ["refeicao_id"]
            isOneToOne: false
            referencedRelation: "refeicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      refeicoes: {
        Row: {
          created_at: string
          dia: string
          id: string
          status: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dia?: string
          id?: string
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dia?: string
          id?: string
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
