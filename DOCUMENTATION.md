# LiteLaunch — Documentação Técnica

Boilerplate SaaS ultra-leve e modular. O objetivo é que a configuração completa demore menos de 5 minutos: todos os serviços pesados (autenticação, base de dados, pagamentos, e-mail) são geridos, e o código que fica no repositório é pouco, direto e totalmente tipado.

> **Estado:** Fase 1 concluída: estrutura base, Dark Mode, i18n e landing page. As secções marcadas com ⏳ são preenchidas na fase indicada. O progresso está em [PROGRESS.md](./PROGRESS.md).

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

Versões instaladas na Fase 1: Next.js 16.4.6, React 19.3.1, TypeScript 6.0.3, Tailwind CSS 4.3.5, next-intl 4.14.10, next-themes 0.4.6, shadcn/ui sobre Base UI 1.9 e pnpm 12.14. As versões dos serviços (Clerk, Supabase, Lemon Squeezy, Resend) são fixadas na fase que os instala.

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
│   │   │   ├── layout.tsx               # Layout raiz: <html lang>, fonte, tema e i18n
│   │   │   ├── (marketing)/
│   │   │   │   ├── layout.tsx           # Header + footer
│   │   │   │   └── page.tsx             # Landing page
│   │   │   ├── (auth)/                  # Fase 2: sign-in e sign-up do Clerk
│   │   │   └── dashboard/               # Fase 2: área privada
│   │   ├── api/webhooks/lemonsqueezy/   # Fase 4: webhook de faturação (fora do i18n)
│   │   ├── globals.css                  # Tailwind e variáveis de tema do shadcn/ui
│   │   └── icon.svg                     # Favicon
│   ├── actions/                         # Fase 3: Server Actions
│   ├── components/
│   │   ├── landing/                     # hero, features, pricing, cta
│   │   ├── ui/                          # shadcn/ui: button, dropdown-menu
│   │   ├── locale-switcher.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── theme-toggle.tsx
│   ├── emails/                          # Fase 3: templates React Email
│   ├── i18n/
│   │   ├── dictionaries/                # en.json, pt.json
│   │   ├── navigation.ts                # Link, redirect, usePathname e useRouter com locale
│   │   ├── request.ts                   # Locale e dicionário de cada pedido
│   │   └── routing.ts                   # Idiomas suportados e idioma por omissão
│   ├── lib/
│   │   ├── site.ts                      # Nome do produto
│   │   └── utils.ts                     # cn()
│   ├── types/
│   │   └── i18n.d.ts                    # Liga os tipos do next-intl aos dicionários
│   └── proxy.ts                         # Deteção de idioma e redirecionamento
├── supabase/migrations/                 # Fase 3: SQL das tabelas
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

Os parênteses em `(marketing)` e `(auth)` são grupos de rotas do Next.js: organizam layouts diferentes sem acrescentar segmentos ao URL. A landing page fica em `/en` e o login ficará em `/en/sign-in`.

O `AGENTS.md` é criado pelo `next dev`. Para o desativar, define `agentRules: false` no `next.config.ts`.

---

## 4. Decisões técnicas

| Decisão | Motivo |
| --- | --- |
| Código da aplicação em `src/` | Separa o código dos ficheiros de configuração da raiz |
| `src/proxy.ts` em vez de `middleware.ts` | No Next.js 16 a convenção `middleware` foi descontinuada e passou a chamar-se `proxy`. É aqui que vive o "middleware de i18n" e, a partir da Fase 2, a proteção de rotas do Clerk |
| i18n com `next-intl` | Rotas por idioma, plurais e formatação de números e datas, com as chaves dos dicionários verificadas pelo TypeScript |
| `cacheComponents` e `partialPrefetching` ativos | São a configuração por omissão do `create-next-app` 16.4 e passam a ser obrigatórios na próxima versão major. As páginas são pré-renderizadas e só o conteúdo dinâmico é pedido ao servidor |
| A troca de idioma recarrega a página | O layout raiz depende de `[locale]`. Com `cacheComponents`, uma navegação no cliente manteria montada a árvore do idioma anterior, com um `ThemeProvider` próprio e desatualizado |
| TypeScript 6 em vez de 7 | O `typescript-eslint` ainda não suporta o TypeScript 7 |
| Tailwind pelo loader do Turbopack | `@tailwindcss/turbopack` em `next.config.ts`, como no `create-next-app`. Dispensa o PostCSS |
| shadcn/ui sobre Base UI | É a base por omissão do `shadcn init`. Os componentes ficam em `src/components/ui/` e são teus para alterar |
| `src/lib/` plano | Um ficheiro por serviço. Só passa a pasta quando o serviço precisa de clientes separados para servidor e browser |
| Instalação manual do Next.js | O `create-next-app` recusa pastas com ficheiros que possam entrar em conflito, e a raiz já tinha a estrutura e a documentação. A configuração gerada segue a do `create-next-app` |
| Webhooks fora de `/[locale]` | São chamados por máquinas, não têm idioma e não passam pela autenticação do utilizador |

As decisões de produto confirmadas contigo estão em [PROGRESS.md → Decisões tomadas](./PROGRESS.md#decisões-tomadas).

---

## 5. Guia de configuração

Cada secção é escrita quando o serviço é implementado, com os passos exatos e as variáveis de ambiente necessárias.

### 5.1 Instalação e arranque local

Requisitos: Node.js 20.9 ou superior e pnpm. Se não tiveres o pnpm, ativa-o com `corepack enable` ou instala-o com `npm install -g pnpm`.

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. És redirecionado para `/en` ou `/pt` conforme o idioma do browser. A Fase 1 não precisa de nenhuma variável de ambiente.

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

O TypeScript assinala os passos 1 e 3 se ficarem incompletos.

**Formatação regional**

O idioma `pt` usa as convenções genéricas do português na formatação (`€ 19`). Para as de Portugal (`19 €`), usa `pt-PT` como código do idioma em `routing.ts`; o URL passa a ser `/pt-PT`.

### 5.4 Clerk (autenticação) — ⏳ Fase 2

Criação da aplicação, chaves, URLs de sign-in e sign-up por locale e proteção de rotas.

### 5.5 Supabase (base de dados) — ⏳ Fase 3

Criação do projeto, configuração do Clerk como fornecedor de autenticação, chaves, execução da migração SQL, esquema das tabelas `users` e `subscriptions`, políticas RLS e geração de tipos.

### 5.6 Resend (e-mail) — ⏳ Fases 3 e 4

Chave de API, domínio de envio e pré-visualização dos templates.

### 5.7 Lemon Squeezy (pagamentos) — ⏳ Fase 4

Criação da loja, do produto e das variantes, chave de API, configuração do webhook e do respetivo segredo, e teste local.

### 5.8 SEO e deploy — ⏳ Fase 5

Metadados por idioma, sitemap, robots e publicação em produção.

---

## 6. Variáveis de ambiente

Lista provisória: a Fase 1 não usa nenhuma. Os nomes definitivos são confirmados na fase que implementa cada serviço e consolidados no `.env.example` na Fase 5.

| Variável | Serviço | Exposta ao browser | Fase |
| --- | --- | --- | --- |
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
| `NEXT_PUBLIC_APP_URL` | Aplicação (URLs absolutos de SEO) | Sim | 5 |

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

---

## 8. Histórico da documentação

| Data | Fase | Alteração |
| --- | --- | --- |
| 2026-11-11 | 0 | Criação do documento: stack, princípios, estrutura de pastas, decisões iniciais e esqueleto dos guias |
| 2026-11-12 | 1 | Versões instaladas, estrutura real, decisões técnicas da Fase 1 e guias de instalação, Dark Mode e internacionalização |
