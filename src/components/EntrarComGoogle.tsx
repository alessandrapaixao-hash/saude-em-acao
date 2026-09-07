import { useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { guardarDestinoPosLogin, limparDestinoPosLogin } from "@/lib/pos-login";

export function EntrarComGoogle({
  titulo = "Entre para acompanhar seu dia",
  descricao = "Registre suas refeições, acompanhe seus cuidados e conquiste pontos no Saúde em Ação.",
}: {
  titulo?: string;
  descricao?: string;
}) {
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setCarregando(true);
    guardarDestinoPosLogin(window.location.pathname);
    const resultado = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (resultado.error) {
      setCarregando(false);
      limparDestinoPosLogin();
      toast.error("Não foi possível entrar agora. Tente novamente.");
      return;
    }
    if (resultado.redirected) return;
    // Login por janela: a sessão já está pronta, seguimos na mesma página.
    limparDestinoPosLogin();
    setCarregando(false);
  }

  return (
    <div className="max-w-md mx-auto text-center bg-card border border-border rounded-3xl p-8 shadow-sm">
      <div className="text-4xl">🌱</div>
      <h2 className="mt-3 font-display text-2xl font-bold text-primary">{titulo}</h2>
      <p className="mt-2 text-sm text-foreground/75">{descricao}</p>
      <button
        onClick={entrar}
        disabled={carregando}
        className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 hover:opacity-90 transition disabled:opacity-60"
      >
        {carregando ? "Abrindo…" : "Continuar com Google"}
      </button>
      <p className="mt-4 text-xs text-muted-foreground">
        Usamos sua conta apenas para guardar seu progresso com segurança.
      </p>
    </div>
  );
}
