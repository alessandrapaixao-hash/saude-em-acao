import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_site/alimentos")({
  head: () => ({
    meta: [
      { title: "Alimentos e agrotóxicos — Saúde em Ação" },
      { name: "description", content: "Conheça os alimentos mais contaminados por agrotóxicos no Brasil, segundo a Anvisa, e seus riscos à saúde." },
      { property: "og:title", content: "Alimentos com mais agrotóxicos" },
      { property: "og:description", content: "Os principais alimentos contaminados, os agrotóxicos usados e os riscos." },
      { property: "og:url", content: "/alimentos" },
    ],
    links: [{ rel: "canonical", href: "/alimentos" }],
  }),
  component: AlimentosPage,
});

type Card = {
  emoji: string;
  nome: string;
  rank: string;
  agrotoxicos: string[];
  riscos: string[];
  cor: string;
};

const ALIMENTOS: Card[] = [
  {
    emoji: "🍓",
    nome: "Morango",
    rank: "Campeão de contaminação",
    cor: "var(--tomato)",
    agrotoxicos: ["Carbendazim", "Clorpirifós", "Captana", "Procimidona"],
    riscos: [
      "Distúrbios hormonais e endócrinos",
      "Suspeita de carcinogenicidade",
      "Toxicidade neurológica",
    ],
  },
  {
    emoji: "🫑",
    nome: "Pimentão",
    rank: "Top 3 da Anvisa",
    cor: "var(--leaf)",
    agrotoxicos: ["Acefato", "Cipermetrina", "Endosulfan", "Metamidofós"],
    riscos: [
      "Intoxicação aguda (náuseas, vômitos, convulsões)",
      "Danos ao sistema nervoso",
      "Substâncias proibidas em vários países",
    ],
  },
  {
    emoji: "🍅",
    nome: "Tomate",
    rank: "Alta exposição diária",
    cor: "var(--tomato)",
    agrotoxicos: ["Clorotalonil", "Mancozebe", "Tebuconazol"],
    riscos: [
      "Possível ação carcinogênica",
      "Disrupção endócrina",
      "Irritação respiratória crônica",
    ],
  },
  {
    emoji: "🥬",
    nome: "Alface",
    rank: "Folhas que retêm resíduos",
    cor: "var(--leaf)",
    agrotoxicos: ["Carbofurano", "Permetrina", "Deltametrina"],
    riscos: [
      "Toxicidade aguda alta",
      "Efeitos neurológicos em longo prazo",
      "Risco para crianças e gestantes",
    ],
  },
  {
    emoji: "🥔",
    nome: "Batata",
    rank: "Consumo massivo",
    cor: "var(--accent)",
    agrotoxicos: ["Glufosinato", "Imidacloprido", "Clorpirifós"],
    riscos: [
      "Toxicidade reprodutiva",
      "Neurotoxicidade",
      "Danos ao sistema imunológico",
    ],
  },
  {
    emoji: "🍇",
    nome: "Uva",
    rank: "Múltiplas aplicações",
    cor: "var(--berry)",
    agrotoxicos: ["Tiametoxam", "Procimidona", "Captana"],
    riscos: [
      "Provável carcinógeno humano",
      "Distúrbios hormonais",
      "Toxicidade hepática",
    ],
  },
  {
    emoji: "🥕",
    nome: "Cenoura",
    rank: "Absorção pelas raízes",
    cor: "var(--accent)",
    agrotoxicos: ["Difenoconazol", "Linuron", "Aldicarbe"],
    riscos: [
      "Suspeita de causar câncer",
      "Toxicidade no fígado e rins",
      "Resíduos persistentes no solo",
    ],
  },
  {
    emoji: "🍍",
    nome: "Abacaxi",
    rank: "Cultivo intensivo",
    cor: "var(--sun)",
    agrotoxicos: ["Diuron", "Bromacila", "Etoprofós"],
    riscos: [
      "Contaminação de águas subterrâneas",
      "Disrupção endócrina",
      "Toxicidade aguda",
    ],
  },
  {
    emoji: "🍊",
    nome: "Laranja",
    rank: "Pulverização frequente",
    cor: "var(--sun)",
    agrotoxicos: ["Imidacloprido", "Tiametoxam", "Acefato"],
    riscos: [
      "Risco para o desenvolvimento infantil",
      "Toxicidade neurológica",
      "Resíduos atingem o suco",
    ],
  },
];

function AlimentosPage() {
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
          Estes são os alimentos com maior nível de contaminação por agrotóxicos
          identificados em estudos da Anvisa, IDEC e do Ministério da Saúde.
          Cada card mostra os principais princípios ativos encontrados e os
          riscos associados.
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALIMENTOS.map((a) => (
          <article
            key={a.nome}
            className="group bg-card border border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition flex flex-col"
          >
            <div
              className="h-32 flex items-center justify-center text-7xl"
              style={{ background: `color-mix(in oklab, ${a.cor} 18%, var(--background))` }}
            >
              <span className="drop-shadow-sm group-hover:scale-110 transition">
                {a.emoji}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.cor }}>
                {a.rank}
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mt-1">{a.nome}</h3>

              <div className="mt-5">
                <div className="text-xs font-bold uppercase text-foreground/60">
                  Agrotóxicos mais usados
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.agrotoxicos.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
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
          </article>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-12 max-w-xl mx-auto">
        Fontes: Anvisa (PARA), IDEC, INCA, Ministério da Saúde. Os dados podem
        variar a cada safra. Consulte sempre fontes oficiais.
      </p>
    </section>
  );
}
