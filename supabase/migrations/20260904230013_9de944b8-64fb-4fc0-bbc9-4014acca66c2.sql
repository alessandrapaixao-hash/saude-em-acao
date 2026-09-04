-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.papeis_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.papeis_usuario TO authenticated;
GRANT ALL ON public.papeis_usuario TO service_role;
ALTER TABLE public.papeis_usuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver proprios papeis" ON public.papeis_usuario FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.papeis_usuario WHERE user_id = _user_id AND role = _role)
$$;

-- PERFIS
CREATE TABLE public.perfis (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfil proprio select" ON public.perfis FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "perfil proprio insert" ON public.perfis FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "perfil proprio update" ON public.perfis FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- CATALOGO DE ALIMENTOS (publico)
CREATE TABLE public.alimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  categoria text NOT NULL,
  emoji text,
  imagem_url text,
  nivel_atencao text NOT NULL DEFAULT 'moderado',
  descricao text,
  defensivos text[] NOT NULL DEFAULT '{}',
  riscos text[] NOT NULL DEFAULT '{}',
  saiba_mais text,
  cuidados_texto text,
  fontes text[] NOT NULL DEFAULT '{}',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.alimentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alimentos TO authenticated;
GRANT ALL ON public.alimentos TO service_role;
ALTER TABLE public.alimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alimentos publicos" ON public.alimentos FOR SELECT USING (ativo);
CREATE POLICY "admin gerencia alimentos" ON public.alimentos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ACOES DE CUIDADO (publico)
CREATE TABLE public.cuidados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text,
  pontos int NOT NULL DEFAULT 5,
  aplicabilidade text[] NOT NULL DEFAULT '{}',
  ordem int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.cuidados TO anon;
GRANT SELECT ON public.cuidados TO authenticated;
GRANT ALL ON public.cuidados TO service_role;
ALTER TABLE public.cuidados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cuidados publicos" ON public.cuidados FOR SELECT USING (ativo);
CREATE POLICY "admin gerencia cuidados" ON public.cuidados FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- REFEICOES
CREATE TABLE public.refeicoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dia date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
  tipo text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, dia, tipo)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.refeicoes TO authenticated;
GRANT ALL ON public.refeicoes TO service_role;
ALTER TABLE public.refeicoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "refeicoes proprias" ON public.refeicoes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ALIMENTOS CONSUMIDOS
CREATE TABLE public.alimentos_consumidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refeicao_id uuid NOT NULL REFERENCES public.refeicoes(id) ON DELETE CASCADE,
  alimento_id uuid NOT NULL REFERENCES public.alimentos(id) ON DELETE RESTRICT,
  quantidade text,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_alimentos_consumidos_refeicao ON public.alimentos_consumidos(refeicao_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alimentos_consumidos TO authenticated;
GRANT ALL ON public.alimentos_consumidos TO service_role;
ALTER TABLE public.alimentos_consumidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consumo proprio" ON public.alimentos_consumidos FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CUIDADOS REALIZADOS
CREATE TABLE public.cuidados_realizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consumo_id uuid NOT NULL REFERENCES public.alimentos_consumidos(id) ON DELETE CASCADE,
  cuidado_id uuid NOT NULL REFERENCES public.cuidados(id) ON DELETE CASCADE,
  dia date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (consumo_id, cuidado_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cuidados_realizados TO authenticated;
GRANT ALL ON public.cuidados_realizados TO service_role;
ALTER TABLE public.cuidados_realizados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cuidados proprios" ON public.cuidados_realizados FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PONTOS
CREATE TABLE public.pontos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantidade int NOT NULL,
  motivo text NOT NULL,
  chave text NOT NULL,
  dia date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
  refeicao_id uuid REFERENCES public.refeicoes(id) ON DELETE SET NULL,
  consumo_id uuid REFERENCES public.alimentos_consumidos(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, chave)
);
CREATE INDEX idx_pontos_user_dia ON public.pontos(user_id, dia);
GRANT SELECT, INSERT, DELETE ON public.pontos TO authenticated;
GRANT ALL ON public.pontos TO service_role;
ALTER TABLE public.pontos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pontos proprios" ON public.pontos FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CONQUISTAS
CREATE TABLE public.conquistas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text,
  emoji text,
  ordem int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.conquistas TO anon;
GRANT SELECT ON public.conquistas TO authenticated;
GRANT ALL ON public.conquistas TO service_role;
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conquistas publicas" ON public.conquistas FOR SELECT USING (true);

CREATE TABLE public.conquistas_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conquista_id uuid NOT NULL REFERENCES public.conquistas(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, conquista_id)
);
GRANT SELECT, INSERT ON public.conquistas_usuario TO authenticated;
GRANT ALL ON public.conquistas_usuario TO service_role;
ALTER TABLE public.conquistas_usuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conquistas proprias" ON public.conquistas_usuario FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);