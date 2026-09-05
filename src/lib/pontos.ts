// Configuração central do sistema 🌱 Pontos Saúde em Ação.
// Todos os valores ficam aqui para poderem ser ajustados sem mexer nas telas.

export const PONTOS = {
  alimentoRegistrado: 2,
  refeicaoRegistrada: 5,
  refeicaoNaoFaco: 0,
  diaCompleto: 15,
} as const;

export type TipoRefeicao = "cafe" | "lanche-manha" | "almoco" | "lanche-tarde" | "jantar";

export const REFEICOES: { tipo: TipoRefeicao; nome: string; icone: string }[] = [
  { tipo: "cafe", nome: "Café da manhã", icone: "☕" },
  { tipo: "lanche-manha", nome: "Lanche da manhã", icone: "🍎" },
  { tipo: "almoco", nome: "Almoço", icone: "🍽️" },
  { tipo: "lanche-tarde", nome: "Lanche da tarde", icone: "🥪" },
  { tipo: "jantar", nome: "Jantar", icone: "🌙" },
];

export const NIVEIS = [
  { min: 0, max: 99, nome: "Começando a Cuidar", emoji: "🌱" },
  { min: 100, max: 249, nome: "Cuidador Atento", emoji: "🧡" },
  { min: 250, max: 499, nome: "Guardião da Alimentação", emoji: "🛡️" },
  { min: 500, max: Number.POSITIVE_INFINITY, nome: "Guardião do Prato", emoji: "🏆" },
];

export function nivelDe(pontos: number) {
  return NIVEIS.find((n) => pontos >= n.min && pontos <= n.max) ?? NIVEIS[0]!;
}

export function proximoNivel(pontos: number) {
  return NIVEIS.find((n) => n.min > pontos) ?? null;
}

export const NIVEL_ATENCAO: Record<string, { emoji: string; rotulo: string; cor: string }> = {
  baixo: { emoji: "🟢", rotulo: "Baixo", cor: "var(--leaf)" },
  moderado: { emoji: "🟡", rotulo: "Moderado", cor: "var(--sun)" },
  atencao: { emoji: "🟠", rotulo: "Atenção", cor: "var(--accent)" },
  maior: { emoji: "🔴", rotulo: "Maior atenção", cor: "var(--tomato)" },
};

export const AVISO_CLASSIFICACAO =
  "Esta classificação é orientativa. Ela indica o nível de atenção sugerido pelos relatórios consultados e não representa quantidade fixa, porcentagem nem resultado de análise do alimento que está na sua casa.";

export const AVISO_HIGIENIZACAO =
  "Higienizar reduz resíduos de superfície, mas não elimina totalmente o que já foi absorvido pelo alimento. Por isso evitamos indicar métodos caseiros sem comprovação.";

export function faixaIndice(indice: number) {
  if (indice >= 70) return { emoji: "🟢", mensagem: "Seu dia teve bastante cuidado. Continue assim!" };
  if (indice >= 40) return { emoji: "🟡", mensagem: "Você já cuidou de boa parte do seu dia. Cada passo conta." };
  return { emoji: "🟠", mensagem: "Todo começo vale. Amanhã dá para cuidar um pouquinho mais." };
}

/** Índice de Cuidado: proporção entre cuidados marcados e cuidados possíveis nos alimentos registrados. */
export function calcularIndice(cuidadosMarcados: number, alimentosRegistrados: number, cuidadosDisponiveis: number) {
  if (alimentosRegistrados === 0 || cuidadosDisponiveis === 0) return null;
  const possiveis = alimentosRegistrados * cuidadosDisponiveis;
  return Math.min(100, Math.round((cuidadosMarcados / possiveis) * 100));
}

export function hojeISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export function formatarDia(dia: string) {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a!, (m ?? 1) - 1, d ?? 1).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
