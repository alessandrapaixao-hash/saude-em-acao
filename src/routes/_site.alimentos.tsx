import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_site/alimentos")({
  head: () => ({
    meta: [
      { title: "Alimentos e agrotóxicos — Saúde em Ação" },
      { name: "description", content: "60 alimentos brasileiros, os agrotóxicos mais encontrados e os riscos à saúde — segundo Anvisa, IDEC, INCA, Greenpeace e reportagens." },
      { property: "og:title", content: "Alimentos com mais agrotóxicos" },
      { property: "og:description", content: "Os principais alimentos contaminados, os agrotóxicos usados e os riscos." },
      { property: "og:url", content: "/alimentos" },
    ],
    links: [{ rel: "canonical", href: "/alimentos" }],
  }),
  component: AlimentosPage,
});

type Categoria = "Frutas" | "Verduras" | "Legumes" | "Tubérculos" | "Grãos" | "Outros";

type Card = {
  emoji: string;
  nome: string;
  rank: string;
  categoria: Categoria;
  agrotoxicos: string[];
  riscos: string[];
  cor: string;
};

const TOMATE = "var(--tomato)";
const FOLHA = "var(--leaf)";
const SOL = "var(--sun)";
const BERRY = "var(--berry)";
const ACCENT = "var(--accent)";

// Mapa nome do alimento -> termos de busca para imagem real (Flickr via LoremFlickr)
const IMG_QUERY: Record<string, string> = {
  "Morango": "strawberry,fruit", "Uva": "grape,bunch", "Laranja": "orange,fruit",
  "Abacaxi": "pineapple", "Maçã": "apple,red", "Banana": "banana,bunch",
  "Manga": "mango,fruit", "Abacate": "avocado", "Melão": "melon,cantaloupe",
  "Melancia": "watermelon", "Pera": "pear,fruit", "Pêssego": "peach,fruit",
  "Goiaba": "guava,fruit", "Limão": "lemon,fruit", "Mexerica / Tangerina": "tangerine,mandarin",
  "Mamão": "papaya", "Maracujá": "passionfruit", "Kiwi": "kiwi,fruit",
  "Ameixa": "plum,fruit", "Caju": "cashew,fruit", "Acerola": "acerola,cherry",
  "Mirtilo / Amora": "blueberry,berry",
  "Alface": "lettuce,green", "Couve": "kale,leaf", "Espinafre": "spinach,leaf",
  "Rúcula": "arugula,rocket", "Agrião": "watercress", "Repolho": "cabbage",
  "Brócolis": "broccoli", "Couve-flor": "cauliflower",
  "Chicória / Almeirão": "chicory,endive", "Mostarda (folha)": "mustard,greens",
  "Salsa / Coentro": "parsley,cilantro",
  "Pimentão": "bell-pepper,red", "Tomate": "tomato,red", "Pepino": "cucumber",
  "Abobrinha": "zucchini", "Berinjela": "eggplant,aubergine", "Chuchu": "chayote,squash",
  "Quiabo": "okra", "Abóbora": "pumpkin,squash", "Vagem": "green-beans",
  "Ervilha": "peas,pod", "Milho verde": "sweet-corn,cob",
  "Cenoura": "carrot,orange", "Batata": "potato,raw", "Batata-doce": "sweet-potato",
  "Beterraba": "beetroot,beet", "Mandioca": "cassava,manioc", "Inhame": "yam,taro",
  "Rabanete": "radish,red",
  "Arroz": "rice,grains", "Feijão": "beans,brown", "Trigo": "wheat,field",
  "Soja": "soybeans,green", "Aveia": "oats,flakes", "Milho (grão)": "corn,kernels",
  "Cebola": "onion,bulb", "Alho": "garlic,cloves",
};

function foodImage(nome: string) {
  const q = IMG_QUERY[nome] ?? "fresh,food";
  const lock = Math.abs(nome.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 999;
  return `https://loremflickr.com/600/400/${encodeURIComponent(q)}?lock=${lock}`;
}

const ALIMENTOS: Card[] = [
  // ====== FRUTAS ======
  { emoji: "🍓", nome: "Morango", rank: "Campeão de contaminação", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Carbendazim", "Clorpirifós", "Captana", "Procimidona"],
    riscos: ["Distúrbios hormonais e endócrinos", "Suspeita de carcinogenicidade", "Toxicidade neurológica"] },
  { emoji: "🍇", nome: "Uva", rank: "Múltiplas aplicações", categoria: "Frutas", cor: BERRY,
    agrotoxicos: ["Tiametoxam", "Procimidona", "Captana"],
    riscos: ["Provável carcinógeno humano", "Distúrbios hormonais", "Toxicidade hepática"] },
  { emoji: "🍊", nome: "Laranja", rank: "Topo da lista Anvisa 2024", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Imidacloprido", "Tiametoxam", "Acefato", "Carbendazim"],
    riscos: ["Risco ao desenvolvimento infantil", "Toxicidade neurológica", "Resíduos passam para o suco"] },
  { emoji: "🍍", nome: "Abacaxi", rank: "Topo da contaminação (O Globo)", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Diuron", "Bromacila", "Etoprofós"],
    riscos: ["Contamina águas subterrâneas", "Disrupção endócrina", "Toxicidade aguda"] },
  { emoji: "🍎", nome: "Maçã", rank: "Aplicações repetidas", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Captana", "Tiabendazol", "Carbendazim"],
    riscos: ["Suspeita de carcinogenicidade", "Disrupção endócrina", "Resíduos na casca"] },
  { emoji: "🍌", nome: "Banana", rank: "Pulverização aérea", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Clorotalonil", "Tiabendazol", "Imazalil"],
    riscos: ["Toxicidade respiratória", "Suspeita de câncer", "Risco aos trabalhadores rurais"] },
  { emoji: "🥭", nome: "Manga", rank: "Resíduos acima do limite", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Carbendazim", "Tebuconazol", "Imidacloprido"],
    riscos: ["Disrupção endócrina", "Toxicidade reprodutiva", "Neurotoxicidade"] },
  { emoji: "🥑", nome: "Abacate", rank: "Acumula resíduos na polpa", categoria: "Frutas", cor: FOLHA,
    agrotoxicos: ["Difenoconazol", "Abamectina", "Clorpirifós"],
    riscos: ["Toxicidade hepática", "Efeitos neurológicos", "Risco gestacional"] },
  { emoji: "🍈", nome: "Melão", rank: "Cultivo intensivo no NE", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Acefato", "Metomil", "Imidacloprido"],
    riscos: ["Intoxicação aguda", "Neurotoxicidade", "Toxicidade imunológica"] },
  { emoji: "🍉", nome: "Melancia", rank: "Alta carga de água", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Mancozebe", "Clorpirifós", "Lambda-cialotrina"],
    riscos: ["Disrupção tireoidiana", "Neurotoxicidade", "Possível carcinógeno"] },
  { emoji: "🍐", nome: "Pera", rank: "Alta detecção (PARA)", categoria: "Frutas", cor: FOLHA,
    agrotoxicos: ["Carbendazim", "Tebuconazol", "Imidacloprido"],
    riscos: ["Suspeita de carcinogenicidade", "Disrupção endócrina", "Toxicidade reprodutiva"] },
  { emoji: "🍑", nome: "Pêssego", rank: "Pulverização frequente", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Iprodiona", "Carbendazim", "Diazinona"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco em crianças"] },
  { emoji: "🍈", nome: "Goiaba", rank: "Campeã (A Pública)", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Abamectina", "Carbendazim", "Clorpirifós"],
    riscos: ["Toxicidade nervosa", "Provável câncer", "Risco em gestantes"] },
  { emoji: "🍋", nome: "Limão", rank: "Pulverização pesada", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Imidacloprido", "Acefato", "Tiametoxam"],
    riscos: ["Neurotoxicidade", "Toxicidade reprodutiva", "Risco infantil"] },
  { emoji: "🍊", nome: "Mexerica / Tangerina", rank: "Citros com resíduos", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Carbendazim", "Imazalil", "Clorpirifós"],
    riscos: ["Disrupção endócrina", "Neurotoxicidade", "Provável carcinógeno"] },
  { emoji: "🥭", nome: "Mamão", rank: "Resíduos detectados", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Mancozebe", "Tebuconazol", "Cipermetrina"],
    riscos: ["Disrupção tireoidiana", "Risco reprodutivo", "Toxicidade hepática"] },
  { emoji: "🍈", nome: "Maracujá", rank: "Aplicação contínua", categoria: "Frutas", cor: SOL,
    agrotoxicos: ["Mancozebe", "Difenoconazol", "Abamectina"],
    riscos: ["Disrupção endócrina", "Neurotoxicidade", "Toxicidade hepática"] },
  { emoji: "🥝", nome: "Kiwi", rank: "Importação com resíduos", categoria: "Frutas", cor: FOLHA,
    agrotoxicos: ["Iprodiona", "Boscalida", "Fludioxonil"],
    riscos: ["Suspeita de carcinogenicidade", "Toxicidade hepática", "Disrupção endócrina"] },
  { emoji: "🍑", nome: "Ameixa", rank: "Resíduos persistentes", categoria: "Frutas", cor: BERRY,
    agrotoxicos: ["Carbendazim", "Tebuconazol", "Iprodiona"],
    riscos: ["Disrupção hormonal", "Risco reprodutivo", "Suspeita de câncer"] },
  { emoji: "🥥", nome: "Caju", rank: "Cultivo no Nordeste", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Mancozebe", "Endosulfan", "Cipermetrina"],
    riscos: ["Neurotoxicidade", "Disrupção tireoidiana", "Substância proibida em vários países"] },
  { emoji: "🍒", nome: "Acerola", rank: "Pulverização intensa", categoria: "Frutas", cor: TOMATE,
    agrotoxicos: ["Abamectina", "Imidacloprido", "Tiametoxam"],
    riscos: ["Toxicidade neurológica", "Risco infantil", "Disrupção endócrina"] },
  { emoji: "🫐", nome: "Mirtilo / Amora", rank: "Cultivo intensivo", categoria: "Frutas", cor: BERRY,
    agrotoxicos: ["Boscalida", "Iprodiona", "Fenhexamida"],
    riscos: ["Disrupção endócrina", "Toxicidade hepática", "Suspeita de câncer"] },

  // ====== VERDURAS (folhas) ======
  { emoji: "🥬", nome: "Alface", rank: "Folhas retêm resíduos", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Carbofurano", "Permetrina", "Deltametrina"],
    riscos: ["Toxicidade aguda alta", "Efeitos neurológicos", "Risco a crianças e gestantes"] },
  { emoji: "🥬", nome: "Couve", rank: "Aplicações frequentes", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Cipermetrina", "Lambda-cialotrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Toxicidade reprodutiva", "Risco infantil"] },
  { emoji: "🌿", nome: "Espinafre", rank: "Resíduos retidos nas folhas", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Permetrina", "Imidacloprido"],
    riscos: ["Dano neurológico", "Disrupção hormonal", "Risco em gestantes"] },
  { emoji: "🌱", nome: "Rúcula", rank: "Folhas finas, alta retenção", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Permetrina", "Deltametrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Toxicidade aguda", "Disrupção endócrina"] },
  { emoji: "🌿", nome: "Agrião", rank: "Cultivo úmido, alta absorção", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Permetrina", "Carbofurano"],
    riscos: ["Neurotoxicidade severa", "Risco gestacional", "Toxicidade aguda"] },
  { emoji: "🥬", nome: "Repolho", rank: "Múltiplas pulverizações", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Cipermetrina", "Acefato", "Deltametrina"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco infantil"] },
  { emoji: "🥦", nome: "Brócolis", rank: "Resíduos nos floretes", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Cipermetrina", "Lambda-cialotrina"],
    riscos: ["Toxicidade neurológica", "Disrupção endócrina", "Risco infantil"] },
  { emoji: "🥦", nome: "Couve-flor", rank: "Aplicações repetidas", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Cipermetrina", "Acefato", "Deltametrina"],
    riscos: ["Neurotoxicidade", "Toxicidade reprodutiva", "Disrupção hormonal"] },
  { emoji: "🌿", nome: "Chicória / Almeirão", rank: "Retém resíduos nas folhas", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Permetrina", "Deltametrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Disrupção endócrina", "Risco gestacional"] },
  { emoji: "🌿", nome: "Mostarda (folha)", rank: "Cultivo com pesticidas", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Cipermetrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco infantil"] },
  { emoji: "🌿", nome: "Salsa / Coentro", rank: "Folhas finas com alta retenção", categoria: "Verduras", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Permetrina", "Deltametrina"],
    riscos: ["Neurotoxicidade", "Toxicidade aguda", "Risco gestacional"] },

  // ====== LEGUMES ======
  { emoji: "🫑", nome: "Pimentão", rank: "Top 3 da Anvisa", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Acefato", "Cipermetrina", "Endosulfan", "Metamidofós"],
    riscos: ["Intoxicação aguda (náuseas, convulsões)", "Danos neurológicos", "Substâncias proibidas em vários países"] },
  { emoji: "🍅", nome: "Tomate", rank: "Alta exposição diária", categoria: "Legumes", cor: TOMATE,
    agrotoxicos: ["Clorotalonil", "Mancozebe", "Tebuconazol"],
    riscos: ["Ação carcinogênica possível", "Disrupção endócrina", "Irritação respiratória"] },
  { emoji: "🥒", nome: "Pepino", rank: "Campeão Anvisa 2024", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Acefato", "Carbendazim", "Clorotalonil"],
    riscos: ["Disrupção endócrina", "Provável carcinógeno", "Toxicidade reprodutiva"] },
  { emoji: "🥒", nome: "Abobrinha", rank: "Resíduos detectados", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Mancozebe", "Clorpirifós", "Lambda-cialotrina"],
    riscos: ["Neurotoxicidade", "Disrupção tireoidiana", "Risco infantil"] },
  { emoji: "🍆", nome: "Berinjela", rank: "Pulverização frequente", categoria: "Legumes", cor: BERRY,
    agrotoxicos: ["Acefato", "Cipermetrina", "Endosulfan"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Substância proibida em vários países"] },
  { emoji: "🥒", nome: "Chuchu", rank: "Resíduos detectados (PARA)", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Acefato", "Clorpirifós", "Carbendazim"],
    riscos: ["Neurotoxicidade", "Disrupção endócrina", "Toxicidade reprodutiva"] },
  { emoji: "🌶️", nome: "Quiabo", rank: "Pulverização constante", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Cipermetrina", "Acefato", "Lambda-cialotrina"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco infantil"] },
  { emoji: "🎃", nome: "Abóbora", rank: "Resíduos persistentes", categoria: "Legumes", cor: SOL,
    agrotoxicos: ["Mancozebe", "Clorpirifós", "Imidacloprido"],
    riscos: ["Disrupção tireoidiana", "Neurotoxicidade", "Risco gestacional"] },
  { emoji: "🫛", nome: "Vagem", rank: "Resíduos detectados", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Cipermetrina", "Lambda-cialotrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco infantil"] },
  { emoji: "🫛", nome: "Ervilha", rank: "Cultivo intensivo", categoria: "Legumes", cor: FOLHA,
    agrotoxicos: ["Clorpirifós", "Lambda-cialotrina", "Imidacloprido"],
    riscos: ["Neurotoxicidade", "Risco infantil", "Disrupção endócrina"] },
  { emoji: "🌽", nome: "Milho verde", rank: "Cultura geneticamente modificada", categoria: "Legumes", cor: SOL,
    agrotoxicos: ["Atrazina", "Glifosato", "Clorpirifós"],
    riscos: ["Disrupção endócrina", "Provável carcinógeno (IARC)", "Neurotoxicidade"] },

  // ====== TUBÉRCULOS / RAÍZES ======
  { emoji: "🥕", nome: "Cenoura", rank: "Absorção pelas raízes", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Difenoconazol", "Linuron", "Aldicarbe"],
    riscos: ["Suspeita de câncer", "Toxicidade hepática e renal", "Resíduos persistentes no solo"] },
  { emoji: "🥔", nome: "Batata", rank: "Consumo massivo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Glufosinato", "Imidacloprido", "Clorpirifós"],
    riscos: ["Toxicidade reprodutiva", "Neurotoxicidade", "Dano imunológico"] },
  { emoji: "🍠", nome: "Batata-doce", rank: "Absorção no solo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Clorpirifós", "Carbofurano", "Imidacloprido"],
    riscos: ["Neurotoxicidade", "Toxicidade aguda", "Risco infantil"] },
  { emoji: "🍠", nome: "Beterraba", rank: "Raiz com retenção", categoria: "Tubérculos", cor: BERRY,
    agrotoxicos: ["Clorpirifós", "Lambda-cialotrina", "Carbendazim"],
    riscos: ["Neurotoxicidade", "Disrupção endócrina", "Suspeita de câncer"] },
  { emoji: "🥔", nome: "Mandioca", rank: "Cultivo amplo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Glifosato", "2,4-D", "Atrazina"],
    riscos: ["Provável carcinógeno (IARC)", "Disrupção endócrina", "Neurotoxicidade"] },
  { emoji: "🥔", nome: "Inhame", rank: "Resíduos no solo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Glifosato", "Carbofurano", "Clorpirifós"],
    riscos: ["Neurotoxicidade", "Possível câncer", "Toxicidade reprodutiva"] },
  { emoji: "🌶️", nome: "Rabanete", rank: "Raiz rápida e contaminada", categoria: "Tubérculos", cor: TOMATE,
    agrotoxicos: ["Clorpirifós", "Permetrina", "Acefato"],
    riscos: ["Neurotoxicidade", "Disrupção hormonal", "Risco infantil"] },

  // ====== GRÃOS / CEREAIS ======
  { emoji: "🌾", nome: "Arroz", rank: "Base da alimentação", categoria: "Grãos", cor: SOL,
    agrotoxicos: ["Glifosato", "Carbofurano", "Tebuconazol"],
    riscos: ["Provável carcinógeno", "Neurotoxicidade", "Disrupção endócrina"] },
  { emoji: "🫘", nome: "Feijão", rank: "Resíduos detectados (PARA)", categoria: "Grãos", cor: ACCENT,
    agrotoxicos: ["Glifosato", "Clorpirifós", "Carbendazim"],
    riscos: ["Suspeita de câncer", "Neurotoxicidade", "Disrupção endócrina"] },
  { emoji: "🌾", nome: "Trigo", rank: "Aplicação pré-colheita", categoria: "Grãos", cor: SOL,
    agrotoxicos: ["Glifosato", "Tebuconazol", "Clorpirifós"],
    riscos: ["Provável carcinógeno (IARC)", "Disrupção hormonal", "Toxicidade hepática"] },
  { emoji: "🌱", nome: "Soja", rank: "Cultivo com mais agrotóxicos no Brasil", categoria: "Grãos", cor: FOLHA,
    agrotoxicos: ["Glifosato", "2,4-D", "Imidacloprido"],
    riscos: ["Provável carcinógeno", "Disrupção endócrina", "Contaminação ambiental"] },
  { emoji: "🌾", nome: "Aveia", rank: "Resíduos pré-colheita", categoria: "Grãos", cor: SOL,
    agrotoxicos: ["Glifosato", "Clorpirifós", "Tebuconazol"],
    riscos: ["Provável carcinógeno", "Neurotoxicidade", "Disrupção endócrina"] },
  { emoji: "🌽", nome: "Milho (grão)", rank: "Transgênico majoritário", categoria: "Grãos", cor: SOL,
    agrotoxicos: ["Glifosato", "Atrazina", "Clorpirifós"],
    riscos: ["Provável carcinógeno", "Disrupção endócrina", "Neurotoxicidade"] },

  // ====== OUTROS ======
  { emoji: "🧅", nome: "Cebola", rank: "Cultivo com resíduos", categoria: "Outros", cor: BERRY,
    agrotoxicos: ["Iprodiona", "Mancozebe", "Clorpirifós"],
    riscos: ["Disrupção endócrina", "Neurotoxicidade", "Toxicidade tireoidiana"] },
  { emoji: "🧄", nome: "Alho", rank: "Aplicações em campo", categoria: "Outros", cor: ACCENT,
    agrotoxicos: ["Mancozebe", "Tebuconazol", "Clorpirifós"],
    riscos: ["Disrupção tireoidiana", "Neurotoxicidade", "Risco hepático"] },
];

const CATEGORIAS: ("Todos" | Categoria)[] = ["Todos", "Frutas", "Verduras", "Legumes", "Tubérculos", "Grãos", "Outros"];

function AlimentosPage() {
  const [filtro, setFiltro] = useState<"Todos" | Categoria>("Todos");

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
        {lista.map((a) => (
          <article
            key={a.nome}
            className="group bg-card border border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition flex flex-col"
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
          </article>
        ))}
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
