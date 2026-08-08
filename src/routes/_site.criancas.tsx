import { createFileRoute } from "@tanstack/react-router";
import { Youtube, Sparkles } from "lucide-react";
import memoriaImg from "@/assets/logo-memoria.png";
import forcaAsset from "@/assets/forca-logo.png.asset.json";
import desembaralheImg from "@/assets/logo-desembaralhe.png";
import cacaPalavrasImg from "@/assets/logo-cacapalavras.png";
import vsAsset from "@/assets/guardioes-vs-contaminacao.png.asset.json";

export const Route = createFileRoute("/_site/criancas")({
  head: () => ({
    meta: [
      { title: "Área Kids — Saúde em Ação" },
      { name: "description", content: "Área Kids com jogos educativos dos Guardiões do Prato e acesso ao canal do YouTube." },
      { property: "og:title", content: "Área Kids — Saúde em Ação" },
      { property: "og:description", content: "Jogos interativos e muito mais para as crianças aprenderem brincando." },
      { property: "og:url", content: "/criancas" },
    ],
    links: [{ rel: "canonical", href: "/criancas" }],
  }),
  component: CriancasPage,
});

const jogos = [
  {
    nome: "Jogo da Memória",
    href: "https://learningapps.org/view52003284",
    img: memoriaImg,
    gradient: "from-[var(--leaf)]/15 via-[var(--leaf)]/5 to-transparent",
    ring: "hover:ring-[var(--leaf)]",
  },
  {
    nome: "Desembaralhe",
    href: "https://wordwall.net/resource/114702835",
    img: desembaralheImg,
    gradient: "from-[var(--berry)]/20 via-[var(--berry)]/5 to-transparent",
    ring: "hover:ring-[var(--berry)]",
  },
  {
    nome: "Caça-palavras",
    href: "https://learningapps.org/view52003825",
    img: cacaPalavrasImg,
    gradient: "from-[var(--sun)]/20 via-[var(--sun)]/5 to-transparent",
    ring: "hover:ring-[var(--sun)]",
  },
  {
    nome: "Forca",
    href: "https://learningapps.org/view52021417",
    img: forcaAsset.url,
    gradient: "from-[var(--tomato)]/15 via-[var(--tomato)]/5 to-transparent",
    ring: "hover:ring-[var(--tomato)]",
  },
];

function CriancasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">
          <Sparkles className="w-3.5 h-3.5" /> Diversão com propósito
        </span>
        <h1 className="mt-3 text-4xl md:text-6xl font-display font-bold leading-tight">
          <span style={{ color: "var(--tomato)" }}>Área</span>{" "}
          <span style={{ color: "var(--sun)" }}>Kids</span>
        </h1>
        <p className="mt-4 text-lg text-foreground/75">
          Jogos, desafios e personagens para aprender sobre alimentação saudável brincando.
        </p>
      </header>

      {/* Destaque: Guardiões VS Turma da Contaminação */}
      <section className="mt-12">
        <a
          href="https://saude-em-acao.base44.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-[2rem] border border-border shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(76,29,149,0.5)] transition"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.35), transparent 55%), linear-gradient(135deg, #0f172a, #1e1b4b 50%, #4a044e)",
          }}
        >
          <div aria-hidden className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 22px, rgba(255,255,255,.06) 22px 24px)",
            }}
          />
          <div className="relative flex flex-col items-center text-center gap-6 p-6 md:p-10 text-white">
            <div className="flex justify-center w-full">
              <img
                src={vsAsset.url}
                alt="Guardiões do Prato VS Turma da Contaminação"
                className="mx-auto w-full max-w-sm drop-shadow-[0_10px_30px_rgba(168,85,247,0.6)] group-hover:scale-105 group-hover:rotate-1 transition duration-500"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--sun)] text-[#1a1300] text-[10px] font-black uppercase tracking-widest shadow">
                🎮 Jogo principal
              </span>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-black leading-[1.05] drop-shadow-lg">
                Guardiões do Prato
                <span className="block text-[var(--sun)]">VS Turma da Contaminação</span>
              </h2>
              <p className="mt-4 text-white/85 text-base md:text-lg max-w-md mx-auto">
                Entre na batalha entre os heróis dos alimentos saudáveis e os vilões do veneno. Uma aventura interativa que ensina enquanto diverte!
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-[var(--sun)] text-[#1a1300] px-6 py-3 rounded-full font-black shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition">
                ▶ Jogar agora
              </div>
            </div>
          </div>

        </a>
      </section>

      {/* Vídeo: Conheça os Guardiões do Prato */}
      <section className="mt-16">
        <h2 className="text-center text-2xl md:text-3xl font-display font-bold text-primary">
          Conheça os Guardiões do Prato:
        </h2>
        <div className="mt-6 mx-auto max-w-3xl aspect-video overflow-hidden rounded-3xl border border-border shadow-xl bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/NOQNEPZstes"
            title="Conheça os Guardiões do Prato"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="mt-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
            Mais jogos para brincar e aprender
          </h2>
          <p className="mt-2 text-foreground/70">
            Escolha um desafio e divirta-se com os Guardiões do Prato!
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jogos.map(({ nome, href, img, gradient, ring }) => (
            <a
              key={nome}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-3xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:-translate-y-1 ring-2 ring-transparent ${ring} transition-all`}
            >
              <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              <div className="relative p-6 flex items-center justify-center min-h-[200px]">
                <img
                  src={img}
                  alt={`Logo do jogo ${nome}`}
                  className="mx-auto block max-h-44 w-auto drop-shadow-lg group-hover:scale-105 transition duration-300"
                />

              </div>
              <div className="relative px-6 pb-5 flex items-center justify-between text-sm font-bold text-foreground/80">
                <span>Jogar {nome}</span>
                <span className="text-primary group-hover:translate-x-1 transition">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <a
          href="https://www.youtube.com/channel/UCT9joOAoMPjdDl56IaXhlUg"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              "https://www.youtube.com/channel/UCT9joOAoMPjdDl56IaXhlUg",
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="group rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition flex items-center gap-5 text-white cursor-pointer"
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
      </section>
    </section>
  );
}
