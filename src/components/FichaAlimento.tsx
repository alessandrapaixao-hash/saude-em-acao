import { AlertCircle, BookOpen } from "lucide-react";
import type { Alimento, Cuidado } from "@/lib/diario";
import { ChecklistCuidados } from "@/components/ChecklistCuidados";
import { AVISO_CLASSIFICACAO, AVISO_HIGIENIZACAO, NIVEL_ATENCAO } from "@/lib/pontos";

export function SeloAtencao({ nivel }: { nivel: string }) {
  const info = NIVEL_ATENCAO[nivel] ?? NIVEL_ATENCAO["moderado"]!;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: `color-mix(in oklab, ${info.cor} 22%, var(--card))`, color: "var(--foreground)" }}
    >
      {info.emoji} {info.rotulo}
    </span>
  );
}

export function FichaAlimento({
  alimento,
  cuidados,
  selecionados,
  onSalvar,
}: {
  alimento: Alimento;
  cuidados: Cuidado[];
  selecionados?: string[];
  onSalvar?: (ids: string[]) => Promise<void> | void;
}) {
  const nivelElevado = alimento.nivel_atencao === "atencao" || alimento.nivel_atencao === "maior";

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-start">
        {alimento.imagem_url && (
          <img
            src={alimento.imagem_url}
            alt={alimento.nome}
            loading="lazy"
            className="w-28 h-28 rounded-2xl object-cover border border-border shrink-0"
          />
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{alimento.categoria}</div>
          <h3 className="font-display text-2xl font-bold text-primary">
            {alimento.emoji} {alimento.nome}
          </h3>
          <div className="mt-2">
            <SeloAtencao nivel={alimento.nivel_atencao} />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground bg-secondary/60 rounded-2xl p-3 leading-relaxed">
        {AVISO_CLASSIFICACAO}
      </p>

      <section>
        <h4 className="font-display text-lg font-bold text-primary">O que você precisa saber?</h4>
        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{alimento.saiba_mais}</p>
        {alimento.defensivos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {alimento.defensivos.map((d) => (
              <span key={d} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                {d}
              </span>
            ))}
          </div>
        )}
        {alimento.riscos.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {alimento.riscos.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-foreground/80">
                <AlertCircle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="font-display text-lg font-bold text-primary">
          Como reduzir a exposição e cuidar melhor desse alimento?
        </h4>
        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{alimento.cuidados_texto}</p>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{AVISO_HIGIENIZACAO}</p>
      </section>

      {nivelElevado && cuidados.length > 0 && (
        <section className="rounded-2xl border-2 border-[var(--sun)]/60 bg-[var(--sun)]/10 p-4">
          <h4 className="font-display text-lg font-bold text-primary">
            🛡️ Medidas para reduzir os riscos
          </h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Por estar no nível <strong>{NIVEL_ATENCAO[alimento.nivel_atencao]?.rotulo ?? "Atenção"}</strong>, este
            alimento pede um cuidado extra. Siga estas medidas sempre que possível:
          </p>
          <ol className="mt-3 space-y-2">
            {cuidados.map((c, i) => (
              <li key={c.id} className="flex gap-2.5 text-sm text-foreground/85">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>
                  <span className="font-semibold">{c.nome}.</span>{" "}
                  {c.descricao && <span className="text-foreground/75">{c.descricao}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {onSalvar && (
        <ChecklistCuidados cuidados={cuidados} selecionados={selecionados} onSalvar={onSalvar} />
      )}


      {alimento.fontes.length > 0 && (
        <section className="border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <BookOpen className="w-4 h-4" /> 📚 Fontes
          </div>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground leading-relaxed">
            {alimento.fontes.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
