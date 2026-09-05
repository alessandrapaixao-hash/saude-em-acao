import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listarAlimentos, listarCuidados, type Alimento } from "@/lib/diario";
import { FichaAlimento, SeloAtencao } from "@/components/FichaAlimento";
import { AVISO_CLASSIFICACAO } from "@/lib/pontos";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/_site/manual")({
  head: () => ({
    meta: [
      { title: "Manual de Alimentos — Saúde em Ação" },
      { name: "description", content: "Consulte cada alimento: nível de atenção, o que você precisa saber, como cuidar melhor e as fontes usadas." },
      { property: "og:title", content: "Manual de Alimentos — Saúde em Ação" },
      { property: "og:description", content: "Fichas de alimentos com nível de atenção orientativo, cuidados e fontes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ManualPage,
});

function ManualPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [aberto, setAberto] = useState<Alimento | null>(null);

  const alimentos = useQuery({ queryKey: ["alimentos"], queryFn: listarAlimentos });
  const cuidados = useQuery({ queryKey: ["cuidados"], queryFn: listarCuidados });

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set((alimentos.data ?? []).map((a) => a.categoria)))],
    [alimentos.data],
  );

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (alimentos.data ?? []).filter(
      (a) =>
        (categoria === "Todos" || a.categoria === categoria) &&
        (termo === "" || a.nome.toLowerCase().includes(termo)),
    );
  }, [alimentos.data, busca, categoria]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">Consulta rápida</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-primary">📖 Manual de Alimentos</h1>
        <p className="mt-4 text-foreground/75">
          Procure um alimento para ver o nível de atenção, o que se sabe sobre ele, como cuidar melhor
          no dia a dia e quais fontes usamos.
        </p>
      </div>

      <div className="mt-8 max-w-xl mx-auto relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar alimento…"
          className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
              c === categoria
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground/80 border-border hover:border-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-center text-muted-foreground max-w-2xl mx-auto">{AVISO_CLASSIFICACAO}</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((a) => (
          <button
            key={a.id}
            onClick={() => setAberto(a)}
            className="text-left bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
          >
            {a.imagem_url && (
              <img src={a.imagem_url} alt={a.nome} loading="lazy" className="w-full h-36 object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-display text-lg font-bold text-primary">
                {a.emoji} {a.nome}
              </h2>
              <div className="mt-2 flex items-center justify-between gap-2">
                <SeloAtencao nivel={a.nivel_atencao} />
                <span className="text-[11px] text-muted-foreground">{a.categoria}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {alimentos.isLoading && <p className="text-center text-sm text-muted-foreground mt-10">Carregando alimentos…</p>}
      {!alimentos.isLoading && lista.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-10">Nenhum alimento encontrado com esse nome.</p>
      )}

      <Dialog open={!!aberto} onOpenChange={(o) => !o && setAberto(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {aberto && <FichaAlimento alimento={aberto} cuidados={cuidados.data ?? []} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
