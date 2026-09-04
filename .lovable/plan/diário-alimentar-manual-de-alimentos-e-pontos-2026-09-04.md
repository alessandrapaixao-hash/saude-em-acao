# Diário Alimentar, Manual de Alimentos e Pontos

## O que já existe hoje (análise)

- O site tem 5 páginas: Saúde em Ação (início), Alimentos, Quiz, Informe-se! e Área Kids.
- Todas usam o mesmo cabeçalho, menu e rodapé (um único arquivo de layout), com as cores, fontes e o estilo aquarela do projeto.
- A página Alimentos já tem 60 alimentos com foto, categoria, defensores agrícolas mais encontrados, riscos e método de higienização, com as fontes do projeto.
- **Não existe banco de dados nem login hoje.** Tudo é conteúdo fixo dentro do site. Mas usarei o conteúdo do site para alimentar a aba "Meu dia"

Consequência: para salvar o diário de cada pessoa é preciso que o usuário se concete a sua conta do Google para que seu progresso seja salvo. Nada do que já existe é substituído.

## Como vou implementar sem quebrar nada

Só acrescento páginas e itens novos no menu. As páginas atuais continuam exatamente como estão; a única mudança nelas é um cartãozinho "Como está seu dia?" na página inicial, acima do conteúdo já existente.

Menu final (mantendo os nomes atuais):  
Saúde em Ação · Alimentos  · Meu Dia · Meu Perfil · Quiz · Informe-se! · Área Kids

## Etapas

1. **Banco de dados e login** — ligar a conta do Google e proteger os dados para que cada pessoa só veja os próprios registros.
2. **Base de alimentos** — uma única base usada pelo Manual e pelo Diário, criada a partir dos 60 alimentos que já estão no site (foto, categoria, cuidados, fontes). O nível de atenção (verde/amarelo/laranja/vermelho) vem da posição do alimento nas listas da Anvisa/IDEC já citadas, sempre com o aviso de que é orientativo e nunca em porcentagem. Onde não houver fonte confiável, o campo fica vazio para a equipe preencher depois.
3. **Meu Dia** — os cinco momentos do dia em cartões, cada um com "Adicionar alimento", "Não faço essa refeição" (sem qualquer penalidade), alimentos registrados e pontos.
4. **Ficha do alimento** —  imagem, nível de atenção, "O que você precisa saber?", "Como cuidar?" e "Fontes".
5. **Cuidados e pontos** — lista de ações para marcar só o que a pessoa realmente fez; pontos só pelas ações marcadas, sem repetir pontos pela mesma ação. Os valores dos pontos ficam num único arquivo de configuração, fácil de mudar depois.
6. **Índice de Cuidado e Resumo do dia** — painel no fim da página Meu Dia, sempre com linguagem acolhedora, nunca julgando a alimentação.
7. **Meu Perfil** — "Minha jornada" com pontos totais, sequência de dias, índice médio, refeições e cuidados; níveis (Começando a Cuidar → Guardião do Prato) e conquistas.
8. **Histórico** — calendário para consultar dias anteriores.
9. **Acabamento** — animações curtas ao ganhar pontos, teste no celular e no computador, e conferência de que todas as páginas antigas continuam iguais.

## Detalhes técnicos

- Tabelas: `foods`, `safety_actions`, `meals`, `consumed_foods`, `completed_actions`, `user_points`, `achievements`, `user_achievements`, `profiles`, `user_roles`. Todas com regras de acesso por usuário (RLS) e permissões explícitas.
- Chave única (usuário + dia + refeição) e (usuário + refeição + alimento + ação) para impedir pontos duplicados.
- Alimentos e ações de cuidado são gravados no banco por migração, a partir do conteúdo já presente em `_site.alimentos.tsx`.
- Páginas do diário e do perfil ficam sob rota protegida.
- Leitura e escrita via server functions com o login do usuário; nada de chave secreta no navegador.
- Área administrativa "Gerenciar alimentos" limitada a quem tiver papel de administrador (tabela de papéis separada).