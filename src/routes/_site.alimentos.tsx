import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { ALIMENTOS, CATEGORIAS, foodImage, metodoLimpeza, type Categoria } from "@/lib/catalogo-alimentos";

export const Route = createFileRoute("/_site/alimentos")({
  head: () => ({
    meta: [
      { title: "Alimentos e defensores agrícolas — Saúde em Ação" },
      { name: "description", content: "60 alimentos brasileiros, os defensores agrícolas mais encontrados e os riscos à saúde — segundo Anvisa, IDEC, INCA, Greenpeace e reportagens." },
      { property: "og:title", content: "Alimentos com mais defensores agrícolas" },
      { property: "og:description", content: "Os principais alimentos contaminados, os defensores agrícolas usados e os riscos." },
      { property: "og:url", content: "/alimentos" },
    ],
    links: [{ rel: "canonical", href: "/alimentos" }],
  }),
  component: AlimentosPage,
});


function AlimentosPage() {
  const [filtro, setFiltro] = useState<"Todos" | Categoria>("Todos");
  const [cardAberto, setCardAberto] = useState<string | null>(null);

  const lista = useMemo(
    () => (filtro === "Todos" ? ALIMENTOS : ALIMENTOS.filter((a) => a.categoria === filtro)),
    [filtro],
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
          Alimentos sob investigação
        </span>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold text-primary">
          O que tem no seu prato?
        </h1>
        <p className="mt-4 text-foreground/75">
          {ALIMENTOS.length} alimentos brasileiros analisados a partir de dados
          da Anvisa (PARA 2024), IDEC, INCA, Greenpeace e reportagens de
          veículos como G1, O Globo, A Pública, Repórter Brasil e Metrópoles.
          Filtre por categoria para encontrar o que você procura.
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIAS.map((c) => {
          const ativo = c === filtro;
          const count = c === "Todos" ? ALIMENTOS.length : ALIMENTOS.filter((a) => a.categoria === c).length;
          return (
            <button
              key={c}
              onClick={() => setFiltro(c)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
                ativo
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-card text-foreground/80 border-border hover:border-primary hover:text-primary"
              }`}
            >
              {c} <span className="opacity-60 ml-1 text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lista.map((a) => {
          const aberto = cardAberto === a.nome;
          const limpeza = metodoLimpeza(a.categoria);

          return (
            <div
              key={a.nome}
              role="button"
              tabIndex={0}
              onClick={() => setCardAberto(aberto ? null : a.nome)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCardAberto(aberto ? null : a.nome);
                }
              }}
              className="group text-left [perspective:1400px] cursor-pointer"
              aria-pressed={aberto}
              aria-label={`Virar card de ${a.nome} para ver o método de limpeza`}
            >
              <article
                className="relative min-h-[44rem] sm:min-h-[46rem] rounded-3xl [transform-style:preserve-3d] transition-transform duration-700"
                style={{ transform: aberto ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div
                  className="absolute inset-0 bg-card border border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition flex flex-col [backface-visibility:hidden]"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ background: `color-mix(in oklab, ${a.cor} 18%, var(--background))` }}
                  >
                    <img
                      src={foodImage(a.nome)}
                      alt={a.nome}
                      loading="lazy"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-foreground/80">
                      {a.categoria}
                    </span>
                    <span className="absolute bottom-3 right-3 text-3xl drop-shadow-lg">
                      {a.emoji}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.cor }}>
                          {a.rank}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-primary mt-1">{a.nome}</h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                        Clique para virar
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase text-foreground/60">
                        Defensores Agrícolas mais usados
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {a.agrotoxicos.map((t) => (
                          <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase text-foreground/60">
                        Riscos para a saúde
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {a.riscos.map((r) => (
                          <li key={r} className="flex gap-2 text-sm text-foreground/80">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-3xl border border-border overflow-y-auto bg-card p-6 flex flex-col [backface-visibility:hidden]"
                  style={{
                    transform: "rotateY(180deg)",
                    background: `linear-gradient(180deg, color-mix(in oklab, ${a.cor} 12%, var(--card)), var(--card))`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.cor }}>
                        Verso do card
                      </div>
                      <h3 className="font-display text-2xl font-bold text-primary mt-1">{a.nome}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/80 text-foreground/70">
                      Clique para voltar
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs font-bold uppercase text-foreground/60">Melhor método de limpeza</div>
                    <p className="mt-2 text-lg font-semibold text-primary">{limpeza.titulo}</p>
                    <ul className="mt-4 space-y-2.5">
                      {limpeza.passos.map((passo) => (
                        <li key={passo} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{passo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-2xl bg-secondary/70 p-4">
                    <div className="text-xs font-bold uppercase text-foreground/60">Importante</div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{limpeza.observacao}</p>
                  </div>

                  <div className="mt-auto pt-5 border-t border-border/70">
                    <div className="text-xs font-bold uppercase text-foreground/60">Fonte do método</div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{limpeza.fonte}</p>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-12 max-w-xl mx-auto">
        Fontes: Anvisa (PARA 2024), IDEC, INCA, Greenpeace, Ministério da Saúde,
        UFMG, UFLA, SciELO e reportagens de G1, O Globo, A Pública, Repórter
        Brasil, Metrópoles, Saúde Abril e UOL. Os dados variam por safra —
        consulte sempre fontes oficiais.
      </p>
    </section>
  );
}
