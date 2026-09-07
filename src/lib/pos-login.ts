const CHAVE = "sea:destino-pos-login";

/** Guarda apenas caminhos internos do próprio site. */
export function guardarDestinoPosLogin(caminho: string) {
  if (typeof window === "undefined") return;
  if (!caminho.startsWith("/") || caminho.startsWith("//")) return;
  window.sessionStorage.setItem(CHAVE, caminho);
}

export function lerDestinoPosLogin(): string | null {
  if (typeof window === "undefined") return null;
  const valor = window.sessionStorage.getItem(CHAVE);
  if (!valor || !valor.startsWith("/") || valor.startsWith("//")) return null;
  return valor;
}

export function limparDestinoPosLogin() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHAVE);
}
