import { ALIMENTOS, foodImage, metodoLimpeza } from "/dev-server/src/lib/catalogo-alimentos";
const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";
const arr = (a: string[]) => "ARRAY[" + a.map(q).join(",") + "]::text[]";
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function nivel(a: typeof ALIMENTOS[number]) {
  const r = a.rank.toLowerCase();
  if (/campe|topo|top /.test(r)) return "maior";
  if (a.categoria === "Verduras" || a.categoria === "Frutas") return "atencao";
  if (a.categoria === "Grãos" || a.categoria === "Outros") return "baixo";
  return "moderado";
}
const rows = ALIMENTOS.map((a) => {
  const m = metodoLimpeza(a.categoria);
  const saiba = `Destaque nos relatórios consultados: ${a.rank}. A atenção com este alimento envolve procedência, higienização, preparo e armazenamento.`;
  const cuid = `${m.titulo}: ${m.passos.join(" ")} ${m.observacao}`;
  return `(${q(slug(a.nome))},${q(a.nome)},${q(a.categoria)},${q(a.emoji)},${q(foodImage(a.nome))},${q(nivel(a))},${q(a.rank)},${arr(a.agrotoxicos)},${arr(a.riscos)},${q(saiba)},${q(cuid)},${arr(["Anvisa — Programa de Análise de Resíduos de Agrotóxicos em Alimentos (PARA)", m.fonte])})`;
});
console.log(`INSERT INTO public.alimentos (slug,nome,categoria,emoji,imagem_url,nivel_atencao,descricao,defensivos,riscos,saiba_mais,cuidados_texto,fontes) VALUES\n${rows.join(",\n")}\nON CONFLICT (slug) DO UPDATE SET nome=EXCLUDED.nome, categoria=EXCLUDED.categoria, emoji=EXCLUDED.emoji, imagem_url=EXCLUDED.imagem_url, nivel_atencao=EXCLUDED.nivel_atencao, descricao=EXCLUDED.descricao, defensivos=EXCLUDED.defensivos, riscos=EXCLUDED.riscos, saiba_mais=EXCLUDED.saiba_mais, cuidados_texto=EXCLUDED.cuidados_texto, fontes=EXCLUDED.fontes;`);
