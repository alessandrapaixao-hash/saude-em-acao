import { createFileRoute } from "@tanstack/react-router";
import { Youtube, Gamepad2 } from "lucide-react";
import memoriaAsset from "@/assets/memoria.png.asset.json";
import forcaAsset from "@/assets/forca.png.asset.json";
import desembaralheAsset from "@/assets/desembaralhe.png.asset.json";
import cacaPalavrasAsset from "@/assets/cacapalavras.png.asset.json";

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
  { nome: "Jogo da Memória", href: "https://learningapps.org/view52003284", img: memoriaAsset.url },
  { nome: "Desembaralhe", href: "https://wordwall.net/resource/114702835", img: desembaralheAsset.url },
  { nome: "Caça-palavras", href: "https://learningapps.org/view52003825", img: cacaPalavrasAsset.url },
  { nome: "Forca", href: "https://learningapps.org/view52021417", img: forcaAsset.url },
];

function CriancasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
          <span style={{ color: "var(--tomato)" }}>Área</span>{" "}
          <span style={{ color: "var(--sun)" }}>Kids</span>
        </h1>
        <p className="mt-4 text-lg text-foreground/75">
          A minissérie dos Guardiões do Prato estará disponível em breve no nosso canal do YouTube. Fique de olho!
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Jogos para brincar e aprender
        </h2>
        <p className="mt-2 text-center text-foreground/70">Escolha um jogo e divirta-se!</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jogos.map(({ nome, href, img }) => (
            <a
              key={nome}
              href={href}
              className="group rounded-3xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <img
                src={img}
                alt={`Logo do jogo ${nome}`}
                className="w-full h-auto block group-hover:scale-[1.02] transition"
              />
              <div className="sr-only">{nome}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
        <a
          href="https://www.youtube.com/channel/UCT9joOAoMPjdDl56IaXhlUg"
          target="_blank"
          rel="noopener noreferrer"
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
