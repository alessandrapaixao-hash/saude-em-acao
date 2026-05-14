import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";

export const Route = createFileRoute("/_site/jogo")({
  head: () => ({
    meta: [
      { title: "Caça ao alimento limpo — Jogo Saúde em Ação" },
      { name: "description", content: "Jogo educativo: clique apenas nos alimentos orgânicos e evite os contaminados." },
      { property: "og:title", content: "Caça ao alimento limpo" },
      { property: "og:description", content: "Teste seus reflexos contra os agrotóxicos." },
      { property: "og:url", content: "/jogo" },
    ],
    links: [{ rel: "canonical", href: "/jogo" }],
  }),
  component: JogoPage,
});

type Item = {
  id: number;
  emoji: string;
  clean: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const CLEAN_FOODS = ["🥦", "🍎", "🥕", "🍇", "🍅", "🥬", "🍓", "🍊", "🥒", "🌽"];
const POISONS = ["☠️", "🧪", "⚠️", "🦟", "🛢️"];

const GAME_TIME = 30;

export default function JogoPage() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);
  const [best, setBest] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // Spawner
  useEffect(() => {
    if (state !== "playing") return;
    const spawn = setInterval(() => {
      setItems((prev) => {
        if (prev.length > 14) return prev;
        const isClean = Math.random() > 0.35;
        const list = isClean ? CLEAN_FOODS : POISONS;
        const emoji = list[Math.floor(Math.random() * list.length)];
        return [
          ...prev,
          {
            id: ++idRef.current,
            emoji,
            clean: isClean,
            x: Math.random() * 85 + 5,
            y: Math.random() * 80 + 10,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
          },
        ];
      });
    }, 700);
    return () => clearInterval(spawn);
  }, [state]);

  // Movement + lifetime
  useEffect(() => {
    if (state !== "playing") return;
    const tick = setInterval(() => {
      setItems((prev) =>
        prev
          .map((i) => ({
            ...i,
            x: Math.max(2, Math.min(95, i.x + i.vx)),
            y: Math.max(5, Math.min(90, i.y + i.vy)),
          }))
          .slice(-16)
      );
    }, 50);
    return () => clearInterval(tick);
  }, [state]);

  // Timer
  useEffect(() => {
    if (state !== "playing") return;
    if (time <= 0) {
      setState("over");
      setBest((b) => Math.max(b, score));
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [state, time, score]);

  function start() {
    setItems([]);
    setScore(0);
    setTime(GAME_TIME);
    setState("playing");
  }

  function tap(item: Item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setScore((s) => s + (item.clean ? 10 : -15));
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
          Mini-jogo educativo
        </span>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold text-primary">
          Caça ao alimento limpo
        </h1>
        <p className="mt-4 text-foreground/75">
          Clique apenas nos <strong>alimentos orgânicos</strong> 🥦🍎🍓 e
          evite tocar nos símbolos de contaminação ☠️🧪⚠️.
          Você tem <strong>{GAME_TIME} segundos</strong>!
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-sm font-bold">
        <div className="px-4 py-2 rounded-full bg-card border border-border">
          ⏱ {time}s
        </div>
        <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground">
          🏆 {score} pts
        </div>
        <div className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
          Recorde: {best}
        </div>
      </div>

      <div
        ref={areaRef}
        className="relative mt-6 rounded-3xl border-2 border-dashed border-border bg-gradient-to-br from-secondary/40 to-background overflow-hidden select-none"
        style={{ aspectRatio: "16 / 10", minHeight: 400 }}
      >
        {state === "idle" && (
          <Overlay>
            <Trophy className="w-12 h-12 text-[var(--sun)]" />
            <h2 className="text-3xl font-bold text-primary mt-3">Pronto para começar?</h2>
            <p className="text-foreground/70 mt-1 max-w-sm text-center">
              Acerte alimentos orgânicos para ganhar pontos.
              Cada toque em contaminação custa 15 pontos.
            </p>
            <button
              onClick={start}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition"
            >
              <Play className="w-4 h-4" /> Começar
            </button>
          </Overlay>
        )}

        {state === "over" && (
          <Overlay>
            <Trophy className="w-14 h-14 text-[var(--sun)]" />
            <h2 className="text-3xl font-bold text-primary mt-3">Tempo esgotado!</h2>
            <p className="mt-2 text-foreground/80">
              Sua pontuação: <strong className="text-primary text-2xl">{score}</strong>
            </p>
            <button
              onClick={start}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition"
            >
              <RotateCcw className="w-4 h-4" /> Jogar de novo
            </button>
          </Overlay>
        )}

        {state === "playing" &&
          items.map((i) => (
            <button
              key={i.id}
              onClick={() => tap(i)}
              className="absolute text-5xl md:text-6xl drop-shadow-md hover:scale-125 transition-transform cursor-pointer"
              style={{
                left: `${i.x}%`,
                top: `${i.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label={i.clean ? "alimento orgânico" : "contaminação"}
            >
              {i.emoji}
            </button>
          ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        💡 Dica: na vida real, prefira frutas e verduras orgânicas, lave bem
        em água corrente e deixe de molho em solução de bicarbonato por 15min.
      </p>
    </section>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6 text-center">
      {children}
    </div>
  );
}
