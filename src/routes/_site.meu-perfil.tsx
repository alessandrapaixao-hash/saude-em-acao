import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessao } from "@/hooks/use-sessao";
import { EntrarComGoogle } from "@/components/EntrarComGoogle";
import { carregarPerfil, listarCuidados } from "@/lib/diario";
import { NIVEIS, formatarDia, nivelDe, proximoNivel } from "@/lib/pontos";

export const Route = createFileRoute("/_site/meu-perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — minha jornada no Saúde em Ação" },
      { name: "description", content: "Acompanhe seus pontos, sequência de dias, índice médio de cuidado, conquistas e histórico do diário." },
      { property: "og:title", content: "Minha jornada — Saúde em Ação" },
      { property: "og:description", content: "Pontos, níveis, conquistas e histórico do seu diário alimentar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { usuario, carregando } = useSessao();

  const cuidados = useQuery({ queryKey: ["cuidados"], queryFn: listarCuidados });
  const perfil = useQuery({
    queryKey: ["perfil", usuario?.id, cuidados.data?.length],
    queryFn: () => carregarPerfil(cuidados.data?.length ?? 0),
    enabled: !!usuario && !!cuidados.data,
  });
  const conquistas = useQuery({
    queryKey: ["conquistas"],
    queryFn: async () => {
      const { data } = await supabase.from("conquistas").select("*").order("ordem");
      return data ?? [];
    },
  });

  const pontosTotais = perfil.data?.pontosTotais ?? 0;
  const nivel = nivelDe(pontosTotais);
  const proximo = proximoNivel(pontosTotais);

  const desbloqueadas = useMemo(() => {
    const p = perfil.data;
    if (!p) return new Set<string>();
    const s = new Set<string>();
    if (p.refeicoesRegistradas > 0) s.add("primeiro-registro");
    if (p.diasRegistrados.length > 0) s.add("primeiro-dia");
    if (p.sequencia >= 3) s.add("sequencia-3");
    if (p.sequencia >= 7) s.add("sequencia-7");
    if (p.pontosTotais >= 100) s.add("cuidador-atento");
    if (p.pontosTotais >= 250) s.add("guardiao-alimentacao");
    if (p.pontosTotais >= 500) s.add("guardiao-prato");
    if (p.cuidadosRealizados >= 50) s.add("cuidados-50");
    return s;
  }, [perfil.data]);

  if (carregando) return <p className="text-center text-sm text-muted-foreground py-24">Carregando…</p>;

  if (!usuario) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Meu Perfil</h1>
          <p className="mt-4 text-foreground/75">Entre para ver sua jornada, seus pontos e suas conquistas.</p>
        </div>
        <EntrarComGoogle titulo="Sua jornada fica guardada aqui" />
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">Minha jornada</span>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary">
          {nivel.emoji} {nivel.nome}
        </h1>
        <p className="mt-2 text-foreground/75 text-sm">
          {usuario.user_metadata?.["full_name"] ?? usuario.email}
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center">
        <div className="font-display text-4xl font-bold text-primary">🌱 {pontosTotais}</div>
        <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground mt-1">Pontos Saúde em Ação</div>
        {proximo && (
          <p className="mt-3 text-sm text-foreground/75">
            Faltam {proximo.min - pontosTotais} pontos para {proximo.emoji} {proximo.nome}.
          </p>
        )}
      </div>

      <div className="mt-4 grid sm:grid-cols-4 gap-3">
        <Metrica titulo="Sequência" valor={`${perfil.data?.sequencia ?? 0} dias`} />
        <Metrica titulo="Índice médio" valor={perfil.data?.indiceMedio === null || perfil.data === undefined ? "—" : `${perfil.data.indiceMedio}/100`} />
        <Metrica titulo="Refeições" valor={`${perfil.data?.refeicoesRegistradas ?? 0}`} />
        <Metrica titulo="Cuidados" valor={`${perfil.data?.cuidadosRealizados ?? 0}`} />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold text-primary">Níveis</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          {NIVEIS.map((n) => {
            const ativo = n.nome === nivel.nome;
            return (
              <div
                key={n.nome}
                className={`rounded-2xl border p-4 ${ativo ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <div className="font-semibold">
                  {n.emoji} {n.nome}
                </div>
                <div className="text-xs text-muted-foreground">
                  {n.max === Number.POSITIVE_INFINITY ? `${n.min}+ pontos` : `${n.min}–${n.max} pontos`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold text-primary">Conquistas</h2>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(conquistas.data ?? []).map((c) => {
            const ok = desbloqueadas.has(c.slug);
            return (
              <div
                key={c.id}
                className={`rounded-2xl border p-4 text-center ${ok ? "border-primary bg-primary/10" : "border-border bg-card opacity-60"}`}
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-1 text-sm font-semibold">{c.nome}</div>
                <div className="text-xs text-muted-foreground">{c.descricao}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold text-primary">📅 Histórico</h2>
        {perfil.data && perfil.data.diasRegistrados.length > 0 ? (
          <ul className="mt-3 grid sm:grid-cols-2 gap-2">
            {[...perfil.data.diasRegistrados].reverse().map((d) => (
              <li key={d} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                {formatarDia(d)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Seu histórico aparece aqui assim que você registrar o primeiro dia.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/meu-dia" className="rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5">
          Ir para Meu Dia
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="rounded-full border border-border bg-card font-semibold px-6 py-2.5 hover:border-primary transition"
        >
          Sair da conta
        </button>
      </div>
    </section>
  );
}

function Metrica({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{titulo}</div>
      <div className="mt-1 font-display text-xl font-bold text-primary">{valor}</div>
    </div>
  );
}
