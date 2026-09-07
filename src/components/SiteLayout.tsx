import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Leaf, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MenuPerfil } from "@/components/MenuPerfil";
import { useSessao } from "@/hooks/use-sessao";
import { lerDestinoPosLogin, limparDestinoPosLogin } from "@/lib/pos-login";

const NAV = [
  { to: "/", label: "Saúde em Ação" },
  { to: "/alimentos", label: "Alimentos" },
  { to: "/meu-dia", label: "Meu Dia" },
  { to: "/jogo", label: "Quiz" },
  { to: "/informe-se", label: "Informe-se!" },
  { to: "/criancas", label: "Área Kids" },
] as const;

/** Depois do login com Google, volta para a página que a pessoa queria abrir. */
function useVoltarAoDestino() {
  const { usuario } = useSessao();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!usuario) return;
    const destino = lerDestinoPosLogin();
    if (!destino) return;
    limparDestinoPosLogin();
    if (destino !== pathname) navigate({ to: destino, replace: true });
  }, [usuario, pathname, navigate]);
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useVoltarAoDestino();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Saúde em Ação" className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-105 transition" />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-primary">Saúde em Ação</div>
              <div className="text-[11px] text-muted-foreground -mt-0.5">ODS 3 · Alimentação consciente</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 rounded-full text-[13px] font-semibold transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-4 py-2 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                    pathname === n.to ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border mt-16 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-primary text-lg">
              <Leaf className="w-5 h-5" /> Saúde em Ação
            </div>
            <p className="mt-2 text-muted-foreground">
              Projeto educativo alinhado à ODS 3 — Saúde e Bem-Estar — sobre os
              riscos dos defensores agrícolas nos alimentos.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">Navegue</div>
            <ul className="space-y-1 text-muted-foreground">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-primary">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Inspirado em</div>
            <p className="text-muted-foreground">
              Dados públicos de Anvisa, INCA, IDEC, Ministério da Saúde e
              UFMG. Conteúdo com fim educativo.
            </p>
          </div>
        </div>
        <div className="border-t border-border/60 mt-4 pt-5 pb-6 text-center">
          <p className="text-sm font-semibold text-primary">
            Feito por Alessandra Paixão e Lara Breda
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © {new Date().getFullYear()} Saúde em Ação · Projeto educativo ODS 3
          </p>
        </div>
      </footer>
    </div>
  );
}
