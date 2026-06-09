import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/criancas")({
  head: () => ({
    meta: [
      { title: "Crianças — Saúde em Ação" },
      { name: "description", content: "Página infantil com trailer da minissérie e espaço reservado para os próximos episódios." },
      { property: "og:title", content: "Crianças — Saúde em Ação" },
      { property: "og:description", content: "Assista ao trailer da minissérie e acompanhe os próximos episódios." },
      { property: "og:url", content: "/criancas" },
    ],
    links: [{ rel: "canonical", href: "/criancas" }],
  }),
  component: CriancasPage,
});

const TRAILER_URL = "";

const episodios = [
  "Episódio 1 — em breve",
  "Episódio 2 — em breve",
  "Episódio 3 — em breve",
  "Episódio 4 — em breve",
];

function CriancasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
          <span style={{ color: "var(--tomato)" }}>Cantinho</span>{" "}
          <span style={{ color: "var(--sun)" }}>das</span>{" "}
          <span style={{ color: "var(--leaf)" }}>Crianças</span>
        </h1>
      </header>

      <div className="mt-10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Trailer da minissérie:
        </h2>

        <div className="mt-6 w-full max-w-4xl rounded-3xl border border-border bg-card shadow-lg overflow-hidden">
          {TRAILER_URL ? (
            <video
              controls
              preload="metadata"
              className="w-full aspect-video bg-secondary"
            >
              <source src={TRAILER_URL} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          ) : (
            <div className="aspect-video w-full bg-secondary flex items-center justify-center px-6 text-center text-foreground/70">
              Assim que você anexar o vídeo, ele ficará em destaque aqui no topo da página.
            </div>
          )}
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Próximos episódios</h2>
          <span className="text-sm text-foreground/60">Espaço reservado para os vídeos que serão anexados depois</span>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {episodios.map((episodio, index) => (
            <article
              key={episodio}
              className="rounded-2xl border border-dashed border-border bg-card/70 p-6 min-h-40 flex flex-col justify-between"
            >
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: index % 4 === 0 ? "var(--tomato)" : index % 4 === 1 ? "var(--sun)" : index % 4 === 2 ? "var(--leaf)" : "var(--berry)" }}
                >
                  Em preparação
                </div>
                <h3 className="mt-2 text-xl font-bold text-foreground">{episodio}</h3>
              </div>
              <div className="mt-6 aspect-video rounded-xl bg-secondary flex items-center justify-center text-sm text-foreground/55">
                Vídeo será adicionado aqui
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}