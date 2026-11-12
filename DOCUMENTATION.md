# LiteLaunch — Documentação Técnica

Boilerplate SaaS ultra-leve e modular. O objetivo é que a configuração completa demore menos de 5 minutos: todos os serviços pesados (autenticação, base de dados, pagamentos, e-mail) são geridos, e o código que fica no repositório é pouco, direto e totalmente tipado.

> **Estado:** Fases 1 a 3 concluídas: estrutura base, Dark Mode, i18n, landing page, autenticação com Clerk, base de dados Supabase e e-mail de boas-vindas. As secções marcadas com ⏳ são preenchidas na fase indicada. O progresso está em [PROGRESS.md](./PROGRESS.md).

## Índice

1. [Stack](#1-stack)
2. [Princípios de arquitetura](#2-princípios-de-arquitetura)
3. [Estrutura de pastas](#3-estrutura-de-pastas)
4. [Decisões técnicas](#4-decisões-técnicas)
5. [Guia de configuração](#5-guia-de-configuração)
6. [Variáveis de ambiente](#6-variáveis-de-ambiente)
7. [Comandos](#7-comandos)
8. [Histórico da documentação](#8-histórico-da-documentação)

---

## 1. Stack

| Área | Tecnologia | Papel | Fase |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) | Server Components, Server Actions, Route Handlers | 1 |
| Linguagem | TypeScript (Strict Mode) | Tipagem estrita, sem `any` | 1 |
| UI | Tailwind CSS + shadcn/ui | Estilos utilitários e componentes copiados para o projeto | 1 |
| Tema | next-themes | Dark / Light mode sem flash | 1 |
| i18n | Rotas `/[locale]` + next-intl | Multilingue nativo com dicionários tipados | 1 |
| Autenticação | Clerk | Login, registo e sessão geridos | 2 |
| Base de dados | Supabase (`@supabase/supabase-js`) | Postgres gerido, sem ORM | 3 |
| E-mail | Resend + React Email | E-mails transacionais em React | 3–4 |
| Pagamentos | Lemon Squeezy | Merchant of Record (trata do IVA) | 4 |

Versões instaladas na Fase 1: Next.js 16.4.6, React 19.3.1, TypeScript 6.0.3, Tailwind CSS 4.3.5, next-intl 4.14.10, next-themes 0.4.6, shadcn/ui sobre Base UI 1.9 e pnpm 12.14. Na Fase 2: `@clerk/nextjs` 7.9.25, `@clerk/ui` 1.42.4 (tema shadcn) e `@clerk/localizations` 4.24.6. Na Fase 3: `@supabase/supabase-js` 2.119.0, `resend` 6.38.0 e `react-email` 6.11.11. A versão do Lemon Squeezy é fixada na Fase 4.

---

## 2. Princípios de arquitetura

1. **Simplicidade sobre abstração.** Um ficheiro por responsabilidade, sem camadas intermédias. Se uma função só é usada num sítio, fica nesse sítio.
2. **i18n e SEO limpos.** O idioma faz parte do URL (`/en/...`, `/pt/...`). As páginas são renderizadas no servidor e pré-geradas por idioma, com `<html lang>` e metadados localizados.
3. **Segurança.** Só as variáveis `NEXT_PUBLIC_*` chegam ao browser. Os clientes com chaves privadas são server-only. Os webhooks são validados com assinatura criptográfica antes de qualquer processamento.
4. **Tipagem estrita.** Respostas de APIs, payloads de webhooks, dicionários de i18n e linhas da base de dados têm tipos explícitos. `any` é erro de lint.
5. **Documentação contínua.** Cada fase termina com esta documentação atualizada.

---

## 3. Estrutura de pastas

As pastas marcadas com a fase ainda só contêm um `.gitkeep`.

```text
litelaunch/
├── public/                              # Ficheiros estáticos
├── src/
│   ├── app/
│   │   ├── [locale]/                    # Todas as páginas vivem sob o idioma
│   │   │   ├── layout.tsx               # Layout raiz: <html lang>, fonte, tema, i18n e sessão
│   │   │   ├── (marketing)/
│   │   │   │   ├── layout.tsx           # Header + footer
│   │   │   │   ├── page.tsx             # Landing page
│   │   │   │   ├── not-found.tsx        # Página 404 localizada
│   │   │   │   └── [...rest]/page.tsx   # Envia os URLs inexistentes para o 404
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx           # Página centrada, só com logo, idioma e tema
│   │   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── dashboard/               # Área privada
│   │   │       ├── layout.tsx           # Header com o menu do utilizador
│   │   │       ├── loading.tsx          # Esqueleto enquanto a sessão é lida
│   │   │       └── page.tsx             # Protegida com auth.protect()
│   │   ├── api/webhooks/lemonsqueezy/   # Fase 4: webhook de faturação (fora do i18n)
│   │   ├── globals.css                  # Tailwind e variáveis de tema do shadcn/ui
│   │   └── icon.svg                     # Favicon
│   ├── actions/
│   │   └── user.ts                      # syncUser: copia o utilizador do Clerk para a base de dados
│   ├── components/
│   │   ├── landing/                     # hero, features, pricing, cta
│   │   ├── ui/                          # shadcn/ui: button, dropdown-menu
│   │   ├── auth-provider.tsx            # ClerkProvider com URLs, tema e traduções
│   │   ├── header-auth.tsx              # Entrar / Começar / Dashboard / menu do utilizador
│   │   ├── locale-switcher.tsx
│   │   ├── mobile-nav.tsx               # Menu de navegação em ecrãs pequenos
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── theme-toggle.tsx
│   ├── emails/
│   │   └── welcome.tsx                  # Template do e-mail de boas-vindas
│   ├── i18n/
│   │   ├── dictionaries/                # en.json, pt-PT.json
│   │   ├── clerk.ts                     # Traduções da interface do Clerk por idioma
│   │   ├── navigation.ts                # Link, redirect, usePathname e useRouter com locale
│   │   ├── request.ts                   # Locale e dicionário de cada pedido
│   │   └── routing.ts                   # Idiomas suportados e idioma por omissão
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── admin.ts                 # Chave secreta, ignora o RLS: só para escritas no servidor
│   │   │   ├── client.ts                # useSupabase() para Client Components
│   │   │   └── server.ts                # Em nome do utilizador, no servidor
│   │   ├── resend.ts                    # sendEmail()
│   │   ├── site.ts                      # Nome do produto, URL e links de navegação
│   │   └── utils.ts                     # cn()
│   ├── types/
│   │   ├── database.ts                  # Tipos das tabelas do Supabase
│   │   └── i18n.d.ts                    # Liga os tipos do next-intl aos dicionários
│   └── proxy.ts                         # Sessão do Clerk, deteção de idioma e redirecionamentos
├── supabase/migrations/                 # SQL das tabelas e das políticas RLS
├── .env.example                         # Variáveis de ambiente a copiar para .env.local
├── AGENTS.md                            # Gerado pelo Next.js para agentes de IA
├── components.json                      # Configuração do shadcn/ui
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── DOCUMENTATION.md
└── PROGRESS.md
```

Os parênteses em `(marketing)` e `(auth)` são grupos de rotas do Next.js: organizam layouts diferentes sem acrescentar segmentos ao URL. A landing page fica em `/en` e o login em `/en/sign-in`.

O `AGENTS.md` é criado pelo `next dev`. Para o desativar, define `agentRules: false` no `next.config.ts`.

---

## 4. Decisões técnicas

| Decisão | Motivo |
| --- | --- |
| Código da aplicação em `src/` | Separa o código dos ficheiros de configuração da raiz |
| `src/proxy.ts` em vez de `middleware.ts` | No Next.js 16 a convenção `middleware` foi descontinuada e passou a chamar-se `proxy`. É aqui que correm, por esta ordem, a sessão do Clerk e o encaminhamento por idioma |
| Proteção na página, não no proxy | O Clerk descontinuou a proteção por caminhos no proxy, porque pode ser contornada (as Server Actions, por exemplo, são chamadas por ID e não por caminho). Cada página privada chama `auth.protect()`; o proxy só antecipa o redirecionamento |
| Sessão lida no browser no header de marketing | Mantém a landing 100% estática e servida da cache. Os links de sessão aparecem quando o Clerk carrega |
| Traduções do Clerk passadas pelo servidor | Chegam com a primeira renderização. Carregadas a pedido, a interface do Clerk podia ficar em inglês. Custo: cerca de 20 KB comprimidos no HTML de cada página não inglesa |
| Logout com carregamento completo | O Clerk termina a sessão com uma navegação no cliente, e o `cacheComponents` mantinha o HTML das páginas privadas no DOM, escondido. O `ReloadOnSignOut` em `auth-provider.tsx` recarrega a página quando a sessão acaba |
| i18n com `next-intl` | Rotas por idioma, plurais e formatação de números e datas, com as chaves dos dicionários verificadas pelo TypeScript |
| `cacheComponents` e `partialPrefetching` ativos | São a configuração por omissão do `create-next-app` 16.4 e passam a ser obrigatórios na próxima versão major. As páginas são pré-renderizadas e só o conteúdo dinâmico é pedido ao servidor |
| A troca de idioma recarrega a página | O layout raiz depende de `[locale]`. Com `cacheComponents`, uma navegação no cliente manteria montada a árvore do idioma anterior, com um `ThemeProvider` próprio e desatualizado. A documentação do Next.js recomenda o mesmo para mudanças de estado global, como o logout |
| Idioma `pt-PT` com o URL `/pt` | O código `pt-PT` dá a formatação de Portugal (`19 €`) e o `<html lang>` correto; o prefixo `/pt` mantém o URL curto |
| 404 localizado com `notFound()` em `generateMetadata` | Dá um 404 real com a página completa renderizada no servidor. Lançado a partir da página, o `cacheComponents` pré-renderiza um shell vazio que só o browser preenche |
| TypeScript 6 em vez de 7 | O TypeScript 7 não inclui a API JavaScript do compilador de que o `typescript-eslint` precisa; sem ela, o ESLint e a regra `no-explicit-any` deixam de funcionar |
| Tailwind pelo loader do Turbopack | `@tailwindcss/turbopack` em `next.config.ts`, como no `create-next-app`. Dispensa o PostCSS |
| shadcn/ui sobre Base UI | É a base por omissão do `shadcn init`. Os componentes ficam em `src/components/ui/` e são teus para alterar |
| `src/lib/` plano | Um ficheiro por serviço. Só passa a pasta quando o serviço precisa de clientes separados para servidor e browser, como o Supabase |
| Utilizadores só com leitura na base de dados | As políticas RLS deixam cada utilizador ler as suas linhas e nada mais. Todas as escritas passam pelo servidor com a chave secreta. Com permissão de escrita, um utilizador podia alterar o estado da sua própria subscrição |
| Sincronização na entrada do dashboard | O `syncUser` corre quando o utilizador abre o dashboard, em vez de depender de um webhook do Clerk. Não há endpoint nem segredo extra para configurar. Contrapartida: um utilizador apagado no Clerk continua na tabela `users` |
| `react-email` em vez de `@react-email/components` | O segundo está marcado como descontinuado no npm. O `react-email` inclui os mesmos componentes e a função `render` |
| Instalação manual do Next.js | O `create-next-app` recusa pastas com ficheiros que possam entrar em conflito, e a raiz já tinha a estrutura e a documentação. A configuração gerada segue a do `create-next-app` |
| Webhooks fora de `/[locale]` | São chamados por máquinas, não têm idioma e não passam pela autenticação do utilizador |

As decisões de produto confirmadas contigo estão em [PROGRESS.md → Decisões tomadas](./PROGRESS.md#decisões-tomadas).

### Trabalhar com `cacheComponents`

Com esta opção, o Next.js pré-renderiza um shell estático de cada rota e mantém em memória as últimas rotas visitadas. Três regras evitam surpresas:

- **Hooks de URL em layouts partilhados.** Um hook que lê o URL num Client Component do header ou do footer, como `usePathname()`, faz falhar o build nas rotas dinâmicas, a menos que esteja dentro de `<Suspense>`. Quando o valor só é preciso num clique, lê `window.location` no handler, como faz o `locale-switcher.tsx`.
- **Dados do pedido.** Cookies, cabeçalhos e sessão só existem no momento do pedido. O componente que os lê tem de estar dentro de `<Suspense>` para o resto da página continuar estático.
- **Menus e diálogos.** Uma rota escondida conserva o seu estado. Fecha os menus ao selecionar uma opção (`closeOnClick`) para não reaparecerem abertos quando o utilizador volta.

---

## 5. Guia de configuração

Cada secção é escrita quando o serviço é implementado, com os passos exatos e as variáveis de ambiente necessárias.

### 5.1 Instalação e arranque local

Requisitos: Node.js 20.9 ou superior e pnpm. Se não tiveres o pnpm, ativa-o com `corepack enable` ou instala-o com `npm install -g pnpm`.

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. És redirecionado para `/en` ou `/pt` conforme o idioma do browser.

Antes do primeiro arranque, copia `.env.example` para `.env.local` e preenche as chaves do Clerk (secção 5.4), do Supabase (5.5) e da Resend (5.6). Sem a `CLERK_SECRET_KEY`, todas as páginas respondem com erro 500.

### 5.2 Dark Mode

O `ThemeProvider` do `next-themes` está no layout raiz (`src/app/[locale]/layout.tsx`). Aplica a classe `dark` ao `<html>` com um script inline que corre antes da primeira pintura, por isso não há flash de tema. A escolha fica guardada no `localStorage`.

- **Tema por omissão:** altera `defaultTheme="system"` para `"light"` ou `"dark"` no layout raiz.
- **Cores:** edita as variáveis CSS em `src/app/globals.css`. O bloco `:root` é o tema claro e o bloco `.dark` é o tema escuro.
- **Estilos por tema:** usa o prefixo `dark:` do Tailwind, por exemplo `bg-white dark:bg-black`.
- **Em Client Components:** `useTheme()` do `next-themes` devolve `theme` e `setTheme`. No servidor o tema não é conhecido, por isso alterna os elementos com CSS (`dark:hidden`) em vez de com estado, como faz o `src/components/theme-toggle.tsx`.

### 5.3 Internacionalização

**Como funciona**

1. `src/proxy.ts` recebe o pedido. Se o URL não tiver idioma, escolhe um pelo cookie `NEXT_LOCALE` ou pelo cabeçalho `Accept-Language` e redireciona, por exemplo `/` → `/pt`. Se nenhum corresponder, usa o inglês.
2. `src/i18n/request.ts` lê o idioma do segmento `[locale]` e carrega o dicionário correspondente.
3. O layout raiz define `<html lang>` e pré-gera as páginas de cada idioma com `generateStaticParams`.

O proxy também envia os cabeçalhos `Link` com as alternativas `hreflang` de cada página.

**Usar traduções**

```tsx
// Server ou Client Component síncrono
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");
  return <h1>{t("title")}</h1>;
}
```

```tsx
// Função assíncrona no servidor (generateMetadata, componentes async)
import { getTranslations } from "next-intl/server";

const t = await getTranslations("metadata");
```

Uma chave que não exista em `en.json` é um erro de compilação. Para números, moedas e datas usa `useFormatter()`, como em `src/components/landing/pricing.tsx`.

Em Server Actions e Route Handlers o segmento `[locale]` não está disponível. Aí passa o idioma explicitamente: `getTranslations({ locale, namespace: "metadata" })`.

**Links e navegação**

Importa `Link`, `redirect`, `usePathname` e `useRouter` de `@/i18n/navigation` em vez de `next/link` e `next/navigation`. Acrescentam o idioma atual ao URL automaticamente: `<Link href="/dashboard">` aponta para `/pt/dashboard` quando o idioma é o português.

A troca de idioma é a exceção: tem de ser uma navegação completa (ver `src/components/locale-switcher.tsx`), não um `<Link locale="...">`.

**Adicionar texto**

Acrescenta a chave a `src/i18n/dictionaries/en.json` e a todos os outros dicionários. O `en.json` é a referência dos tipos: se faltar uma chave noutro idioma, o `pnpm typecheck` falha em `src/i18n/request.ts`.

**Adicionar um idioma** (exemplo: espanhol)

1. Em `src/i18n/routing.ts`, acrescenta `"es"` a `locales` e `es: "Español"` a `localeNames`.
2. Copia `src/i18n/dictionaries/en.json` para `es.json` e traduz os valores.
3. Em `src/i18n/request.ts`, acrescenta `es: () => import("./dictionaries/es.json")` a `dictionaries`.
4. Em `src/i18n/clerk.ts`, acrescenta a tradução da interface do Clerk: `es: esES`, importada de `@clerk/localizations/es-ES`.

O TypeScript assinala os passos 1 e 3 se ficarem incompletos. Sem o passo 4, o login e o menu do utilizador aparecem em inglês nesse idioma.

**Códigos de idioma e URLs**

O português está configurado como `pt-PT`, para que moedas, números e datas sigam as convenções de Portugal (`19 €` em vez de `€ 19`). O URL continua a ser `/pt` por causa de `localePrefix.prefixes` em `routing.ts`. Quem tem o browser em `pt-BR` também é encaminhado para `/pt`.

Para um idioma com variante regional, usa o código completo em `locales` e, se quiseres um URL mais curto, acrescenta-o a `prefixes`. Sem entrada em `prefixes`, o URL usa o próprio código.

**Página 404**

Qualquer URL sem página dentro de um idioma cai em `src/app/[locale]/(marketing)/[...rest]/page.tsx`, que responde com 404 e mostra `not-found.tsx` no idioma certo, com header e footer. Os textos estão na chave `notFound` dos dicionários.

Duas particularidades:

- Em `pnpm dev` a resposta tem código 200; o 404 real só existe no build de produção, onde a página é pré-renderizada.
- Em produção, quem abre diretamente um URL inexistente e depois navega pelo site gera dois erros `Minified React error #419` na consola. São avisos de recuperação do React e a página funciona normalmente. Se usares monitorização de erros, ignora essa mensagem.

### 5.4 Clerk (autenticação)

**Configurar**

1. Cria uma aplicação em [dashboard.clerk.com](https://dashboard.clerk.com) e escolhe os métodos de login (e-mail, nome de utilizador, Google, etc.).
2. Copia `.env.example` para `.env.local` e preenche `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY` com os valores de **API keys**.
3. Corre `pnpm dev` e abre `/en/sign-up` para criar a primeira conta.

Não há mais variáveis a definir: os URLs de login, registo e redirecionamento estão no código e seguem o idioma. Os métodos de login mudam-se no dashboard do Clerk, sem tocar no código.

**Onde está cada coisa**

| Ficheiro | Papel |
| --- | --- |
| `src/proxy.ts` | Lê a sessão em cada pedido e redireciona visitantes sem sessão que pedem `/[locale]/dashboard/**` para o login no mesmo idioma |
| `src/components/auth-provider.tsx` | `ClerkProvider` com os URLs por idioma, o tema shadcn e o recarregamento no logout |
| `src/i18n/clerk.ts` | Traduções da interface do Clerk por idioma |
| `src/app/[locale]/(auth)/` | Páginas de login e registo com os componentes `<SignIn>` e `<SignUp>` |
| `src/app/[locale]/dashboard/` | Área privada: a página chama `auth.protect()` |
| `src/components/header-auth.tsx` | Links de sessão no header de marketing |

**Fluxos**

- Um visitante sem sessão que pede uma página privada vai para o login e, depois de entrar, volta a essa página.
- Quem entra ou se regista diretamente vai para `/[locale]/dashboard`.
- Ao terminar a sessão, a página inicial do mesmo idioma é carregada de novo.

**Proteger uma página nova**

1. Cria-a dentro de `src/app/[locale]/dashboard/`.
2. Começa o componente com `await auth.protect()`:

```tsx
import { auth } from "@clerk/nextjs/server";

export default async function SettingsPage() {
  await auth.protect();
  // ...
}
```

O `loading.tsx` do dashboard já cobre as páginas dentro dele. Para uma área privada fora de `/dashboard`, acrescenta-lhe um `loading.tsx` e inclui o caminho em `privatePath`, em `src/proxy.ts`.

O `auth.protect()` é a barreira de segurança. O redirecionamento no proxy é só um atalho: sem ele, a página responde com código 200 e redireciona para o login já durante o carregamento, sem mostrar conteúdo privado.

**Server Actions e Route Handlers**

Não são protegidos pelo proxy. Cada um tem de verificar a sessão com `auth()` ou `auth.protect()` antes de ler ou alterar dados.

**Ler o utilizador**

- No servidor: `auth()` para o `userId`, `currentUser()` para o perfil completo. Dentro de `<Suspense>` ou numa página com `loading.tsx`, e nunca numa função com `use cache`.
- No browser: `useAuth()` e `useUser()`, ou `<Show when="signed-in">` para mostrar conteúdo conforme a sessão.

**Aparência e idioma**

Os componentes do Clerk usam o tema `shadcn`, que lê as variáveis CSS de `globals.css`; seguem as cores do site e o Dark Mode sem configuração extra. As traduções vêm do pacote `@clerk/localizations`, que o Clerk marca como experimental e que pode ter textos por traduzir.

**Notas**

- As chaves `pk_test_` e `sk_test_` são de desenvolvimento: o Clerk mostra "Development mode" e um aviso na consola. As chaves de produção entram no deploy (secção 5.8).
- Os links de sessão do header só aparecem depois de o Clerk carregar no browser, por isso surgem um instante depois do resto da página.
- As páginas não inglesas levam cerca de 20 KB comprimidos a mais no HTML, por causa das traduções do Clerk.

### 5.5 Supabase (base de dados)

**Configurar**

1. Cria um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. Preenche no `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: **Project Settings > Data API > Project URL**. Só o URL base (`https://xxxx.supabase.co`), sem `/rest/v1/` no fim.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: **Project Settings > API Keys > Publishable key** (`sb_publishable_...`).
   - `SUPABASE_SECRET_KEY`: **Project Settings > API Keys > Secret key** (`sb_secret_...`).
3. Liga o Clerk ao Supabase. São precisos os dois lados:
   - No Clerk, abre [dashboard.clerk.com/setup/supabase](https://dashboard.clerk.com/setup/supabase), escolhe a aplicação cujas chaves estão no `.env.local` e clica em **Activate Supabase integration**. Copia o **Clerk domain**.
   - No Supabase, em **Authentication > Sign In / Providers > Third Party Auth**, adiciona o fornecedor **Clerk** e cola o domínio.
4. Cria as tabelas: em **SQL Editor > New query**, cola o conteúdo de `supabase/migrations/20261112000000_users_and_subscriptions.sql` e clica em **Run**.

**Tabelas**

| Tabela | Uma linha por | Colunas principais | Escrita por |
| --- | --- | --- | --- |
| `users` | Utilizador do Clerk | `id` (ID do Clerk), `email`, `name`, `image_url`, `locale` | `syncUser` |
| `subscriptions` | Subscrição do Lemon Squeezy | `id`, `user_id`, `status`, `variant_id`, `variant_name`, `customer_id`, `renews_at`, `ends_at`, `trial_ends_at` | Webhook de faturação (Fase 4) |

As duas têm `created_at` e `updated_at`; o `updated_at` é atualizado por um trigger. Apagar um utilizador apaga as suas subscrições.

**Modelo de acesso**

- Sem sessão não há acesso a nenhuma tabela.
- Um utilizador com sessão só pode **ler** as suas próprias linhas. O Supabase valida o token do Clerk e as políticas RLS comparam a claim `sub` (o ID do Clerk) com `users.id` e `subscriptions.user_id`.
- Todas as **escritas** são feitas no servidor com a chave secreta, que ignora o RLS.

**Três clientes**

| Função | Ficheiro | Atua como | Usar em |
| --- | --- | --- | --- |
| `createServerSupabaseClient()` | `src/lib/supabase/server.ts` | O utilizador com sessão | Server Components, Server Actions e Route Handlers que leem dados do utilizador |
| `useSupabase()` | `src/lib/supabase/client.ts` | O utilizador com sessão | Client Components |
| `createAdminSupabaseClient()` | `src/lib/supabase/admin.ts` | Administrador, sem RLS | Escritas no servidor, depois de o código verificar quem está a pedir |

```tsx
// Server Component: só devolve as linhas do utilizador com sessão
import { createServerSupabaseClient } from "@/lib/supabase/server";

const { data } = await createServerSupabaseClient()
  .from("subscriptions")
  .select("status, variant_name");
```

```tsx
// Client Component
"use client";
import { useSupabase } from "@/lib/supabase/client";

const supabase = useSupabase();
```

Os dois primeiros leem a sessão do pedido: no servidor, usa-os dentro de `<Suspense>` ou numa página com `loading.tsx`, como o resto do código que depende da sessão.

**Sincronização de utilizadores**

O dashboard chama a Server Action `syncUser` (`src/actions/user.ts`) em cada visita. Na primeira, cria a linha em `users` e envia o e-mail de boas-vindas. Nas seguintes, atualiza o e-mail, o nome, a imagem e o idioma com os dados atuais do Clerk.

Consequências a conhecer:

- Uma alteração de e-mail ou de nome no Clerk só chega à base de dados na visita seguinte ao dashboard.
- Um utilizador apagado no Clerk fica na tabela `users`. Para o remover automaticamente é preciso um webhook do Clerk, que este boilerplate não inclui.
- Cada visita ao dashboard faz um pedido à API do Clerk e uma ou duas escritas no Supabase.

**Adicionar uma tabela**

1. Cria um ficheiro novo em `supabase/migrations/` com a tabela, `enable row level security`, as permissões (`grant select ... to authenticated`) e uma política que compare `(select auth.jwt() ->> 'sub')` com a coluna do utilizador. Usa a migração existente como modelo.
2. Corre-o no SQL Editor.
3. Acrescenta a tabela a `src/types/database.ts`.

O `database.ts` foi escrito à mão, no formato que o gerador do Supabase produz. O comando para o gerar a partir do projeto é `pnpm dlx supabase gen types typescript --project-id <ref> > src/types/database.ts`, que exige `supabase login`; não foi executado neste projeto.

**Problemas comuns**

| Sintoma | Causa |
| --- | --- |
| `permission denied for table ...` com sessão iniciada | A integração não está ativa do lado do Clerk: os tokens não trazem a claim `role` e o Supabase trata o pedido como anónimo. Repete o passo 3 e confirma que escolheste a aplicação certa |
| `permission denied for table ...` ao escrever com `createServerSupabaseClient()` ou `useSupabase()` | É o comportamento esperado: os utilizadores só têm leitura. Faz a escrita numa Server Action com `createAdminSupabaseClient()` |

### 5.6 Resend (e-mail)

**Configurar**

1. Cria uma chave em [resend.com/api-keys](https://resend.com/api-keys). A permissão "Sending access" é suficiente.
2. Preenche no `.env.local`:
   - `RESEND_API_KEY`: a chave (`re_...`).
   - `EMAIL_FROM`: o remetente, por exemplo `"LiteLaunch <onboarding@resend.dev>"`.
   - `NEXT_PUBLIC_APP_URL`: o URL público do site, usado nos links dos e-mails. Em desenvolvimento, `http://localhost:3000`.

O remetente `onboarding@resend.dev` funciona sem configurar nada, mas só entrega no endereço da tua própria conta Resend. Para enviar a utilizadores reais, verifica um domínio em [resend.com/domains](https://resend.com/domains) e usa um endereço desse domínio em `EMAIL_FROM`.

**E-mail de boas-vindas**

É enviado pelo `syncUser` quando a linha do utilizador é criada, no idioma da página em que ele estava. O envio leva a chave de idempotência `welcome/<id do utilizador>`, por isso a Resend não o repete se a sincronização correr duas vezes num intervalo de 24 horas. Se o envio falhar, o erro fica no registo do servidor e o dashboard abre na mesma.

**Criar outro e-mail**

1. Cria o template em `src/emails/`, com os componentes de `react-email`. Recebe os textos já traduzidos como propriedades, como o `welcome.tsx`.
2. Acrescenta os textos à chave `emails` dos dicionários.
3. Envia com `sendEmail()` de `src/lib/resend.ts`, que gera as versões HTML e de texto simples.

Fora de um pedido de página (num webhook, por exemplo) não há idioma ativo. Usa o que está guardado em `users.locale`: `getTranslations({ locale: user.locale, namespace: "emails.welcome" })`.

Não há servidor de pré-visualização de e-mails configurado.

### 5.7 Lemon Squeezy (pagamentos) — ⏳ Fase 4

Criação da loja, do produto e das variantes, chave de API, configuração do webhook e do respetivo segredo, e teste local.

### 5.8 SEO e deploy — ⏳ Fase 5

Metadados por idioma, sitemap, robots e publicação em produção.

---

## 6. Variáveis de ambiente

As variáveis do Clerk, do Supabase e da Resend são definitivas e estão no `.env.example`. As do Lemon Squeezy são provisórias: os nomes são confirmados na Fase 4.

| Variável | Serviço | Exposta ao browser | Fase |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Aplicação (links nos e-mails; URLs de SEO na Fase 5) | Sim | 3 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | Sim | 2 |
| `CLERK_SECRET_KEY` | Clerk | Não | 2 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Sim | 3 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase | Sim | 3 |
| `SUPABASE_SECRET_KEY` | Supabase | Não | 3 |
| `RESEND_API_KEY` | Resend | Não | 3 |
| `EMAIL_FROM` | Resend | Não | 3 |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy | Não | 4 |
| `LEMONSQUEEZY_STORE_ID` | Lemon Squeezy | Não | 4 |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy | Não | 4 |

Regra: tudo o que não começa por `NEXT_PUBLIC_` só pode ser lido em código de servidor (Server Components, Server Actions, Route Handlers).

---

## 7. Comandos

| Comando | Função |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servir o build de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Gera os tipos das rotas e verifica os tipos sem emitir ficheiros |
| `pnpm dlx shadcn@latest add <componente>` | Adiciona um componente shadcn/ui a `src/components/ui/` |

Se o `pnpm typecheck` ou o `pnpm build` falharem com erros em `.next/dev/types` depois de apagares uma rota, apaga a pasta `.next`. São tipos gerados pelo `pnpm dev` que ficaram desatualizados.

---

## 8. Histórico da documentação

| Data | Fase | Alteração |
| --- | --- | --- |
| 2026-11-11 | 0 | Criação do documento: stack, princípios, estrutura de pastas, decisões iniciais e esqueleto dos guias |
| 2026-11-12 | 1 | Versões instaladas, estrutura real, decisões técnicas da Fase 1 e guias de instalação, Dark Mode e internacionalização |
| 2026-11-12 | 1 | Revisão da Fase 1: idioma `pt-PT` com URL `/pt`, página 404 localizada, menu para ecrãs pequenos, botões dos planos e regras para trabalhar com `cacheComponents` |
| 2026-11-12 | 2 | Autenticação com Clerk: guia de configuração, proteção de páginas, decisões sobre proxy, traduções e logout |
| 2026-11-12 | 3 | Supabase e Resend: guias de configuração, esquema de dados, modelo de acesso, os três clientes, sincronização de utilizadores e e-mail de boas-vindas |
