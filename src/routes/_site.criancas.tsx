import { createFileRoute } from "@tanstack/react-router";
import { Brain, Shuffle, Search, Type, Youtube, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/_site/criancas")({
  head: () => ({
    meta: [
      { title: "Área Kids — Saúde em Ação" },
      { name: "description", content: "Área Kids com trailer da minissérie, jogos educativos e acesso ao canal do YouTube." },
      { property: "og:title", content: "Área Kids — Saúde em Ação" },
      { property: "og:description", content: "Trailer da minissérie, jogos interativos e muito mais para as crianças aprenderem brincando." },
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

const jogos = [
  {
    nome: "Jogo da Memória",
    href: "https://learningapps.org/view52003284",
    Icon: Brain,
    gradient: "linear-gradient(135deg, var(--tomato), var(--sun))",
  },
  {
    nome: "Desembaralhe",
    href: "https://wordwall.net/resource/114702835",
    Icon: Shuffle,
    gradient: "linear-gradient(135deg, var(--leaf), var(--sun))",
  },
  {
    nome: "Caça-palavras",
    href: "https://learningapps.org/view52003825",
    Icon: Search,
    gradient: "linear-gradient(135deg, var(--berry), var(--tomato))",
  },
  {
    nome: "Forca",
    href: "https://learningapps.org/view52021417",
    Icon: Type,
    gradient: "linear-gradient(135deg, var(--sun), var(--leaf))",
  },
];

function CriancasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
          <span style={{ color: "var(--tomato)" }}>Área</span>{" "}
          <span style={{ color: "var(--sun)" }}>Kids</span>
        </h1>
      </header>

      <div className="mt-10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Trailer da minissérie:
        </h2>

        <div className="mt-6 w-full max-w-4xl rounded-3xl border border-border bg-card shadow-lg overflow-hidden">
          {TRAILER_URL ? (
            <video controls preload="metadata" className="w-full aspect-video bg-secondary">
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

      <section className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Jogos para brincar e aprender
        </h2>
        <p className="mt-2 text-center text-foreground/70">Escolha um jogo e divirta-se!</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {jogos.map(({ nome, href, Icon, gradient }) => (
            <a
              key={nome}
              href={href}
              className="group rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition flex flex-col items-center text-center"
              style={{ background: gradient }}
            >
              <Icon className="w-16 h-16 mb-4 drop-shadow group-hover:scale-110 transition" strokeWidth={2.2} />
              <span className="text-2xl font-display font-bold">{nome}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
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

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
        <a
          href="https://www.youtube.com/channel/UCT9joOAoMPjdDl56IaXhlUg"
          className="group rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition flex items-center gap-5 text-white"
          style={{ background: "linear-gradient(135deg, #ff0000, #c4302b)" }}
        >
          <Youtube className="w-14 h-14 shrink-0 group-hover:scale-110 transition" strokeWidth={2.2} />
          <div>
            <div className="text-xs uppercase tracking-widest opacity-90">YouTube</div>
            <div className="text-xl md:text-2xl font-display font-bold leading-tight">
              Conheça nosso canal!
            </div>
          </div>
        </a>

        <a
          href="https://saude-em-acao.base44.app"
          className="group rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition flex items-center gap-5 text-white"
          style={{ background: "linear-gradient(135deg, var(--leaf), var(--berry))" }}
        >
          <Gamepad2 className="w-14 h-14 shrink-0 group-hover:scale-110 transition" strokeWidth={2.2} />
          <div>
            <div className="text-xs uppercase tracking-widest opacity-90">Jogue agora</div>
            <div className="text-xl md:text-2xl font-display font-bold leading-tight">
              Guardiões do Prato Vs Turma da Contaminação
            </div>
          </div>
        </a>
      </section>
    </section>
  );
}
