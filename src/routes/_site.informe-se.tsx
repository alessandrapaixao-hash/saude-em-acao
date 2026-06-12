import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText, Globe, Newspaper, Play } from "lucide-react";
import { useMemo, useState } from "react";
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
      { name: "description", content: "Reportagens, artigos científicos e vídeos sobre defensores agrícolas e saúde no Brasil. Filtre por tipo de fonte." },
      { property: "og:title", content: "Informe-se! — Defensores Agrícolas e saúde" },
      { property: "og:description", content: "Reportagens, estudos e vídeos sobre defensores agrícolas no Brasil." },
      { property: "og:url", content: "/informe-se" },
    ],
    links: [{ rel: "canonical", href: "/informe-se" }],
  }),
  component: InformePage,
});

type Tipo = "video" | "reportagem" | "artigo";

type Source = {
  title: string;
  publisher: string;
  url: string;
  tipo: Tipo;
  description: string;
  image?: string;
};

const SOURCES: Source[] = [
  // Originais (com imagens)
  { title: "Defensores Agrícolas: o veneno que chega à mesa", publisher: "YouTube", url: "https://youtu.be/6-Qwqm5ozPs",
    tipo: "video", description: "Reportagem em vídeo sobre o uso de defensores agrícolas no Brasil e seus efeitos sobre a saúde.", image: newsVideo },
  { title: "Defensores Agrícolas no Brasil: impactos na saúde humana e ambiental", publisher: "IDEC", url: "https://idec.org.br/dicas-e-direitos/agrotoxicos-no-brasil-seus-impactos-na-saude-humana-e-ambiental",
    tipo: "artigo", description: "Panorama do IDEC sobre como os defensores agrícolas afetam a saúde da população e o meio ambiente.", image: newsIdec },
  { title: "Anvisa divulga lista de alimentos com maior contaminação", publisher: "Tommasi Laboratório", url: "https://tommasi.com.br/blog/anvisa-divulga-lista-de-alimentos-com-maior-nivel-de-contaminacao-por-agrotoxicos/",
    tipo: "reportagem", description: "Resumo do Programa de Análise de Resíduos de Defensores Agrícolas em Alimentos (PARA) da Anvisa.", image: newsAnvisa },
  { title: "Defensores Agrícolas causam problemas que só serão percebidos no futuro", publisher: "Faculdade de Medicina UFMG", url: "https://www.medicina.ufmg.br/agrotoxicos-causam-problemas-que-so-serao-percebidos-no-futuro/",
    tipo: "artigo", description: "Pesquisadores da UFMG alertam sobre os efeitos crônicos e cumulativos dos defensores agrícolas.", image: newsUfmg },
  { title: "Intoxicação Aguda por Defensores Agrícolas", publisher: "Secretaria de Saúde do Paraná", url: "https://www.saude.pr.gov.br/Pagina/Intoxicacao-Aguda-por-Agrotoxicos",
    tipo: "artigo", description: "Página oficial do governo do PR sobre sinais, sintomas e protocolos de intoxicação aguda.", image: newsPr },
  { title: "Defensores Agrícolas e saúde — análise crítica", publisher: "SciELO · Saúde em Debate", url: "https://www.scielo.br/j/sdeb/a/bGBYRZvVVKMrV4yzqfwwKtP/?lang=pt",
    tipo: "artigo", description: "Artigo científico revisado por pares sobre saúde pública e defensores agrícolas no Brasil.", image: newsScielo },
  { title: "Intoxicação por defensores agrícolas — Cartilha", publisher: "BVS / Ministério da Saúde", url: "https://bvsms.saude.gov.br/intoxicacao-por-agrotoxicos/",
    tipo: "artigo", description: "Conteúdo oficial do Ministério da Saúde sobre prevenção, reconhecimento e atendimento.", image: newsMs },
  { title: "Um alerta sobre os impactos dos defensores agrícolas na saúde", publisher: "INCA — Instituto Nacional de Câncer", url: "https://ninho.inca.gov.br/jspui/bitstream/123456789/12520/1/Um%20alerta%20sobre%20os%20impactos%20dos%20agrot%C3%B3xicos%20na%20sa%C3%BAde..pdf",
    tipo: "artigo", description: "Documento técnico do INCA com evidências científicas sobre câncer e defensores agrícolas.", image: newsInca },

  // Novas reportagens
  { title: "Quais são os alimentos mais contaminados por defensores agrícolas no Brasil", publisher: "Saúde Abril",
    url: "https://saude.abril.com.br/alimentacao/quais-sao-os-alimentos-mais-contaminados-por-agrotoxicos-e-os-mais-seguros-no-brasil/",
    tipo: "reportagem", description: "Lista dos alimentos com mais e menos resíduos detectados pela Anvisa.",
    image: "https://loremflickr.com/800/450/fruits,vegetables,market?lock=11" },
  { title: "Alimentos com mais defensores agrícolas — riscos à saúde", publisher: "Metrópoles",
    url: "https://www.metropoles.com/saude/alimentos-mais-agrotoxicos-riscos",
    tipo: "reportagem", description: "Especialistas explicam os riscos por trás do consumo frequente de alimentos contaminados.",
    image: "https://loremflickr.com/800/450/health,doctor,food?lock=12" },
  { title: "Laranja, pimentão e goiaba: campeões de defensores agrícolas acima do limite", publisher: "Agência Pública",
    url: "https://apublica.org/2020/10/laranja-pimentao-e-goiaba-alimentos-campeoes-de-agrotoxicos-acima-do-limite/",
    tipo: "reportagem", description: "Investigação independente sobre os alimentos com mais resíduos irregulares.",
    image: "https://loremflickr.com/800/450/orange,pepper,guava?lock=13" },
  { title: "Anvisa alerta: 2 frutas populares no Brasil têm defensores agrícolas em excesso", publisher: "UOL VivaBem",
    url: "https://www.uol.com.br/vivabem/noticias/redacao/2025/01/07/anvisa-alerta-2-frutas-populares-no-brasil-tem-agrotoxicos-em-excesso.htm",
    tipo: "reportagem", description: "Alerta da Anvisa sobre frutas amplamente consumidas e com níveis irregulares.",
    image: "https://loremflickr.com/800/450/fruit,brazil,warning?lock=14" },
  { title: "Anvisa divulga lista com os 10 alimentos mais afetados por defensores agrícolas", publisher: "O Tempo",
    url: "https://www.otempo.com.br/brasil/anvisa-divulga-lista-com-os-dez-alimentos-mais-afetados-por-agrotoxicos-1.436431",
    tipo: "reportagem", description: "Ranking oficial dos alimentos mais contaminados segundo o PARA da Anvisa.",
    image: "https://loremflickr.com/800/450/vegetables,supermarket?lock=15" },
  { title: "Pepino e laranja: alimentos campeões de defensores agrícolas (Anvisa 2024)", publisher: "Repórter Brasil",
    url: "https://reporterbrasil.org.br/2025/12/pepino-laranja-alimentos-campeoes-agrotoxicos-anvisa/",
    tipo: "reportagem", description: "Análise dos dados mais recentes do Programa de Análise de Resíduos da Anvisa.",
    image: "https://loremflickr.com/800/450/cucumber,orange?lock=16" },
  { title: "Quais frutas acumulam mais defensores agrícolas e como se proteger", publisher: "R7 Notícias",
    url: "https://noticias.r7.com/giro-10/quais-frutas-acumulam-mais-agrotoxicos-e-como-proteger-se-18032026/",
    tipo: "reportagem", description: "Lista prática das frutas com mais resíduos e dicas para reduzir a exposição.",
    image: "https://loremflickr.com/800/450/fruits,washing,water?lock=17" },
  { title: "Anvisa divulga resultados do monitoramento de defensores agrícolas — Ciclo 2024", publisher: "G1 Saúde",
    url: "https://g1.globo.com/saude/noticia/2025/12/17/anvisa-divulga-resultados-do-monitoramento-de-agrotoxicos-em-alimentos-ciclo-2024.ghtml",
    tipo: "reportagem", description: "Cobertura do G1 sobre os números oficiais do monitoramento de defensores agrícolas.",
    image: "https://loremflickr.com/800/450/laboratory,food,analysis?lock=18" },
  { title: "A fruta brasileira com maior teor de defensores agrícolas, segundo a Anvisa", publisher: "TudoGostoso",
    url: "https://www.tudogostoso.com.br/noticias/a-fruta-brasileira-com-maior-teor-de-agrotoxicos-segundo-a-anvisa-a24169.htm",
    tipo: "reportagem", description: "Matéria sobre a fruta líder em resíduos de defensores agrícolas no monitoramento da Anvisa.",
    image: "https://loremflickr.com/800/450/brazilian,fruit?lock=19" },
  { title: "Veneno no prato dos outros é refresco", publisher: "Greenpeace Brasil",
    url: "https://www.greenpeace.org/brasil/blog/veneno-no-prato-dos-outros-e-refresco/",
    tipo: "artigo", description: "Análise crítica do Greenpeace sobre a flexibilização das regras de defensores agrícolas no Brasil.",
    image: "https://loremflickr.com/800/450/pesticide,spray,crop?lock=20" },
  { title: "Núcleo de Estudos NUQUALI — Defensores Agrícolas em alimentos", publisher: "UFLA",
    url: "http://www.nucleoestudo.ufla.br/nuquali/?p=357",
    tipo: "artigo", description: "Estudo acadêmico da Universidade Federal de Lavras sobre qualidade dos alimentos.",
    image: "https://loremflickr.com/800/450/university,research,food?lock=21" },
  { title: "Laranja e abacaxi no topo da contaminação por defensores agrícolas", publisher: "O Globo",
    url: "https://oglobo.globo.com/brasil/sustentabilidade/laranja-abacaxi-estao-no-topo-da-contaminacao-por-agrotoxicos-20542450",
    tipo: "reportagem", description: "Reportagem do O Globo sobre as frutas com maior detecção de resíduos.",
    image: "https://loremflickr.com/800/450/orange,pineapple?lock=22" },
  { title: "As frutas mais venenosas que os brasileiros adoram", publisher: "TudoGostoso",
    url: "https://www.tudogostoso.com.br/noticias/poucos-sabem-mas-essas-sao-as-frutas-mais-venenosas-elas-estao-cheia-de-pesticidas-mas-os-brasileiros-as-adoram-a18752.htm",
    tipo: "reportagem", description: "Frutas amplamente consumidas no país com altos níveis de pesticidas.",
    image: "https://loremflickr.com/800/450/strawberry,grape,fruit?lock=23" },

  // Vídeos
  { title: "Reportagem especial sobre defensores agrícolas (Globoplay)", publisher: "Globoplay",
    url: "https://globoplay.globo.com/v/6737676/",
    tipo: "video", description: "Reportagem em vídeo sobre o cenário dos defensores agrícolas no Brasil.",
    image: "https://loremflickr.com/800/450/television,news,brazil?lock=24" },
  { title: "Defensores Agrícolas no Brasil — documentário", publisher: "YouTube",
    url: "https://www.youtube.com/watch?v=dPwDVAqZdG4",
    tipo: "video", description: "Conteúdo audiovisual com depoimentos e dados sobre contaminação alimentar.",
    image: "https://loremflickr.com/800/450/documentary,farm,brazil?lock=25" },
  { title: "Impacto dos defensores agrícolas na saúde", publisher: "YouTube",
    url: "https://www.youtube.com/watch?v=v-77ASNWPHY",
    tipo: "video", description: "Vídeo explicativo sobre os efeitos dos defensores agrícolas no organismo.",
    image: "https://loremflickr.com/800/450/health,human,body?lock=26" },
  { title: "Reportagem Globoplay — defensores agrícolas no campo", publisher: "Globoplay",
    url: "https://globoplay.globo.com/v/5564567/",
    tipo: "video", description: "Cobertura televisiva sobre o uso de defensores agrícolas no agronegócio brasileiro.",
    image: "https://loremflickr.com/800/450/agriculture,field,tractor?lock=27" },
  { title: "Defensores Agrícolas e câncer — debate", publisher: "YouTube",
    url: "https://www.youtube.com/watch?v=UYJwEK-XwRk",
    tipo: "video", description: "Debate com especialistas sobre a relação entre defensores agrícolas e câncer.",
    image: "https://loremflickr.com/800/450/cancer,research,medicine?lock=28" },
  { title: "Reportagem Globoplay — alimentos contaminados", publisher: "Globoplay",
    url: "https://globoplay.globo.com/v/2921523/",
    tipo: "video", description: "Reportagem investigativa sobre alimentos com resíduos de defensores agrícolas.",
    image: "https://loremflickr.com/800/450/food,contamination,investigation?lock=29" },
  { title: "Como os defensores agrícolas chegam ao seu prato", publisher: "YouTube",
    url: "https://www.youtube.com/watch?v=R5-2t6VJDAg",
    tipo: "video", description: "Vídeo que explica o caminho dos defensores agrícolas da lavoura até a mesa do consumidor.",
    image: "https://loremflickr.com/800/450/plate,food,dinner?lock=30" },
];

const TYPE_META: Record<Tipo, { label: string; icon: typeof Play; color: string; bg: string }> = {
  video: { label: "Vídeo", icon: Play, color: "var(--tomato)", bg: "linear-gradient(135deg, var(--tomato), var(--sun))" },
  reportagem: { label: "Reportagem", icon: Newspaper, color: "var(--berry)", bg: "linear-gradient(135deg, var(--berry), var(--accent))" },
  artigo: { label: "Artigo", icon: FileText, color: "var(--leaf)", bg: "linear-gradient(135deg, var(--leaf), var(--primary))" },
};

const FILTROS: ("todos" | Tipo)[] = ["todos", "reportagem", "artigo", "video"];
const FILTRO_LABEL: Record<"todos" | Tipo, string> = {
  todos: "Todos",
  reportagem: "Reportagens",
  artigo: "Artigos",
  video: "Vídeos",
};

function InformePage() {
  const [filtro, setFiltro] = useState<"todos" | Tipo>("todos");
  const lista = useMemo(
    () => (filtro === "todos" ? SOURCES : SOURCES.filter((s) => s.tipo === filtro)),
    [filtro],
  );

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
          {SOURCES.length} fontes confiáveis entre reportagens, artigos
          científicos e vídeos sobre os impactos dos defensores agrícolas na saúde.
          Use os filtros para encontrar o formato que você prefere.
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {FILTROS.map((t) => {
          const ativo = t === filtro;
          const count = t === "todos" ? SOURCES.length : SOURCES.filter((s) => s.tipo === t).length;
          return (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
                ativo
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-card text-foreground/80 border-border hover:border-primary hover:text-primary"
              }`}
            >
              {FILTRO_LABEL[t]} <span className="opacity-60 ml-1 text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lista.map((s) => {
          const meta = TYPE_META[s.tipo];
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
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: meta.bg }}
                  >
                    <Icon className="w-16 h-16 text-white/90 drop-shadow group-hover:scale-110 transition" />
                  </div>
                )}
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
                <h3 className="font-display text-lg font-bold text-primary leading-tight">
                  {s.title}
                </h3>
                <div className="text-xs font-semibold text-foreground/60 mt-1">
                  {s.publisher}
                </div>
                <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                  Acessar fonte <ExternalLink className="w-3 h-3" />
                </div>
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
          O primeiro passo para mudar a realidade dos defensores agrícolas no Brasil é
          a informação chegar a mais pessoas. Compartilhe estas fontes nas
          suas redes.
        </p>
      </div>
    </section>
  );
}
