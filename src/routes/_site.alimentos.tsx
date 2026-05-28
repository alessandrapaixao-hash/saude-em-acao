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

// Fotos reais dos alimentos. Itens problemáticos usam Wikimedia Commons (mais confiável).
const WIKI = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=800`;

const IMG_URL: Record<string, string> = {
  // Frutas
  "Morango": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
  "Uva": "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80",
  "Laranja": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  "Abacaxi": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  "Maçã": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80",
  "Banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  "Manga": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  "Abacate": "https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=800&q=80",
  "Melão": "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=800&q=80",
  "Melancia": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  "Pera": "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=800&q=80",
  "Pêssego": WIKI("Autumn_Red_peaches.jpg"),
  "Goiaba": "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=800&q=80",
  "Limão": WIKI("Lemon.jpg"),
  "Mexerica / Tangerina": WIKI("Tangerines_and_cross_section.jpg"),
  "Mamão": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80",
  "Maracujá": WIKI("Passion_fruit_and_cross_section.jpg"),
  "Kiwi": WIKI("Kiwi_aka.jpg"),
  "Ameixa": WIKI("Plums.jpg"),
  "Caju": WIKI("Cashew_apples.jpg"),
  "Acerola": WIKI("Acerola_(Malpighia_emarginata).jpg"),
  "Mirtilo / Amora": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
  // Verduras
  "Alface": "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=800&q=80",
  "Couve": "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=800&q=80",
  "Espinafre": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "Rúcula": WIKI("Roquette_(eruca_sativa).jpg"),
  "Agrião": WIKI("Watercress_2.jpg"),
  "Repolho": WIKI("Cabbage_and_cross_section_on_white.jpg"),
  "Brócolis": "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=800&q=80",
  "Couve-flor": WIKI("Cauliflower_white.jpg"),
  "Chicória / Almeirão": WIKI("Cichorium_intybus_-_harvested_chicory.jpg"),
  "Mostarda (folha)": WIKI("Mustard_greens.jpg"),
  "Salsa / Coentro": WIKI("Petroselinum_crispum_2_2007.jpg"),
  // Legumes
  "Pimentão": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  "Tomate": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Pepino": "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80",
  "Abobrinha": WIKI("Courgettes.jpg"),
  "Berinjela": WIKI("Solanum_melongena_24_08_2012_(1).JPG"),
  "Chuchu": WIKI("Chayote_Sechium_edule.jpg"),
  "Quiabo": WIKI("Okra_in_a_basket.jpg"),
  "Abóbora": "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=800&q=80",
  "Vagem": "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=80",
  "Ervilha": WIKI("Peas_in_pods_-_Studio.jpg"),
  // Tubérculos
  "Cenoura": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
  "Batata": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  "Batata-doce": "https://images.unsplash.com/photo-1596097635121-14b63b7a0c23?auto=format&fit=crop&w=800&q=80",
  "Beterraba": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",
  "Mandioca": WIKI("Manihot_esculenta_dsc07325.jpg"),
  "Inhame": WIKI("Yam_(Dioscorea_alata).jpg"),
  "Rabanete": WIKI("Radishes.jpg"),
  // Grãos
  "Arroz": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "Feijão": WIKI("Various_dry_beans.jpg"),
  "Trigo": WIKI("Wheat_close-up.JPG"),
  "Soja": WIKI("SOYBEANS.jpg"),
  "Aveia": "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=800&q=80",
  "Milho": WIKI("Corncobs.jpg"),
  // Outros
  "Cebola": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80",
  "Alho": "https://images.unsplash.com/photo-1615477550927-6ec8445fcfe6?auto=format&fit=crop&w=800&q=80",
};

function foodImage(nome: string) {
  return IMG_URL[nome] ?? "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80";
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
  { emoji: "🥒", nome: "Quiabo", rank: "Pulverização constante", categoria: "Legumes", cor: FOLHA,
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
  { emoji: "🌱", nome: "Mandioca", rank: "Cultivo amplo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Glifosato", "2,4-D", "Atrazina"],
    riscos: ["Provável carcinógeno (IARC)", "Disrupção endócrina", "Neurotoxicidade"] },
  { emoji: "🍠", nome: "Inhame", rank: "Resíduos no solo", categoria: "Tubérculos", cor: ACCENT,
    agrotoxicos: ["Glifosato", "Carbofurano", "Clorpirifós"],
    riscos: ["Neurotoxicidade", "Possível câncer", "Toxicidade reprodutiva"] },
  { emoji: "🟥", nome: "Rabanete", rank: "Raiz rápida e contaminada", categoria: "Tubérculos", cor: TOMATE,
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
