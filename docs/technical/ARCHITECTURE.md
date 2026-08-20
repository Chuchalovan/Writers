# Архитектура

> **Норматив:** [ТЗ §6.1](../tz/TZ.md#61-архитектура), [§7](../tz/TZ.md#7-нефункциональные-требования), [DEC-001](../roadmap/DECISION-LOG.md#dec-001-технологическая-платформа)  
> **Продукт:** [PRD v2.1](../prd/PRD.md)  
> **Данные:** [DATABASE.md](./DATABASE.md) · **контракты:** [API.md](./API.md) · **UI:** [design/](./design/)  
> **Обновлено:** 20 августа 2026

При расхождении **цель** = ТЗ; этот файл описывает **слои кода как сейчас** и gap до норматива.

---

## Обзор

Fullstack Next.js 15: браузер рисует UI; сервер хранит данные, проверяет владельца и делает побочные эффекты (почта, AI, файлы).

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  App Router UI · TipTap (цель Sprint 3) · IndexedDB буфер    │
└───────────────┬───────────────────────────────┬──────────────┘
                │ Server Actions                │ REST /api/v1
                ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│  apps/web                                                    │
│  Middleware (locale) · actions/ · lib/ · Better Auth         │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
        PostgreSQL + Drizzle              packages/ai (заглушка)
                │                      packages/shared (Zod)
                ▼
         SMTP / AI / S3 — по gate ТЗ §6.6
```

Нормативная схема: [ТЗ §6.1 mermaid](../tz/TZ.md#61-архитектура).

---

## Gap vs ТЗ

| Тема | Норматив | Факт кода |
|------|----------|-----------|
| CRUD | Server Actions + Zod `@manuscript/shared` | Частично: projects + manuscript nodes |
| AI | Platform AI, SSE `POST /api/v1/ai/*`, BYOK = P2 (DEC-005) | Нет route; `lib/ai` и `packages/ai` — TODO Sprint 5. Старые промпты grammar/continue/ideas **не норматив** |
| Автосейв | Debounce 2 с → IndexedDB → `saveSceneContent` + `baseVersion` ([ТЗ §8.3](../tz/TZ.md#83-редактор-и-сохранность-текста)) | Scene page есть; flush/конфликт/буфер — нет |
| Auth guard | Middleware + session | Locale middleware only; dashboard layout редиректит на `/login` |
| Ошибки | `{ error: { code, message, details } }` | Часто `throw new Error(...)` |
| Экспорт | DOCX/TXT Alpha; job если не укладывается в timeout | Нет |
| Статистика / цели | P2, DEC-012 | Страница `/stats`, `lib/stats` пустой; модели в схеме |
| Шифрование BYOK | AES-256-GCM, P2 | `lib/crypto` — TODO |
| UI shell | Ink Studio: rail \| navigator \| sheet \| inspector | Широкий sidebar, старые токены |

---

## Monorepo

```
manuscript/
├── apps/web/                 # Next.js 15 (@manuscript/web)
│   ├── src/app/              # App Router + api/auth
│   ├── src/actions/          # Server Actions
│   ├── src/components/       # UI по feature
│   ├── src/lib/              # сервисы
│   ├── src/i18n/             # next-intl
│   └── drizzle/              # SQL-миграции Drizzle
├── packages/shared/          # Zod, types, constants
├── packages/ai/              # провайдеры + промпты (не реализованы)
├── docs/
└── .github/workflows/        # CI / CD
```

| Пакет | Назначение |
|-------|------------|
| `@manuscript/web` | Приложение |
| `@manuscript/shared` | Zod-схемы и типы на границе |
| `@manuscript/ai` | Абстракция провайдера; реализации — Sprint 5 |

---

## Слои (apps/web)

### Presentation

- App Router, layouts `(auth)` / `(dashboard)`, next-intl (`/ru`, `/en`)
- Компоненты: `editor/`, `manuscript/`, `project/`, `layout/`, `ui/` (shadcn)
- Устаревшие относительно продукта: `stats/` (P2), нет `characters/`, `world/`, rail

### Application

| Механизм | Факт | Цель |
|----------|------|------|
| Server Actions | `src/actions/projects.ts`, `manuscript.ts` | полный набор [API.md](./API.md) |
| API Routes | только `GET/POST /api/auth/[...all]` (Better Auth) | `/api/v1/ai/*`, export |
| Middleware | next-intl matcher `/(ru\|en)` | + auth на защищённых префиксах |

### Domain (`src/lib/`)

```
lib/
├── auth/         # Better Auth + session helpers     ✅
├── db/           # Drizzle Pool + schema                 ✅
├── projects/     # CRUD проектов, assertProjectOwner  ✅
├── manuscript/   # дерево ManuscriptNode + soft delete ✅
├── chapters/     # re-export manuscript (legacy alias)
├── stats/        # пусто — не делать в MVP
├── ai/           # пусто — Sprint 5
└── crypto/       # пусто — BYOK P2
```

Нет отдельных `lib/characters`, `lib/export`, `lib/world` — gap Sprint 4 / 6.

---

## Маршруты клиента

Префикс: `/[locale]/…`. Норматив: [ТЗ §6.2](../tz/TZ.md#62-маршруты-клиента-логические).

| Маршрут | Факт | Цель |
|---------|------|------|
| `/`, `/login`, `/register` | ✅ | ✅ |
| `/forgot-password`, `/reset-password` | ⬜ | Beta |
| `/projects`, `/projects/[id]` | ✅ | ✅ |
| `/projects/[id]/scenes/[sceneId]` | ✅ страница-заглушка | редактор Sprint 3 |
| `/projects/[id]/characters`, `…/world` | ⬜ | P0 Sprint 4 |
| `/projects/[id]/plot`, `timeline`, `notes` | ⬜ | P1 |
| `/settings` | ✅ страница | профиль / удаление Beta |
| `/stats` | ✅ лишняя | убрать из MVP (DEC-012) |

Защита: `(dashboard)/layout.tsx` без сессии → `/login`. `callbackUrl` — проверить при доработке auth.

---

## Ключевые решения

### 1. Fullstack Next.js (DEC-001 Accepted)

Одна кодовая база, SSR лендинга, Server Actions для CRUD, Docker/Vercel на выбор.

### 2. PostgreSQL 16 + Drizzle

Дерево `Project → ManuscriptNode` (part/chapter/scene), не модель `Chapter`. Схема: [DATABASE.md](./DATABASE.md), норматив полей — [ТЗ §6.5](../tz/TZ.md#65-модель-базы-данных). ORM — [DEC-013](../roadmap/DECISION-LOG.md#dec-013-orm-drizzle).

### 3. AI: platform для Beta (DEC-005 Proposed)

До sign-off ТЗ фиксирует: **platform AI**, ключ на сервере. BYOK (`UserApiKey` + AES-256-GCM) — **P2**, не блокер Beta. Клиент не передаёт полный текст проекта как единственный источник контекста: сервер собирает сущности по `level` + `contextEntityIds` ([ТЗ §8.5](../tz/TZ.md#85-ai)).

### 4. i18n

`next-intl`, locales `ru` \| `en`. Сообщения: `apps/web/messages/{ru,en}.json`. P0-потоки без сырых ключей (NFR-12).

### 5. Автосохранение (цель Sprint 3)

```
onChange → debounce 2000ms → IndexedDB(sceneId) → saveSceneContent({ contentJson, baseVersion })
Ctrl+S / blur → flush сразу
```

- Optimistic concurrency: `baseVersion` ↔ `SceneContent.version`; иначе `409 CONFLICT`
- Alpha: явный выбор «сервер» / «оставить моё», не тихий overwrite
- Offline: статус «Сохранено на устройстве»; по сети — flush одной сцены
- Счётчик слов: Unicode words по `plainText` в `@manuscript/shared`, на сервере при успешном save

### 6. Сессия

Better Auth, email+пароль ≥8. Cookie HTTP-only, SameSite=Lax, Secure в prod. Logout и смена пароля инвалидируют сессии (ТЗ-SEC-04) — проверить при Beta auth.

---

## Интеграции (ТЗ §6.6)

| Система | Gate | Факт |
|---------|------|------|
| SMTP | Beta (confirm/reset) | нет |
| AI HTTPS + SSE, timeout 30 с | P1 | нет |
| S3-совместимое хранилище | P1 файлы | нет; docker только Postgres |
| OAuth | P2 | нет |

Аналитика: только имена событий [PRD §9.2](../prd/PRD.md). Текст рукописи, промпты и ответы AI **не** пишутся в логи и аналитику (TZ-SEC-10).

---

## Безопасность (факт vs ТЗ §7.2)

| Область | Факт | Норматив |
|---------|------|----------|
| Пароли | Better Auth, min 8 | scrypt/argon2id; не SHA-1/MD5 |
| Сессии | HTTP-only cookie | + Secure prod, инвалидация на logout/reset |
| CSRF | Next.js / Better Auth | TZ-SEC-08 |
| Вход | Zod + session на actions | ≤5 неудач / 10 мин / IP+email → `RATE_LIMITED` |
| Изоляция | `assertProjectOwner` / `getNodeWithAuth` | каждый серверный метод |
| Файлы | нет upload | MIME whitelist, лимит, без executable |
| Rate limit | нет | TZ-SEC-09, квоты AI |

---

## Развёртывание

Окружения норматив: `local`, `preview` (PR), `staging`, `production` (TZ-ENV-06). Факт: local + GitHub Actions CI; preview/staging/prod не подключены. CD — placeholder, см. [CI-CD.md](./CI-CD.md).

| Вариант | Статус |
|---------|--------|
| Local | `docker-compose.yml` — только PostgreSQL 16; app через `pnpm dev` |
| Cloud SaaS | цель Vercel/Railway + managed Postgres; секреты не заданы |
| Self-hosted | цель: Next standalone + Postgres; compose для app ещё нет |

Секреты (TZ-ENV-07): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ENCRYPTION_SECRET`, ключи почты/AI. Шаблон: `.env.example`.

Миграции: только вперёд совместимые на release gate (TZ-REL-05). Rollback деплоя **без** затирания данных пользователя.

---

## После MVP

- Real-time collab (Yjs / Liveblocks) — Won't MVP
- BullMQ для тяжёлого экспорта, если синхронный DOCX не укладывается в timeout
- Redis: rate limit, сессии при горизонтальном масштабе
- Визуальный граф героев — P2

---

## Changelog

| Дата | Изменение |
|------|-----------|
| — | Первичный обзор (главы, BYOK как основной AI, DailyStat в ядре) |
| 2026-08-20 | ORM: Prisma → Drizzle (DEC-013) |
| 2026-08-13 | Согласование с ТЗ v1.2 / PRD v2.1: ManuscriptNode, platform AI, gap-таблица, Ink Studio как UI SoT |
