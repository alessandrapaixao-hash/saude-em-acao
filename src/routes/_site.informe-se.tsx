import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText, Globe, Newspaper, Play } from "lucide-react";
import newsVideo from "@/assets/news-video.jpg";
import newsIdec from "@/assets/news-idec.jpg";
import newsAnvisa from "@/assets/news-anvisa.jpg";
import newsUfmg from "@/assets/news-ufmg.jpg";
import newsPr from "@/assets/news-pr.jpg";
import newsScielo from "@/assets/news-scielo.jpg";
import newsMs from "@/assets/news-ms.jpg";
import newsInca from "@/assets/news-inca.jpg";

export const Route = createFileRoute("/_site/informe-se")({
  head: () => ({
    meta: [
      { title: "Informe-se! — Saúde em Ação" },
      { name: "description", content: "Notícias e fontes confiáveis sobre os impactos dos agrotóxicos na saúde humana." },
      { property: "og:title", content: "Informe-se! — Agrotóxicos e saúde" },
      { property: "og:description", content: "Reportagens, estudos e cartilhas oficiais sobre agrotóxicos no Brasil." },
      { property: "og:url", content: "/informe-se" },
    ],
    links: [{ rel: "canonical", href: "/informe-se" }],
  }),
  component: InformePage,
});

type Source = {
  title: string;
  publisher: string;
  url: string;
  type: "video" | "article" | "pdf" | "official";
  description: string;
  image: string;
};

const SOURCES: Source[] = [
  {
    title: "Agrotóxicos: o veneno que chega à mesa",
    publisher: "YouTube",
    url: "https://youtu.be/6-Qwqm5ozPs",
    type: "video",
    description: "Reportagem em vídeo sobre o uso de agrotóxicos no Brasil e seus efeitos sobre a saúde.",
    image: newsVideo,
  },
  {
    title: "Agrotóxicos no Brasil: impactos na saúde humana e ambiental",
    publisher: "IDEC — Instituto de Defesa do Consumidor",
    url: "https://idec.org.br/dicas-e-direitos/agrotoxicos-no-brasil-seus-impactos-na-saude-humana-e-ambiental",
    type: "article",
    description: "Panorama do IDEC sobre como os agrotóxicos afetam a saúde da população e o meio ambiente.",
    image: newsIdec,
  },
  {
    title: "Anvisa divulga lista de alimentos com maior contaminação por agrotóxicos",
    publisher: "Tommasi Laboratório",
    url: "https://tommasi.com.br/blog/anvisa-divulga-lista-de-alimentos-com-maior-nivel-de-contaminacao-por-agrotoxicos/",
    type: "article",
    description: "Resumo do Programa de Análise de Resíduos de Agrotóxicos em Alimentos (PARA) da Anvisa.",
    image: newsAnvisa,
  },
  {
    title: "Agrotóxicos causam problemas que só serão percebidos no futuro",
    publisher: "Faculdade de Medicina UFMG",
    url: "https://www.medicina.ufmg.br/agrotoxicos-causam-problemas-que-so-serao-percebidos-no-futuro/",
    type: "article",
    description: "Pesquisadores da UFMG alertam sobre os efeitos crônicos e cumulativos dos agrotóxicos.",
    image: newsUfmg,
  },
  {
    title: "Intoxicação Aguda por Agrotóxicos",
    publisher: "Secretaria de Saúde do Paraná",
    url: "https://www.saude.pr.gov.br/Pagina/Intoxicacao-Aguda-por-Agrotoxicos",
    type: "official",
    description: "Página oficial do governo do PR explicando sinais, sintomas e protocolos de intoxicação aguda.",
    image: newsPr,
  },
  {
    title: "Agrotóxicos e saúde — análise crítica",
    publisher: "SciELO · Saúde em Debate",
    url: "https://www.scielo.br/j/sdeb/a/bGBYRZvVVKMrV4yzqfwwKtP/?lang=pt",
    type: "article",
    description: "Artigo científico revisado por pares sobre saúde pública e agrotóxicos no Brasil.",
    image: newsScielo,
  },
  {
    title: "Intoxicação por agrotóxicos — Cartilha",
    publisher: "BVS / Ministério da Saúde",
    url: "https://bvsms.saude.gov.br/intoxicacao-por-agrotoxicos/",
    type: "official",
    description: "Conteúdo oficial do Ministério da Saúde sobre prevenção, reconhecimento e atendimento.",
    image: newsMs,
  },
  {
    title: "Um alerta sobre os impactos dos agrotóxicos na saúde",
    publisher: "INCA — Instituto Nacional de Câncer",
    url: "https://ninho.inca.gov.br/jspui/bitstream/123456789/12520/1/Um%20alerta%20sobre%20os%20impactos%20dos%20agrot%C3%B3xicos%20na%20sa%C3%BAde..pdf",
    type: "pdf",
    description: "Documento técnico do INCA que reúne evidências científicas sobre câncer e agrotóxicos.",
    image: newsInca,
  },
];

const TYPE_META = {
  video: { label: "Vídeo", icon: Play, color: "var(--tomato)" },
  article: { label: "Artigo", icon: Newspaper, color: "var(--leaf)" },
  pdf: { label: "PDF", icon: FileText, color: "var(--berry)" },
  official: { label: "Fonte oficial", icon: Globe, color: "var(--primary)" },
} as const;

function InformePage() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div aria-hidden className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[var(--leaf)]/15 blur-3xl -z-10" />
      <div aria-hidden className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[var(--sun)]/15 blur-3xl -z-10" />

      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
          Conhecimento que protege
        </span>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold text-primary">
          Informe-se!
        </h1>
        <p className="mt-4 text-foreground/75">
          Reunimos reportagens, estudos científicos e cartilhas oficiais para
          você se aprofundar nos impactos dos agrotóxicos na saúde humana e
          ambiental. Todas as fontes são públicas e confiáveis.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {SOURCES.map((s) => {
          const meta = TYPE_META[s.type];
          const Icon = meta.icon;
          return (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-primary hover:-translate-y-1 hover:shadow-xl transition flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/95 backdrop-blur"
                  style={{ color: meta.color }}
                >
                  <Icon className="w-3 h-3" />
                  {meta.label}
                </span>
                <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-white drop-shadow opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold text-primary leading-tight">
                  {s.title}
                </h3>
                <div className="text-xs font-semibold text-foreground/60 mt-1">
                  {s.publisher}
                </div>
                <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-14 bg-secondary/50 border border-border rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold text-primary">
          Compartilhe a informação
        </h2>
        <p className="text-foreground/75 mt-2 max-w-lg mx-auto text-sm">
          O primeiro passo para mudar a realidade dos agrotóxicos no Brasil é
          a informação chegar a mais pessoas. Compartilhe estas fontes nas
          suas redes.
        </p>
      </div>
    </section>
  );
}
