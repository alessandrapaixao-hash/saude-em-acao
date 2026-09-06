import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useSessao } from "@/hooks/use-sessao";
import { EntrarComGoogle } from "@/components/EntrarComGoogle";
import { FichaAlimento, SeloAtencao } from "@/components/FichaAlimento";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  adicionarAlimento,
  carregarDia,
  definirStatus,
  listarAlimentos,
  listarCuidados,
  pontosDoDia,
  removerConsumo,
  salvarCuidados,
  type Consumo,
  type Refeicao,
} from "@/lib/diario";
import { calcularIndice, faixaIndice, formatarDia, hojeISO, type TipoRefeicao } from "@/lib/pontos";

export const Route = createFileRoute("/_site/meu-dia")({
  head: () => ({
    meta: [
      { title: "Meu Dia — diário alimentar do Saúde em Ação" },
      { name: "description", content: "Registre suas refeições do dia, veja os cuidados de cada alimento e acompanhe seu Índice de Cuidado." },
      { property: "og:title", content: "Meu Dia — Saúde em Ação" },
      { property: "og:description", content: "Seu diário alimentar com cuidados e pontos, do seu jeito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MeuDiaPage,
});

function MeuDiaPage() {
  const { usuario, carregando } = useSessao();
  const [dia, setDia] = useState(hojeISO());
  const qc = useQueryClient();

  const alimentos = useQuery({ queryKey: ["alimentos"], queryFn: listarAlimentos });
  const cuidados = useQuery({ queryKey: ["cuidados"], queryFn: listarCuidados });
  const refeicoes = useQuery({
    queryKey: ["dia", dia, usuario?.id],
    queryFn: () => carregarDia(dia),
    enabled: !!usuario,
  });
  const pontos = useQuery({
    queryKey: ["pontos-dia", dia, usuario?.id],
    queryFn: () => pontosDoDia(dia),
    enabled: !!usuario,
  });

  const [escolhendo, setEscolhendo] = useState<TipoRefeicao | null>(null);
  const [fichaAberta, setFichaAberta] = useState<{ consumo: Consumo } | null>(null);

  function recarregar() {
    qc.invalidateQueries({ queryKey: ["dia"] });
    qc.invalidateQueries({ queryKey: ["pontos-dia"] });
  }

  if (carregando) {
    return <p className="text-center text-sm text-muted-foreground py-24">Carregando…</p>;
  }

  if (!usuario) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Meu Dia</h1>
          <p className="mt-4 text-foreground/75">
            Um diário simples para registrar o que você comeu, conhecer melhor cada alimento e
            acompanhar os cuidados que você já faz.
          </p>
        </div>
        <EntrarComGoogle />
      </section>
    );
  }

  const lista = refeicoes.data ?? [];
  const totalConsumos = lista.reduce((t, r) => t + r.consumos.length, 0);
  const totalCuidados = lista.reduce((t, r) => t + r.consumos.reduce((s, c) => s + c.cuidados.length, 0), 0);
  const indice = calcularIndice(totalCuidados, totalConsumos, cuidados.data?.length ?? 0);
  const decididas = lista.filter((r) => r.status !== "pendente").length;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">Seu diário</span>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary">Meu Dia</h1>
        <p className="mt-3 text-foreground/75 text-sm">{formatarDia(dia)}</p>
        <input
          type="date"
          value={dia}
          max={hojeISO()}
          onChange={(e) => setDia(e.target.value)}
          className="mt-3 rounded-full border border-border bg-card px-4 py-2 text-sm"
        />
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <Cartao titulo="Pontos de hoje" valor={`🌱 ${pontos.data ?? 0}`} />
        <Cartao titulo="Refeições organizadas" valor={`${decididas}/${lista.length}`} />
        <Cartao titulo="Índice de Cuidado" valor={indice === null ? "—" : `${faixaIndice(indice).emoji} ${indice}/100`} />
      </div>

      <div className="mt-8 space-y-4">
        {lista.map((r) => (
          <CardRefeicao
            key={r.tipo}
            refeicao={r}
            onAdicionar={() => setEscolhendo(r.tipo)}
            onNaoFaco={async () => {
              await definirStatus(usuario.id, dia, r.tipo, r.status === "nao-faco" ? "pendente" : "nao-faco");
              recarregar();
            }}
            onAbrirFicha={(consumo) => setFichaAberta({ consumo })}
            onRemover={async (consumoId) => {
              await removerConsumo(consumoId);
              recarregar();
              toast("Alimento removido.");
            }}
          />
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-primary">🌟 Resumo do dia</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Você registrou {totalConsumos} {totalConsumos === 1 ? "alimento" : "alimentos"} e {totalCuidados}{" "}
          {totalCuidados === 1 ? "cuidado" : "cuidados"} em {decididas} de {lista.length} refeições.
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          {indice === null
            ? "Quando quiser, registre um alimento para começar. Não existe dia certo ou errado por aqui."
            : faixaIndice(indice).mensagem}
        </p>
        <Link
          to="/meu-perfil"
          className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5 hover:opacity-90 transition"
        >
          Ver minha jornada
        </Link>
      </div>

      {/* Escolher alimento */}
      <Dialog open={!!escolhendo} onOpenChange={(o) => !o && setEscolhendo(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <SeletorAlimentos
            alimentos={alimentos.data ?? []}
            onEscolher={async (alimentoId) => {
              if (!escolhendo) return;
              await adicionarAlimento(usuario.id, dia, escolhendo, alimentoId);
              recarregar();
              toast.success("Alimento registrado 🌱 +2 pontos");
            }}
            onFechar={() => setEscolhendo(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Ficha do alimento + checklist */}
      <Dialog open={!!fichaAberta} onOpenChange={(o) => !o && setFichaAberta(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {fichaAberta && (
            <FichaAlimento
              alimento={fichaAberta.consumo.alimento}
              cuidados={cuidados.data ?? []}
              selecionados={fichaAberta.consumo.cuidados}
              onSalvar={async (ids) => {
                const todos = cuidados.data ?? [];
                await salvarCuidados(
                  usuario.id,
                  dia,
                  fichaAberta.consumo.id,
                  todos.filter((c) => ids.includes(c.id)),
                  todos,
                );
                recarregar();
                setFichaAberta(null);
                toast.success("Cuidados salvos. Obrigado por cuidar de você 🌱");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Cartao({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{titulo}</div>
      <div className="mt-1 font-display text-2xl font-bold text-primary">{valor}</div>
    </div>
  );
}

function CardRefeicao({
  refeicao,
  onAdicionar,
  onNaoFaco,
  onAbrirFicha,
  onRemover,
}: {
  refeicao: Refeicao;
  onAdicionar: () => void;
  onNaoFaco: () => void;
  onAbrirFicha: (c: Consumo) => void;
  onRemover: (id: string) => void;
}) {
  const naoFaco = refeicao.status === "nao-faco";

  return (
    <article className={`rounded-3xl border p-5 transition ${naoFaco ? "border-border bg-secondary/40" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{refeicao.icone}</span>
          <div>
            <h2 className="font-display text-xl font-bold text-primary">{refeicao.nome}</h2>
            <p className="text-xs text-muted-foreground">
              {naoFaco
                ? "Você marcou que não faz essa refeição — tudo bem, dá para mudar quando quiser."
                : refeicao.consumos.length > 0
                  ? `${refeicao.consumos.length} ${refeicao.consumos.length === 1 ? "alimento" : "alimentos"} registrados`
                  : "Ainda sem registro"}
            </p>
          </div>
        </div>
      </div>

      {!naoFaco && refeicao.consumos.length > 0 && (
        <ul className="mt-4 space-y-2">
          {refeicao.consumos.map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3">
              {c.alimento.imagem_url && (
                <img src={c.alimento.imagem_url} alt={c.alimento.nome} className="w-12 h-12 rounded-xl object-cover" />
              )}
              <button onClick={() => onAbrirFicha(c)} className="text-left flex-1">
                <span className="block font-semibold text-sm">
                  {c.alimento.emoji} {c.alimento.nome}
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <SeloAtencao nivel={c.alimento.nivel_atencao} />
                  <span className="text-[11px] text-muted-foreground">
                    {c.cuidados.length} {c.cuidados.length === 1 ? "cuidado" : "cuidados"}
                  </span>
                </span>
              </button>
              <button
                onClick={() => onRemover(c.id)}
                aria-label={`Remover ${c.alimento.nome}`}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!naoFaco && (
          <button
            onClick={onAdicionar}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> Adicionar alimento
          </button>
        )}
        <button
          onClick={onNaoFaco}
          className="rounded-full border border-border bg-card text-sm font-semibold px-4 py-2 hover:border-primary transition"
        >
          {naoFaco ? "Quero registrar essa refeição" : "Não faço essa refeição"}
        </button>
      </div>
    </article>
  );
}

function SeletorAlimentos({
  alimentos,
  onEscolher,
  onFechar,
}: {
  alimentos: { id: string; nome: string; emoji: string | null; categoria: string; imagem_url: string | null; nivel_atencao: string }[];
  onEscolher: (id: string) => Promise<void>;
  onFechar: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(alimentos.map((a) => a.categoria)))],
    [alimentos],
  );

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return alimentos.filter(
      (a) => (categoria === "Todos" || a.categoria === categoria) && (termo === "" || a.nome.toLowerCase().includes(termo)),
    );
  }, [alimentos, busca, categoria]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-primary">Adicionar alimento</h3>
        <button onClick={onFechar} aria-label="Fechar" className="p-2 rounded-lg hover:bg-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar alimento…"
          className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              c === categoria ? "bg-primary text-primary-foreground border-primary" : "border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {lista.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => onEscolher(a.id)}
              className="w-full flex items-center gap-3 rounded-2xl border border-border p-2.5 hover:border-primary transition text-left"
            >
              {a.imagem_url && <img src={a.imagem_url} alt={a.nome} className="w-11 h-11 rounded-xl object-cover" />}
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  {a.emoji} {a.nome}
                </span>
                <span className="text-[11px] text-muted-foreground">{a.categoria}</span>
              </span>
              <SeloAtencao nivel={a.nivel_atencao} />
            </button>
          </li>
        ))}
        {lista.length === 0 && (
          <li className="text-sm text-muted-foreground text-center py-6">Nenhum alimento encontrado.</li>
        )}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground text-center">
        Você pode adicionar quantos alimentos quiser nessa refeição.
      </p>
    </div>
  );
}
