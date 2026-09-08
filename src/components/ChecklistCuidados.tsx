import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Cuidado } from "@/lib/diario";

export function ChecklistCuidados({
  cuidados,
  selecionados,
  onSalvar,
  compacto = false,
}: {
  cuidados: Cuidado[];
  selecionados?: string[];
  onSalvar: (ids: string[]) => Promise<void> | void;
  compacto?: boolean;
}) {
  const [marcados, setMarcados] = useState<string[]>(selecionados ?? []);
  const [salvando, setSalvando] = useState(false);
  const [ganho, setGanho] = useState<number | null>(null);

  useEffect(() => {
    setMarcados(selecionados ?? []);
  }, [selecionados]);

  function alternar(id: string) {
    setMarcados((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));
  }

  const pontosPossiveis = cuidados.filter((c) => marcados.includes(c.id)).reduce((t, c) => t + c.pontos, 0);

  return (
    <section
      className={`relative rounded-2xl border-2 border-primary/60 bg-primary/10 shadow-[0_2px_12px_color-mix(in_oklab,var(--primary)_18%,transparent)] ${
        compacto ? "p-3.5" : "p-4"
      }`}
    >
      {ganho !== null && (
        <span
          key={ganho}
          className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 z-10 rounded-full bg-primary text-primary-foreground font-bold text-sm px-4 py-1.5 shadow-lg animate-[pontos-sobe_1.4s_ease-out_forwards]"
        >
          🌱 +{ganho} pontos
        </span>
      )}

      <h4
        className={`font-display font-bold text-primary flex items-center gap-2 ${compacto ? "text-base" : "text-lg"}`}
      >
        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">
          ✅
        </span>
        O que você fez?
      </h4>
      <p className="mt-1.5 text-xs font-semibold text-foreground/80">
        Marque aqui embaixo as ações de higienização e cuidado que você realizou. Nada aqui é obrigatório.
      </p>

      <div className="mt-3 space-y-2">
        {cuidados.map((c) => {
          const ativo = marcados.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => alternar(c.id)}
              className={`w-full text-left flex items-start gap-3 rounded-xl border p-3 transition active:scale-[0.99] ${
                ativo ? "border-primary bg-primary/10 animate-[cuidado-pulsa_0.4s_ease-out]" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                  ativo ? "bg-primary border-primary text-primary-foreground scale-110" : "border-border"
                }`}
              >
                {ativo && <Check className="w-3.5 h-3.5" />}
              </span>
              <span>
                <span className="block text-sm font-semibold">{c.nome}</span>
                {c.descricao && <span className="block text-xs text-muted-foreground">{c.descricao}</span>}
              </span>
              <span className="ml-auto text-xs font-bold text-primary shrink-0">+{c.pontos}</span>
            </button>
          );
        })}
      </div>

      <button
        disabled={salvando}
        onClick={async () => {
          setSalvando(true);
          await onSalvar(marcados);
          setSalvando(false);
          if (pontosPossiveis > 0) {
            setGanho(pontosPossiveis);
            setTimeout(() => setGanho(null), 1500);
          }
        }}
        className="mt-4 w-full rounded-full bg-primary text-primary-foreground font-semibold py-2.5 hover:opacity-90 transition disabled:opacity-60"
      >
        {salvando ? "Salvando…" : `Salvar cuidados 🌱 ${pontosPossiveis} pts`}
      </button>
    </section>
  );
}
