import { ALIMENTOS, foodImage, metodoLimpeza } from "/dev-server/src/lib/catalogo-alimentos";
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const nivel = (a: typeof ALIMENTOS[number]) => /campe|topo|top /.test(a.rank.toLowerCase()) ? "maior" : (a.categoria === "Verduras" || a.categoria === "Frutas") ? "atencao" : (a.categoria === "Grãos" || a.categoria === "Outros") ? "baixo" : "moderado";
console.log(JSON.stringify(ALIMENTOS.map((a) => {
  const m = metodoLimpeza(a.categoria);
  return { slug: slug(a.nome), nome: a.nome, categoria: a.categoria, emoji: a.emoji, imagem_url: foodImage(a.nome), nivel_atencao: nivel(a), descricao: a.rank,
    defensivos: a.agrotoxicos, riscos: a.riscos,
    saiba_mais: `Destaque nos relatórios consultados: ${a.rank}. A atenção com este alimento envolve procedência, higienização, preparo e armazenamento.`,
    cuidados_texto: `${m.titulo}: ${m.passos.join(" ")} ${m.observacao}`,
    fontes: ["Anvisa — Programa de Análise de Resíduos de Agrotóxicos em Alimentos (PARA)", m.fonte] };
})));
