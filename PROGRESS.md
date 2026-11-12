# LiteLaunch — Mapa de Estrada

SaaS Boilerplate ultra-leve e modular: Next.js (App Router) · TypeScript strict · Clerk · Supabase · Tailwind CSS + shadcn/ui · Lemon Squeezy · Resend.

**Como usar este ficheiro:** cada subtópico é uma checkbox. `[ ]` = por fazer, `[x]` = feito e validado. Uma fase só fecha quando todas as suas checkboxes estão marcadas, incluindo a validação (`lint`, `typecheck`, `build`) e a atualização do [DOCUMENTATION.md](./DOCUMENTATION.md).

## Estado geral

| Fase | Tema | Estado |
| --- | --- | --- |
| 0 | Inicialização do projeto e plano de trabalho | 🟢 Concluída |
| 1 | Estrutura base, TypeScript, Dark Mode e i18n core | 🟢 Concluída |
| 2 | Autenticação gerida e sincronização de estado (Clerk) | ⚪ Por iniciar |
| 3 | Infraestrutura de dados ultra-leve (Supabase) | ⚪ Por iniciar |
| 4 | Faturação segura e webhooks (Lemon Squeezy) | ⚪ Por iniciar |
| 5 | SEO, performance, ficheiros ambientais e polimento | ⚪ Por iniciar |

Legenda: ⚪ por iniciar · 🟡 em curso · 🟢 concluída

---

## FASE 0 — Inicialização do Projeto e Plano de Trabalho

- [x] Criar a estrutura de pastas base (sem código da aplicação)
- [x] Criar `PROGRESS.md` com o plano detalhado das 5 fases
- [x] Criar `DOCUMENTATION.md` com a arquitetura e o esqueleto dos guias de configuração
- [x] Validar o plano e as decisões em aberto com o utilizador

---

## FASE 1 — Estrutura Base, Configuração TypeScript, Dark Mode & i18n Core

### 1.1 Next.js + Tailwind + shadcn/ui

- [x] Criar `package.json` e instalar Next.js, React e TypeScript com pnpm (instalação manual, porque a pasta já não está vazia)
- [x] `tsconfig.json` em Strict Mode (`strict`, `noUncheckedIndexedAccess`) com o alias `@/*` → `src/*`
- [x] ESLint com `@typescript-eslint/no-explicit-any` como erro
- [x] Tailwind CSS (configuração CSS-first em `src/app/globals.css`)
- [x] Inicializar shadcn/ui e adicionar apenas os componentes necessários (`Button`, `DropdownMenu`)
- [x] `.gitignore` (inclui `.env*` exceto `.env.example`)
- [x] Scripts `dev`, `build`, `start`, `lint`, `typecheck`

### 1.2 Dark Mode

- [x] `ThemeProvider` (`next-themes`) no layout raiz: `attribute="class"`, tema do sistema por omissão
- [x] Componente `ThemeToggle` (claro / escuro / sistema)
- [x] Confirmar que não há flash de tema nem avisos de hidratação

### 1.3 i18n Core (next-intl)

- [x] `src/i18n/routing.ts`: `locales` (`en`, `pt-PT`), `defaultLocale` (`en`), prefixo `/pt` para o `pt-PT`, tipo `Locale` e nomes dos idiomas
- [x] Dicionários `en.json` e `pt-PT.json` em `src/i18n/dictionaries/`
- [x] `src/i18n/request.ts` e `src/types/i18n.d.ts`: mensagens tipadas, com erro de compilação se faltar uma chave num dicionário
- [x] `src/proxy.ts`: deteção do idioma (`Accept-Language` e cookie) e redirecionamento para `/[locale]/...`
- [x] `src/app/[locale]/layout.tsx`: `<html lang>`, `generateStaticParams`, 404 para locales inválidos
- [x] Componente `LocaleSwitcher` que preserva o caminho atual, a query string e a âncora

### 1.4 Landing Page Base

- [x] Layout de marketing (header + footer) em `src/app/[locale]/(marketing)/`
- [x] Secções: hero, funcionalidades, preços e CTA
- [x] Botões dos planos a apontar para `/sign-up` (a página chega na Fase 2; até lá mostram o 404 localizado)
- [x] Botões de alternância de tema e de idioma no header
- [x] Menu de navegação para ecrãs pequenos
- [x] Página 404 localizada para URLs inexistentes, com código HTTP 404
- [x] Todo o texto vem dos dicionários (zero strings fixas nos componentes)

### 1.5 Fecho da fase

- [x] `lint`, `typecheck` e `build` sem erros
- [x] Validação no browser: redirecionamento por idioma, troca de tema e de idioma, consola sem erros
- [x] Atualizar `DOCUMENTATION.md` (instalação, Dark Mode, i18n, como adicionar um idioma)

---

## FASE 2 — Autenticação Gerida & Sincronização de Estado

Clerk + proteção de rotas. A sincronização com a base de dados é implementada na Fase 3 (3.2), porque depende do Supabase.

### 2.1 Integração do Clerk com `/[locale]`

- [ ] Criar a aplicação no Clerk e definir as chaves em `.env.local`
- [ ] `ClerkProvider` no layout `[locale]`, com a localização do Clerk a acompanhar o idioma ativo
- [ ] Páginas `/[locale]/sign-in` e `/[locale]/sign-up` em `src/app/[locale]/(auth)/`
- [ ] Redirecionamentos pós-login e pós-logout que preservam o locale
- [ ] Header com estado de sessão (entrar / ir para o dashboard / menu do utilizador)
- [ ] Ligar os CTAs "Começar" do hero e da secção final ao sign-up (os botões dos planos já apontam para lá)

### 2.2 Compatibilidade com `cacheComponents`

O layout raiz e o header são hoje totalmente estáticos. A sessão só existe no momento do pedido, por isso não pode entrar nesse shell.

- [ ] Confirmar na documentação do Clerk como colocar o `ClerkProvider` com `cacheComponents` ativo, antes de o adicionar ao layout raiz
- [ ] Toda a UI que depende da sessão fica atrás de `<Suspense>`, com um fallback do mesmo tamanho para o header não saltar
- [ ] Ler a sessão (`auth()`) só em componentes dinâmicos, nunca dentro de uma função com `use cache`
- [ ] Logout com navegação completa, para limpar o estado das rotas que o Next.js mantém em memória
- [ ] Confirmar no build que `/en` e `/pt-PT` continuam pré-renderizadas como estáticas

### 2.3 Proteção de rotas privadas

- [ ] Compor o Clerk e o i18n num único `src/proxy.ts`
- [ ] Proteger `/[locale]/dashboard/**` e redirecionar visitantes para o sign-in no idioma certo
- [ ] Layout base do dashboard com dados do utilizador autenticado
- [ ] Segunda verificação de sessão no servidor (o proxy não é a única barreira)

### 2.4 Fecho da fase

- [ ] `lint`, `typecheck` e `build` sem erros
- [ ] Atualizar `DOCUMENTATION.md` (configuração do Clerk passo a passo)

---

## FASE 3 — Infraestrutura de Dados Ultra-Leve

Supabase SDK + tabelas de utilizadores e subscrições + Server Actions. O Clerk é o fornecedor de autenticação do Supabase: cada pedido leva o token da sessão e o acesso é limitado por políticas RLS por utilizador.

### 3.1 Cliente Supabase e tabelas

- [ ] Criar o projeto no Supabase e definir as chaves em `.env.local`
- [ ] Configurar o Clerk como fornecedor de autenticação de terceiros no Supabase
- [ ] Clientes Supabase em `src/lib/supabase/`: servidor e browser (ambos com o token da sessão do Clerk) e administrador server-only (chave secreta, para webhooks)
- [ ] Migração SQL em `supabase/migrations/`: tabelas `users` e `subscriptions`, índices e políticas RLS por utilizador
- [ ] Tipos da base de dados em `src/types/database.ts` e clientes tipados com `Database`

### 3.2 Sincronização de utilizadores

- [ ] Server Action `syncUser`: upsert idempotente a partir da sessão do Clerk
- [ ] Executar a sincronização na entrada do dashboard
- [ ] Dashboard a ler o perfil e o estado da subscrição a partir da base de dados

### 3.3 E-mail de boas-vindas

- [ ] Cliente Resend em `src/lib/resend.ts` e template React Email em `src/emails/`
- [ ] Enviar o e-mail de boas-vindas apenas na primeira sincronização

### 3.4 Fecho da fase

- [ ] `lint`, `typecheck` e `build` sem erros
- [ ] Atualizar `DOCUMENTATION.md` (configuração do Supabase e do Resend, esquema de dados)

---

## FASE 4 — Integração de Faturação Segura & Webhooks

Lemon Squeezy + rota de webhook com assinatura criptográfica + fluxo de checkout.

### 4.1 Checkout

- [ ] Criar loja, produto e variantes no Lemon Squeezy; definir as chaves em `.env.local`
- [ ] Cliente Lemon Squeezy server-only em `src/lib/lemonsqueezy.ts`
- [ ] Server Action `createCheckout` que associa o checkout ao utilizador autenticado
- [ ] Ligar os botões da secção de preços ao checkout

### 4.2 Webhook seguro

- [ ] Route Handler `src/app/api/webhooks/lemonsqueezy/route.ts`
- [ ] Validar a assinatura HMAC SHA-256 (`X-Signature`) sobre o corpo em bruto, com comparação em tempo constante
- [ ] Tipar os payloads dos eventos de subscrição
- [ ] Tratar criação, atualização, cancelamento e expiração com upsert idempotente em `subscriptions`
- [ ] Excluir `/api/webhooks/**` do i18n e da autenticação no `proxy.ts`

### 4.3 Gestão da subscrição

- [ ] Página de faturação no dashboard: plano atual, estado e link para o portal do cliente
- [ ] Helper server-side para verificar o plano ativo
- [ ] E-mail de confirmação de subscrição (Resend)

### 4.4 Fecho da fase

- [ ] Testar o fluxo completo em modo de teste (checkout → webhook → base de dados → dashboard)
- [ ] `lint`, `typecheck` e `build` sem erros
- [ ] Atualizar `DOCUMENTATION.md` (configuração do Lemon Squeezy, teste local de webhooks)

---

## FASE 5 — SEO, Otimização de Performance, Ficheiros Ambientais e Polimento Final

### 5.1 Ficheiros ambientais

- [ ] `.env.example` completo e comentado (preenchido a partir da Fase 2, fechado aqui)
- [ ] Validação tipada das variáveis de ambiente no arranque, sem dependências extra

### 5.2 SEO internacional

- [ ] `generateMetadata` por locale: título, descrição, canonical e `alternates.languages` (hreflang)
- [ ] Open Graph e Twitter Cards localizados
- [ ] `sitemap.ts` e `robots.ts` com todas as rotas públicas por locale
- [ ] Página `error` localizada (a `not-found` foi feita na Fase 1)

### 5.3 Performance

- [ ] Fontes com `next/font` e imagens com `next/image`
- [ ] Auditoria de `"use client"`: Server Components por omissão
- [ ] Auditoria Lighthouse (performance, acessibilidade, SEO) nos dois idiomas e nos dois temas

### 5.4 Polimento final

- [ ] Revisão final do `DOCUMENTATION.md`: guia de arranque em menos de 5 minutos e deploy
- [ ] `lint`, `typecheck` e `build` sem erros
- [ ] Remover os `.gitkeep` que já não são necessários
- [ ] Reavaliar o TypeScript 7 quando o `typescript-eslint` o suportar

---

## Decisões tomadas

Confirmadas pelo utilizador antes da Fase 1.

| # | Fase | Decisão | Escolha |
| --- | --- | --- | --- |
| 1 | 2–3 | Sincronização Clerk → base de dados | Na Fase 3 (3.2); a Fase 2 fica só com Clerk e proteção de rotas |
| 2 | 3–4 | Resend + React Email | E-mail de boas-vindas na Fase 3 (3.3) e confirmação de subscrição na Fase 4 (4.3) |
| 3 | 3 | Modelo de acesso ao Supabase | Clerk como fornecedor de autenticação do Supabase, com políticas RLS por utilizador e cliente no browser |
| 4 | 1 | Biblioteca de i18n | `next-intl` |
| 5 | 1 | Idioma por omissão | Inglês (`en`) |
| 6 | 1 | Gestor de pacotes | pnpm |
| 7 | — | Commits | Um commit local no fim de cada fase, sem push |

Confirmadas na revisão da Fase 1.

| # | Decisão | Escolha |
| --- | --- | --- |
| 8 | Troca de idioma | Mantém o recarregamento da página |
| 9 | Botões dos planos | Adicionados já, a apontar para `/sign-up` |
| 10 | Formatação em português | Idioma `pt-PT` com o URL a continuar `/pt` |
| 11 | `AGENTS.md` gerado pelo Next.js | Mantido |
| 12 | `cacheComponents` | Mantido ativo, com as exigências para o Clerk detalhadas na Fase 2 (2.2) |
