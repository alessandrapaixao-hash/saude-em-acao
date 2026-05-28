import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles, Leaf, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_site/jogo")({
  head: () => ({
    meta: [
      { title: "NutriClean — O Jogo · Saúde em Ação" },
      { name: "description", content: "Jogo educativo: descubra se o alimento é campeão de defensores agrícolas ou está entre os mais limpos. Inspirado nos dados da Anvisa." },
      { property: "og:title", content: "NutriClean — O Jogo" },
      { property: "og:description", content: "Aprenda brincando: contaminado ou limpo?" },
      { property: "og:url", content: "/jogo" },
    ],
    links: [{ rel: "canonical", href: "/jogo" }],
  }),
  component: JogoPage,
});

type Item = {
  nome: string;
  emoji: string;
  query: string;
  /** true = contaminado (alto resíduo) | false = relativamente limpo */
  contaminado: boolean;
  fato: string;
};

const RODADA: Item[] = [
  { nome: "Morango", emoji: "🍓", query: "strawberry", contaminado: true,
    fato: "Campeão de contaminação no PARA/Anvisa — até 4 defensores agrícolas diferentes em uma única amostra." },
  { nome: "Pimentão", emoji: "🫑", query: "bellpepper", contaminado: true,
    fato: "Aparece no topo da lista da Anvisa com substâncias proibidas em outros países, como acefato." },
  { nome: "Abacate", emoji: "🥑", query: "avocado", contaminado: false,
    fato: "A casca grossa protege a polpa — está entre os mais seguros da lista." },
  { nome: "Laranja", emoji: "🍊", query: "orange", contaminado: true,
    fato: "Top da Anvisa 2024: resíduos passam direto para o suco coado em casa." },
  { nome: "Cebola", emoji: "🧅", query: "onion", contaminado: false,
    fato: "Por ter camadas externas que descartamos, a cebola é uma das mais limpas." },
  { nome: "Uva", emoji: "🍇", query: "grape", contaminado: true,
    fato: "Recebe muitas aplicações de fungicidas; resíduos ficam na casca fina." },
  { nome: "Abacaxi", emoji: "🍍", query: "pineapple", contaminado: false,
    fato: "Apesar do uso de defensivos no campo, a casca espessa reduz a exposição na polpa." },
  { nome: "Pepino", emoji: "🥒", query: "cucumber", contaminado: true,
    fato: "Líder no monitoramento Anvisa 2024 — acefato e carbendazim acima do limite." },
  { nome: "Banana", emoji: "🍌", query: "banana", contaminado: false,
    fato: "A casca não comestível atua como barreira — está entre as frutas mais seguras." },
  { nome: "Goiaba", emoji: "🍈", query: "guava", contaminado: true,
    fato: "Reportagem da Agência Pública: campeã em resíduos acima do limite." },
  { nome: "Melancia", emoji: "🍉", query: "watermelon", contaminado: false,
    fato: "Casca grossa protege a polpa; aparece entre as frutas mais limpas da Anvisa." },
  { nome: "Tomate", emoji: "🍅", query: "tomato", contaminado: true,
    fato: "Consumo diário + casca fina = alta exposição cumulativa a fungicidas." },
];

const TOTAL = RODADA.length;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function JogoPage() {
  const [deck, setDeck] = useState<Item[]>(() => shuffle(RODADA));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | { ok: boolean; item: Item }>(null);
  const [done, setDone] = useState(false);

  const current = deck[idx];
  const progresso = useMemo(() => Math.round((idx / TOTAL) * 100), [idx]);

  function escolher(escolha: boolean) {
    if (feedback) return;
    const ok = escolha === current.contaminado;
    setFeedback({ ok, item: current });
    if (ok) setScore((s) => s + 1);
  }

  function proximo() {
    setFeedback(null);
    if (idx + 1 >= TOTAL) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function recomeçar() {
    setDeck(shuffle(RODADA));
    setIdx(0);
    setScore(0);
    setFeedback(null);
    setDone(false);
  }

  return (
    <section className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* decor */}
      <div aria-hidden className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-[var(--leaf)]/15 blur-3xl -z-10" />
      <div aria-hidden className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-[var(--tomato)]/15 blur-3xl -z-10" />

      <header className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
          <Sparkles className="w-3.5 h-3.5" /> NutriClean — O Jogo
        </span>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold text-primary">
          Contaminado ou limpo?
        </h1>
        <p className="mt-4 text-foreground/75">
          Veja o alimento e decida: ele está entre os <strong>campeões de defensores agrícolas</strong> ou
          é um dos <strong>mais limpos</strong> segundo a Anvisa? Aprenda os dados reais a cada rodada.
        </p>
      </header>

      {/* HUD */}
      {!done && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--leaf)] to-[var(--primary)] transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className="text-sm font-bold text-foreground/70 whitespace-nowrap">
            {idx + 1} / {TOTAL}
          </div>
          <div className="text-sm font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground whitespace-nowrap">
            🏆 {score}
          </div>
        </div>
      )}

      {/* Card do alimento */}
      {!done && current && (
        <div className="mt-6 bg-card border border-border rounded-3xl overflow-hidden shadow-lg">
          <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
            <img
              src={`https://loremflickr.com/800/500/${current.query},fresh?lock=${idx + 100}`}
              alt={current.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg">
                {current.nome}
              </h2>
              <span className="text-5xl md:text-6xl drop-shadow-lg">{current.emoji}</span>
            </div>
          </div>

          {!feedback ? (
            <div className="p-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => escolher(false)}
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-[var(--leaf)]/40 bg-[var(--leaf)]/5 hover:bg-[var(--leaf)]/15 hover:border-[var(--leaf)] transition cursor-pointer"
              >
                <Leaf className="w-8 h-8 text-[var(--leaf)] group-hover:scale-110 transition" />
                <span className="font-bold text-foreground">Limpo</span>
                <span className="text-xs text-foreground/60">baixo resíduo</span>
              </button>
              <button
                onClick={() => escolher(true)}
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-[var(--tomato)]/40 bg-[var(--tomato)]/5 hover:bg-[var(--tomato)]/15 hover:border-[var(--tomato)] transition cursor-pointer"
              >
                <AlertTriangle className="w-8 h-8 text-[var(--tomato)] group-hover:scale-110 transition" />
                <span className="font-bold text-foreground">Contaminado</span>
                <span className="text-xs text-foreground/60">campeão Anvisa</span>
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div
                className={`flex items-start gap-3 p-4 rounded-2xl ${
                  feedback.ok
                    ? "bg-[var(--leaf)]/10 border border-[var(--leaf)]/30"
                    : "bg-destructive/10 border border-destructive/30"
                }`}
              >
                {feedback.ok ? (
                  <CheckCircle2 className="w-6 h-6 text-[var(--leaf)] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-foreground">
                    {feedback.ok ? "Certo!" : "Quase!"} O {feedback.item.nome.toLowerCase()} é{" "}
                    <span
                      className={
                        feedback.item.contaminado ? "text-[var(--tomato)]" : "text-[var(--leaf)]"
                      }
                    >
                      {feedback.item.contaminado ? "contaminado" : "relativamente limpo"}
                    </span>
                    .
                  </div>
                  <p className="text-sm text-foreground/75 mt-1">{feedback.item.fato}</p>
                </div>
              </div>
              <button
                onClick={proximo}
                className="mt-4 w-full bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow hover:shadow-lg transition cursor-pointer"
              >
                {idx + 1 >= TOTAL ? "Ver resultado" : "Próximo alimento →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tela final */}
      {done && (
        <div className="mt-10 bg-card border border-border rounded-3xl p-8 md:p-12 text-center shadow-lg">
          <Trophy className="w-16 h-16 text-[var(--sun)] mx-auto" />
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-primary">
            {score === TOTAL
              ? "Especialista NutriClean!"
              : score >= TOTAL * 0.7
                ? "Muito bem!"
                : "Hora de se informar mais"}
          </h2>
          <p className="mt-3 text-foreground/75">
            Você acertou <strong className="text-primary text-2xl">{score}</strong> de {TOTAL} alimentos.
          </p>
          <p className="mt-4 max-w-md mx-auto text-sm text-foreground/70">
            💡 Lembre-se: lavar em água corrente reduz pouco. Prefira orgânicos,
            descasque sempre que possível e diversifique a alimentação para
            reduzir a exposição cumulativa.
          </p>
          <button
            onClick={recomeçar}
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow hover:shadow-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Jogar de novo
          </button>
        </div>
      )}
    </section>
  );
}
