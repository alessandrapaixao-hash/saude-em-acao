import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, User, UtensilsCrossed } from "lucide-react";
import { useSessao } from "@/hooks/use-sessao";
import { supabase } from "@/integrations/supabase/client";
import { guardarDestinoPosLogin, limparDestinoPosLogin } from "@/lib/pos-login";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0]![0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]![0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

export function MenuPerfil() {
  const { usuario, carregando } = useSessao();
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (carregando) {
    return <div className="w-9 h-9 rounded-full bg-secondary animate-pulse" aria-hidden />;
  }

  if (!usuario) {
    return (
      <button
        aria-label="Entrar"
        title="Entrar"
        onClick={async () => {
          guardarDestinoPosLogin(window.location.pathname);
          const r = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });
          if (r.error) {
            limparDestinoPosLogin();
            toast.error("Não foi possível entrar agora. Tente novamente.");
          }
        }}
        className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground/80 hover:border-primary hover:text-primary transition"
      >
        <LogIn className="w-4 h-4" />
      </button>
    );
  }

  const nome =
    (usuario.user_metadata?.["full_name"] as string | undefined) ||
    (usuario.user_metadata?.["name"] as string | undefined) ||
    usuario.email ||
    "Você";
  const foto = usuario.user_metadata?.["avatar_url"] as string | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu do perfil"
          className="w-9 h-9 rounded-full overflow-hidden bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition"
        >
          {foto ? (
            <img src={foto} alt={nome} className="w-full h-full object-cover" />
          ) : (
            iniciais(nome)
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{nome}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: "/meu-perfil" })}>
          <User className="w-4 h-4" /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/meu-dia" })}>
          <UtensilsCrossed className="w-4 h-4" /> Meu Dia
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await qc.cancelQueries();
            qc.clear();
            await supabase.auth.signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="w-4 h-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
