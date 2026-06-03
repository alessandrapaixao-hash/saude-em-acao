import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_site/alimentos")({
  head: () => ({
    meta: [
      { title: "Alimentos e defensores agrícolas — Saúde em Ação" },
      { name: "description", content: "60 alimentos brasileiros, os defensores agrícolas mais encontrados e os riscos à saúde — segundo Anvisa, IDEC, INCA, Greenpeace e reportagens." },
      { property: "og:title", content: "Alimentos com mais defensores agrícolas" },
      { property: "og:description", content: "Os principais alimentos contaminados, os defensores agrícolas usados e os riscos." },
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

type MetodoLimpeza = {
  titulo: string;
  passos: string[];
  observacao: string;
  fonte: string;
};

const TOMATE = "var(--tomato)";
const FOLHA = "var(--leaf)";
const SOL = "var(--sun)";
const BERRY = "var(--berry)";
const ACCENT = "var(--accent)";

// Fotos reais dos alimentos. Itens com erro anterior usam links públicos verificados.
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
  "Pêssego": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Illustration_Prunus_persica_clean_no_descr.jpg/960px-Illustration_Prunus_persica_clean_no_descr.jpg",
  "Goiaba": "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=800&q=80",
  "Limão": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/P1030323.JPG/960px-P1030323.JPG",
  "Mexerica / Tangerina": "https://upload.wikimedia.org/wikipedia/commons/2/2a/TangerineFruit.jpg",
  "Mamão": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80",
  "Maracujá": "https://upload.wikimedia.org/wikipedia/commons/9/91/Passiflora_edulis_forma_flavicarpa.jpg",
  "Kiwi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Actinidia_fruits.jpg/960px-Actinidia_fruits.jpg",
  "Ameixa": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Plums_African_Rose_-_whole%2C_halved_and_slice.jpg/960px-Plums_African_Rose_-_whole%2C_halved_and_slice.jpg",
  "Caju": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cashew_apples.jpg/960px-Cashew_apples.jpg",
  "Acerola": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Malpighia_glabra_blossom_and_unripe_fruits.jpg/960px-Malpighia_glabra_blossom_and_unripe_fruits.jpg",
  "Mirtilo / Amora": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
  // Verduras
  "Alface": "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=800&q=80",
  "Couve": "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=800&q=80",
  "Espinafre": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "Rúcula": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Eruca_vesicaria_BM010755249.jpg/960px-Eruca_vesicaria_BM010755249.jpg",
  "Agrião": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Watercress_%282%29.JPG/960px-Watercress_%282%29.JPG",
  "Repolho": WIKI("Cabbage_and_cross_section_on_white.jpg"),
  "Brócolis": "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=800&q=80",
  "Couve-flor": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Chou-fleur_02.jpg/960px-Chou-fleur_02.jpg",
  "Chicória / Almeirão": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Cichorium_endivia_-_Botanischer_Garten_Mainz_IMG_5453.JPG/960px-Cichorium_endivia_-_Botanischer_Garten_Mainz_IMG_5453.JPG",
  "Mostarda (folha)": "https://upload.wikimedia.org/wikipedia/commons/4/42/Brassica_juncea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-168.jpg",
  "Salsa / Coentro": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Petroselinum.jpg/960px-Petroselinum.jpg",
  // Legumes
  "Pimentão": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  "Tomate": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Pepino": "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80",
  "Abobrinha": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/CSA-Striped-Zucchini.jpg/960px-CSA-Striped-Zucchini.jpg",
  "Berinjela": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Solanum_melongena_24_08_2012_%281%29.JPG/960px-Solanum_melongena_24_08_2012_%281%29.JPG",
  "Chuchu": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Chayote_BNC.jpg/960px-Chayote_BNC.jpg",
  "Quiabo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hong_Kong_Okra_Aug_25_2012.JPG/960px-Hong_Kong_Okra_Aug_25_2012.JPG",
  "Abóbora": "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=800&q=80",
  "Vagem": "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=80",
  "Ervilha": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Peas_in_pods_-_Studio.jpg/960px-Peas_in_pods_-_Studio.jpg",
  // Tubérculos
  "Cenoura": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
  "Batata": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  "Batata-doce": "https://images.unsplash.com/photo-1596097635121-14b63b7a0c23?auto=format&fit=crop&w=800&q=80",
  "Beterraba": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",
  "Mandioca": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Manihot_esculenta_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-090.jpg",
  "Inhame": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yam_at_monday_market_kaduna_state_01.jpg/960px-Yam_at_monday_market_kaduna_state_01.jpg",
  "Rabanete": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Radish_3371103037_4ab07db0bf_o.jpg/960px-Radish_3371103037_4ab07db0bf_o.jpg",
  // Grãos
  "Arroz": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "Feijão": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/French_beans_J1.JPG/960px-French_beans_J1.JPG",
  "Trigo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/960px-Vehn%C3%A4pelto_6.jpg",
  "Soja": "https://upload.wikimedia.org/wikipedia/commons/8/82/Soybean.USDA.jpg",
  "Aveia": "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=800&q=80",
  "Milho": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg",
  // Outros
  "Cebola": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80",
  "Alho": "https://images.unsplash.com/photo-1615477550927-6ec8445fcfe6?auto=format&fit=crop&w=800&q=80",
};

function foodImage(nome: string) {
  return IMG_URL[nome] ?? "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80";
}

function metodoLimpeza(categoria: Categoria): MetodoLimpeza {
  switch (categoria) {
    case "Frutas":
      return {
        titulo: "Frutas com casca fina",
        passos: [
          "Lave em água corrente e friccione a casca por cerca de 30 segundos.",
          "Deixe de molho em solução com pequena quantidade de bicarbonato por até 15 minutos.",
          "Enxágue novamente e, quando fizer sentido, descarte a casca.",
        ],
        observacao: "Ajuda a reduzir resíduos de superfície, mas não remove compostos sistêmicos já absorvidos pela polpa.",
        fonte: "Baseado na reportagem do R7 sobre higienização e redução de resíduos de superfície.",
      };
    case "Verduras":
      return {
        titulo: "Folhas e ervas",
        passos: [
          "Separe folha por folha e retire partes machucadas.",
          "Lave uma a uma em água corrente, com fricção suave para remover sujeira e resíduos externos.",
          "Faça imersão curta em solução de bicarbonato e finalize com novo enxágue abundante.",
        ],
        observacao: "A higienização reduz a carga externa, mas não elimina resíduos sistêmicos absorvidos pela planta.",
        fonte: "Adaptação do método descrito pelo R7 para alimentos de alta retenção superficial.",
      };
    case "Legumes":
      return {
        titulo: "Legumes de casca exposta",
        passos: [
          "Lave em água corrente e esfregue com as mãos ou escova limpa.",
          "Deixe de molho em água com pequena quantidade de bicarbonato por até 15 minutos.",
          "Enxágue bem e, se possível, retire casca ou partes mais expostas antes do preparo.",
        ],
        observacao: "Escovação e bicarbonato ajudam mais contra resíduos superficiais.",
        fonte: "R7: água corrente, fricção, bicarbonato e descascar como formas de redução de risco.",
      };
    case "Tubérculos":
      return {
        titulo: "Raízes e tubérculos",
        passos: [
          "Escove bem a casca em água corrente para remover terra e resíduos externos.",
          "Se desejar, faça imersão rápida em bicarbonato e enxágue em seguida.",
          "Prefira descascar antes do consumo quando o alimento estiver entre os de maior risco.",
        ],
        observacao: "A limpeza externa ajuda, mas resíduos internos podem permanecer.",
        fonte: "R7: fricção, bicarbonato e descasque em alimentos com concentração na superfície.",
      };
    case "Grãos":
      return {
        titulo: "Grãos e cereais",
        passos: [
          "Selecione e descarte impurezas visíveis antes do preparo.",
          "Lave em água corrente até a água sair mais limpa.",
          "Mantenha variedade no consumo semanal para reduzir exposição repetida a um único alimento.",
        ],
        observacao: "A lavagem remove poeira e parte do resíduo externo, mas não o que foi absorvido no cultivo.",
        fonte: "R7: combinação entre lavagem básica e variedade alimentar para redução de exposição.",
      };
    case "Outros":
      return {
        titulo: "Bulbos e condimentos",
        passos: [
          "Lave a parte externa em água corrente antes de descascar ou cortar.",
          "Retire as camadas externas mais expostas quando houver casca seca ou película.",
          "Depois do corte, evite reaproveitar cascas e partes superficiais no preparo.",
        ],
        observacao: "Descartar as camadas externas tende a ser a etapa mais útil nesses itens.",
        fonte: "Aplicação do princípio de lavagem externa e descarte da parte mais exposta citado nas fontes.",
      };
  }
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
  { emoji: "🟣", nome: "Ameixa", rank: "Resíduos persistentes", categoria: "Frutas", cor: BERRY,
    agrotoxicos: ["Carbendazim", "Tebuconazol", "Iprodiona"],
    riscos: ["Disrupção hormonal", "Risco reprodutivo", "Suspeita de câncer"] },
  { emoji: "🌰", nome: "Caju", rank: "Cultivo no Nordeste", categoria: "Frutas", cor: TOMATE,
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
  { emoji: "🌱", nome: "Soja", rank: "Cultivo com mais defensores agrícolas no Brasil", categoria: "Grãos", cor: FOLHA,
    agrotoxicos: ["Glifosato", "2,4-D", "Imidacloprido"],
    riscos: ["Provável carcinógeno", "Disrupção endócrina", "Contaminação ambiental"] },
  { emoji: "🌾", nome: "Aveia", rank: "Resíduos pré-colheita", categoria: "Grãos", cor: SOL,
    agrotoxicos: ["Glifosato", "Clorpirifós", "Tebuconazol"],
    riscos: ["Provável carcinógeno", "Neurotoxicidade", "Disrupção endócrina"] },
  { emoji: "🌽", nome: "Milho", rank: "Transgênico majoritário", categoria: "Grãos", cor: SOL,
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
  const [cardAberto, setCardAberto] = useState<string | null>(null);

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
        {lista.map((a) => {
          const aberto = cardAberto === a.nome;
          const limpeza = metodoLimpeza(a.categoria);

          return (
            <div
              key={a.nome}
              role="button"
              tabIndex={0}
              onClick={() => setCardAberto(aberto ? null : a.nome)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCardAberto(aberto ? null : a.nome);
                }
              }}
              className="group text-left [perspective:1400px] cursor-pointer"
              aria-pressed={aberto}
              aria-label={`Virar card de ${a.nome} para ver o método de limpeza`}
            >
              <article
                className="relative min-h-[36rem] rounded-3xl [transform-style:preserve-3d] transition-transform duration-700"
                style={{ transform: aberto ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div
                  className="absolute inset-0 bg-card border border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition flex flex-col [backface-visibility:hidden]"
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
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.cor }}>
                          {a.rank}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-primary mt-1">{a.nome}</h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                        Clique para virar
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase text-foreground/60">
                        Defensores Agrícolas mais usados
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
                </div>

                <div
                  className="absolute inset-0 rounded-3xl border border-border overflow-hidden bg-card p-6 flex flex-col [backface-visibility:hidden]"
                  style={{
                    transform: "rotateY(180deg)",
                    background: `linear-gradient(180deg, color-mix(in oklab, ${a.cor} 12%, var(--card)), var(--card))`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.cor }}>
                        Verso do card
                      </div>
                      <h3 className="font-display text-2xl font-bold text-primary mt-1">{a.nome}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/80 text-foreground/70">
                      Clique para voltar
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs font-bold uppercase text-foreground/60">Melhor método de limpeza</div>
                    <p className="mt-2 text-lg font-semibold text-primary">{limpeza.titulo}</p>
                    <ul className="mt-4 space-y-2.5">
                      {limpeza.passos.map((passo) => (
                        <li key={passo} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{passo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-2xl bg-secondary/70 p-4">
                    <div className="text-xs font-bold uppercase text-foreground/60">Importante</div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{limpeza.observacao}</p>
                  </div>

                  <div className="mt-auto pt-5 border-t border-border/70">
                    <div className="text-xs font-bold uppercase text-foreground/60">Fonte do método</div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{limpeza.fonte}</p>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
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
