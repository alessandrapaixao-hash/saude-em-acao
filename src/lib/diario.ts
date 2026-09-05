import { supabase } from "@/integrations/supabase/client";
import { PONTOS, REFEICOES, type TipoRefeicao } from "@/lib/pontos";

export type Alimento = {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  emoji: string | null;
  imagem_url: string | null;
  nivel_atencao: string;
  descricao: string | null;
  defensivos: string[];
  riscos: string[];
  saiba_mais: string | null;
  cuidados_texto: string | null;
  fontes: string[];
};

export type Cuidado = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  pontos: number;
  ordem: number;
};

export type Consumo = {
  id: string;
  alimento: Alimento;
  cuidados: string[];
};

export type Refeicao = {
  id: string | null;
  tipo: TipoRefeicao;
  nome: string;
  icone: string;
  status: "pendente" | "registrada" | "nao-faco";
  consumos: Consumo[];
};

export async function listarAlimentos(): Promise<Alimento[]> {
  const { data, error } = await supabase
    .from("alimentos")
    .select("*")
    .eq("ativo", true)
    .order("nome");
  if (error) throw error;
  return (data ?? []) as Alimento[];
}

export async function listarCuidados(): Promise<Cuidado[]> {
  const { data, error } = await supabase
    .from("cuidados")
    .select("id,slug,nome,descricao,pontos,ordem")
    .eq("ativo", true)
    .order("ordem");
  if (error) throw error;
  return (data ?? []) as Cuidado[];
}

export async function carregarDia(dia: string): Promise<Refeicao[]> {
  const { data, error } = await supabase
    .from("refeicoes")
    .select("id,tipo,status,alimentos_consumidos(id,alimentos(*),cuidados_realizados(cuidado_id))")
    .eq("dia", dia);
  if (error) throw error;

  return REFEICOES.map((base) => {
    const registro = (data ?? []).find((r) => r.tipo === base.tipo);
    const consumos: Consumo[] = ((registro?.alimentos_consumidos ?? []) as any[])
      .filter((c) => c.alimentos)
      .map((c) => ({
        id: c.id as string,
        alimento: c.alimentos as Alimento,
        cuidados: ((c.cuidados_realizados ?? []) as { cuidado_id: string }[]).map((x) => x.cuidado_id),
      }));
    return {
      id: (registro?.id as string) ?? null,
      tipo: base.tipo,
      nome: base.nome,
      icone: base.icone,
      status: ((registro?.status as Refeicao["status"]) ?? "pendente"),
      consumos,
    };
  });
}

export async function pontosDoDia(dia: string) {
  const { data, error } = await supabase.from("pontos").select("quantidade").eq("dia", dia);
  if (error) throw error;
  return (data ?? []).reduce((t, p) => t + p.quantidade, 0);
}

async function garantirRefeicao(userId: string, dia: string, tipo: TipoRefeicao) {
  const { data: existente } = await supabase
    .from("refeicoes")
    .select("id")
    .eq("dia", dia)
    .eq("tipo", tipo)
    .maybeSingle();
  if (existente) return existente.id as string;

  const { data, error } = await supabase
    .from("refeicoes")
    .insert({ user_id: userId, dia, tipo })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function creditar(
  userId: string,
  dia: string,
  chave: string,
  quantidade: number,
  motivo: string,
  extras: { refeicao_id?: string; consumo_id?: string } = {},
) {
  if (quantidade <= 0) return;
  await supabase
    .from("pontos")
    .upsert({ user_id: userId, dia, chave, quantidade, motivo, ...extras }, { onConflict: "user_id,chave", ignoreDuplicates: true });
}

async function retirar(chave: string) {
  await supabase.from("pontos").delete().eq("chave", chave);
}

export async function definirStatus(
  userId: string,
  dia: string,
  tipo: TipoRefeicao,
  status: "pendente" | "registrada" | "nao-faco",
) {
  const id = await garantirRefeicao(userId, dia, tipo);
  const { error } = await supabase
    .from("refeicoes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  await avaliarDiaCompleto(userId, dia);
  return id;
}

export async function adicionarAlimento(userId: string, dia: string, tipo: TipoRefeicao, alimentoId: string) {
  const refeicaoId = await garantirRefeicao(userId, dia, tipo);
  const { data, error } = await supabase
    .from("alimentos_consumidos")
    .insert({ user_id: userId, refeicao_id: refeicaoId, alimento_id: alimentoId })
    .select("id")
    .single();
  if (error) throw error;

  await supabase.from("refeicoes").update({ status: "registrada" }).eq("id", refeicaoId);
  await creditar(userId, dia, `refeicao:${refeicaoId}`, PONTOS.refeicaoRegistrada, "Refeição registrada", {
    refeicao_id: refeicaoId,
  });
  await creditar(userId, dia, `alimento:${data.id}`, PONTOS.alimentoRegistrado, "Alimento registrado", {
    refeicao_id: refeicaoId,
    consumo_id: data.id as string,
  });
  await avaliarDiaCompleto(userId, dia);
  return data.id as string;
}

export async function removerConsumo(consumoId: string) {
  await retirar(`alimento:${consumoId}`);
  const { error } = await supabase.from("alimentos_consumidos").delete().eq("id", consumoId);
  if (error) throw error;
}

export async function salvarCuidados(
  userId: string,
  dia: string,
  consumoId: string,
  selecionados: Cuidado[],
  todos: Cuidado[],
) {
  const idsSelecionados = new Set(selecionados.map((c) => c.id));
  const remover = todos.filter((c) => !idsSelecionados.has(c.id));

  if (remover.length) {
    await supabase
      .from("cuidados_realizados")
      .delete()
      .eq("consumo_id", consumoId)
      .in("cuidado_id", remover.map((c) => c.id));
    for (const c of remover) await retirar(`cuidado:${consumoId}:${c.id}`);
  }

  if (selecionados.length) {
    await supabase.from("cuidados_realizados").upsert(
      selecionados.map((c) => ({ user_id: userId, consumo_id: consumoId, cuidado_id: c.id, dia })),
      { onConflict: "consumo_id,cuidado_id", ignoreDuplicates: true },
    );
    for (const c of selecionados) {
      await creditar(userId, dia, `cuidado:${consumoId}:${c.id}`, c.pontos, `Cuidado: ${c.nome}`, {
        consumo_id: consumoId,
      });
    }
  }
}

async function avaliarDiaCompleto(userId: string, dia: string) {
  const { data } = await supabase.from("refeicoes").select("status").eq("dia", dia);
  const decididas = (data ?? []).filter((r) => r.status !== "pendente").length;
  if (decididas >= REFEICOES.length) {
    await creditar(userId, dia, `dia-completo:${dia}`, PONTOS.diaCompleto, "Dia completo organizado");
  } else {
    await retirar(`dia-completo:${dia}`);
  }
}

export type ResumoPerfil = {
  pontosTotais: number;
  sequencia: number;
  diasRegistrados: string[];
  refeicoesRegistradas: number;
  cuidadosRealizados: number;
  indiceMedio: number | null;
};

export async function carregarPerfil(cuidadosDisponiveis: number): Promise<ResumoPerfil> {
  const [pontosRes, refeicoesRes, cuidadosRes, consumosRes] = await Promise.all([
    supabase.from("pontos").select("quantidade,dia"),
    supabase.from("refeicoes").select("dia,status"),
    supabase.from("cuidados_realizados").select("id,dia"),
    supabase.from("alimentos_consumidos").select("id,refeicoes(dia)"),
  ]);

  const pontosTotais = (pontosRes.data ?? []).reduce((t, p) => t + p.quantidade, 0);
  const refeicoesRegistradas = (refeicoesRes.data ?? []).filter((r) => r.status === "registrada").length;
  const cuidadosRealizados = (cuidadosRes.data ?? []).length;

  const dias = Array.from(new Set((refeicoesRes.data ?? []).map((r) => r.dia))).sort();

  // sequência de dias consecutivos até hoje
  let sequencia = 0;
  const hoje = new Date();
  for (let i = 0; ; i += 1) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const iso = d.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    if (dias.includes(iso)) sequencia += 1;
    else if (i > 0) break;
    else if (!dias.includes(iso)) break;
  }

  const totalConsumos = (consumosRes.data ?? []).length;
  const indiceMedio =
    totalConsumos > 0 && cuidadosDisponiveis > 0
      ? Math.min(100, Math.round((cuidadosRealizados / (totalConsumos * cuidadosDisponiveis)) * 100))
      : null;

  return { pontosTotais, sequencia, diasRegistrados: dias, refeicoesRegistradas, cuidadosRealizados, indiceMedio };
}
