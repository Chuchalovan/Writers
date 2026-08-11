# Архитектура

## Обзор

Manuscript построен как **monorepo** с единым Next.js приложением (fullstack) и выделенными пакетами для переиспользуемой логики.

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Editor  │  │ Structure│  │  Stats   │  │ AI Chat │ │
│  │ (TipTap) │  │  Panel   │  │ Dashboard│  │  Panel  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
└───────┼─────────────┼─────────────┼─────────────┼───────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                   apps/web (Next.js)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ App Router  │  │ API Routes  │  │ Server Actions  │ │
│  │ + next-intl │  │  /api/*     │  │                 │ │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
│         │                │                   │          │
│  ┌──────┴────────────────┴───────────────────┴────────┐ │
│  │              Service Layer (lib/)                  │ │
│  │  projects · chapters · stats · auth · ai           │ │
│  └──────────────────────┬─────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │ packages/ai  │  │ packages/    │
│  (Prisma)    │  │  providers   │  │ shared       │
└──────────────┘  └──────┬───────┘  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ External AI  │
                  │ (User's API) │
                  └──────────────┘
```

---

## Monorepo

```
manuscript/
├── apps/
│   └── web/                    # Next.js 15 fullstack app
│       ├── src/
│       │   ├── app/            # App Router (pages + API)
│       │   ├── components/     # React components
│       │   ├── lib/            # Server-side services
│       │   ├── hooks/          # Client hooks
│       │   └── i18n/           # Локализация
│       └── prisma/             # Schema + migrations
│
├── packages/
│   ├── shared/                 # Types, constants, utils
│   └── ai/                     # AI provider abstraction
│
└── docs/                       # Документация
```

### Пакеты

| Пакет | Назначение |
|-------|------------|
| `@manuscript/web` | Основное приложение |
| `@manuscript/shared` | Общие TypeScript типы, константы, утилиты |
| `@manuscript/ai` | Абстракция AI-провайдеров, промпты |

---

## Слои приложения (apps/web)

### Presentation Layer

- **App Router** — маршрутизация, layouts, server/client components
- **Components** — UI-компоненты, организованные по feature:
  - `components/editor/` — TipTap редактор
  - `components/project/` — список проектов, настройки
  - `components/chapter/` — навигация по главам
  - `components/stats/` — дашборд статистики
  - `components/ai/` — AI-панель и чат
  - `components/ui/` — shadcn/ui базовые компоненты

### Application Layer

- **Server Actions** — мутации (CRUD проектов, глав, настройки)
- **API Routes** — endpoints для AI-стриминга, webhooks
- **Middleware** — auth guard, i18n routing

### Domain Layer (lib/)

```
lib/
├── auth/           # Better Auth config + helpers
├── db/             # Prisma client singleton
├── projects/       # Project service
├── chapters/       # Chapter service
├── stats/          # Word count, daily stats
├── ai/             # AI orchestration (uses @manuscript/ai)
└── crypto/         # API key encryption/decryption
```

---

## Ключевые архитектурные решения

### 1. Fullstack Next.js

**Почему:** единая кодовая база, SSR для SEO landing-страниц, Server Actions для простых мутаций, гибкость развёртывания (Vercel, Docker, VPS).

### 2. PostgreSQL + Prisma

**Почему:** реляционная модель хорошо ложится на Project → Chapters, Prisma даёт type-safe доступ и миграции.

### 3. BYOK для AI

Пользовательский API-ключ:
1. Вводится в настройках
2. Шифруется AES-256-GCM с ключом из `ENCRYPTION_SECRET`
3. Хранится в БД (`UserApiKey`)
4. Расшифровывается только при AI-запросе на сервере
5. Передаётся напрямую во внешний API — не логируется

```
User → [encrypted key in DB] → Server decrypts → OpenAI API
```

### 4. i18n (next-intl)

- Locale prefix routing: `/ru/projects`, `/en/projects`
- Middleware определяет locale из URL или cookie
- Переводы в `messages/ru.json`, `messages/en.json`

### 5. Автосохранение

```
Editor onChange → debounce(2000ms) → Server Action → DB
                                   ↓
                            Optimistic UI update
```

- Debounce 2 секунды для снижения нагрузки
- Индикатор статуса: «Сохранено» / «Сохранение...» / «Ошибка»
- Word count пересчитывается на клиенте и синхронизируется с сервером

### 6. Статистика

При каждом сохранении главы:
1. Вычисляется delta слов (новое − предыдущее)
2. Обновляется `DailyStat` для текущей даты
3. Обновляется `Chapter.wordCount` и `Project.totalWordCount`

---

## Развёртывание

Архитектура поддерживает несколько вариантов:

| Вариант | Описание |
|---------|----------|
| **Cloud (SaaS)** | Vercel/Railway + managed PostgreSQL |
| **Self-hosted** | Docker Compose (app + postgres) на VPS |
| **Hybrid** | Frontend на CDN, backend на своём сервере |

### Docker (self-hosted)

```yaml
services:
  app:      # Next.js standalone build
  postgres: # PostgreSQL 16
```

---

## Безопасность

| Область | Подход |
|---------|--------|
| Пароли | bcrypt (via Better Auth) |
| API-ключи | AES-256-GCM encryption |
| Sessions | HTTP-only cookies, secure flag |
| CSRF | Built-in Next.js / Better Auth protection |
| Input | Zod validation на всех endpoints |
| Rate limiting | Middleware (post-MVP) |

---

## Масштабирование (post-MVP)

- **Collaboration:** WebSocket (Yjs + TipTap Collaboration) или Liveblocks
- **File storage:** S3 для экспорта и вложений
- **Background jobs:** BullMQ для экспорта, email
- **Caching:** Redis для sessions и rate limiting
