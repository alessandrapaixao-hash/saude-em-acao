## 1. Renomear para "Área Kids" e mover para o fim do menu

Em `src/components/SiteLayout.tsx`, no array `NAV`:
- Reordenar para: Saúde em Ação · Alimentos · Quiz · Informe-se! · **Área Kids** (último).
- Trocar o label de "Crianças" para "Área Kids".

A rota continua `/criancas` (mudar o slug exigiria refatorar `routeTree.gen.ts`/arquivo). O link no menu apenas usa o novo label.

Em `src/routes/_site.criancas.tsx`: atualizar `<title>`, meta description e `og:title` para "Área Kids — Saúde em Ação".

## 2. Nova seção de jogos na Área Kids

Logo abaixo do trailer (e acima de "Próximos episódios"), adicionar bloco "Jogos para brincar e aprender" com 4 botões grandes coloridos, cada um com um ícone ilustrativo (lucide-react) coerente com o jogo:

| Botão | Ícone | Link |
|---|---|---|
| Jogo da Memória | `Brain` | https://learningapps.org/view52003284 |
| Desembaralhe | `Shuffle` | https://wordwall.net/resource/114702835 |
| Caça-palavras | `Search` | https://learningapps.org/view52003825 |
| Forca | `Type` | https://learningapps.org/view52021417 |

Layout: grid responsivo 2x2, botões grandes (cards clicáveis) com gradiente, ícone grande no topo e nome do jogo. Todos os links abrem na **mesma aba** (`<a href=... >` sem `target="_blank"`).

## 3. Botões finais (rodapé da Área Kids)

Após a seção de episódios, adicionar dois CTAs lado a lado, bem visuais:

- **"Conheça nosso canal no YouTube"** — ícone `Youtube` (vermelho), link https://www.youtube.com/channel/UCT9joOAoMPjdDl56IaXhlUg
- **"Jogue: Guardiões do Prato Vs Turma da Contaminação"** — ícone `Gamepad2`, link https://saude-em-acao.base44.app

Mesma aba.

## 4. Corrigir imagens (maracujá e rúcula)

Em `src/routes/_site.alimentos.tsx`, trocar as URLs do Wikimedia que não carregam por URLs verificadas e estáveis:

- "Maracujá" → `https://images.unsplash.com/photo-1604495772376-9657f0035eb5?auto=format&fit=crop&w=800&q=80` (passion fruit)
- "Rúcula" → `https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80` (arugula)

Se necessário, fallback para `loremflickr.com/800/600/<termo>?lock=N`.

## Arquivos alterados
- `src/components/SiteLayout.tsx` — ordem e label do menu.
- `src/routes/_site.criancas.tsx` — título, jogos, botões finais.
- `src/routes/_site.alimentos.tsx` — 2 URLs de imagem.
