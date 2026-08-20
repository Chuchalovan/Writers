# CI/CD

> **Норматив:** [ТЗ §7.1](../tz/TZ.md#71-техническое-обеспечение) TZ-ENV-04/06/07, [§7.4](../tz/TZ.md#74-надёжность-и-доступность) TZ-REL-03/05, [§9.4 DoD](../tz/TZ.md#94-критерии-готовности-изменения-definition-of-done)  
> **Факт:** `.github/workflows/ci.yml`, `cd.yml`  
> **Обновлено:** 20 августа 2026

CI на каждый PR: install → typecheck → lint → drizzle migrate → build.  
Деплой и ops (backup, мониторинг, preview/staging) — цель к Beta, сейчас placeholder.

---

## Окружения (TZ-ENV-06)

| Env | Назначение | Факт |
|-----|------------|------|
| `local` | `pnpm dev` + Postgres 16 (`docker-compose.yml`) | ✅ |
| `preview` | деплой PR | ⬜ |
| `staging` | замеры NFR, backup drill | ⬜ |
| `production` | пилот / Beta | ⬜ CD job без провайдера |

Версии lockfile: Node **≥20**, pnpm **9.15.0**, PostgreSQL **16**. CI: `node-version: 20`, `postgres:16-alpine`.

---

## CI (`ci.yml`)

Триггер: push и pull_request в `main`. Concurrency: `cancel-in-progress` на одном ref.

Env в workflow (только CI, не секреты продукта): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ENCRYPTION_SECRET`, `NEXT_PUBLIC_APP_URL`.

### Job `quality` — Lint, Typecheck & Build

Сервис: Postgres 16, БД `manuscript_test`.

| Step | Команда |
|------|---------|
| Install | `pnpm install --frozen-lockfile` |
| Typecheck | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Schema | `pnpm db:migrate` (`drizzle-kit migrate`) на test DB |
| Build | `pnpm build` |

### Job `validate` — только PR

`drizzle-kit check`. Сверка TypeScript-схемы с SQL-миграциями, **не** прогон на живой БД.

### Gap CI

| Нужно к Alpha/Beta | Сейчас |
|--------------------|--------|
| Unit / component tests | нет job |
| e2e критичного потока (регистрация → сцена) | нет |
| `drizzle-kit migrate` на копии prod-схемы | нет (CI гоняет migrate на пустой test DB) |
| i18n check (сырые ключи) | нет |
| Secret scan | нет |

DoD ТЗ §9.4: «CI зелёный» = этот pipeline. Новые модули не обязаны иметь e2e, пока job не добавлен; typecheck+lint+build — обязательны.

---

## CD (`cd.yml`)

Триггер: push в `main`, `workflow_dispatch`. `cancel-in-progress: false`.

| Job | Факт |
|-----|------|
| `build` | `pnpm build`; артефакт `apps/web/.next`, 7 дней. **Без** Postgres service — build не гоняет migrate |
| `deploy` | echo-placeholder; environment GitHub `production` |

Подключение Vercel (когда будут secrets): раскомментировать шаг в `cd.yml`.

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Альтернатива: Railway / VPS + Docker standalone. Архитектура не требует Vercel.

### Норматив деплоя (ещё не сделано)

- Миграции Drizzle **только вперёд** совместимые на gate (TZ-REL-05).
- Rollback приложения **без** затирания пользовательских данных.
- Preview на PR — отдельный env, не prod DB.

---

## Секреты

Шаблон: `.env.example`. В CI подставляются фиктивные значения.

| Переменная | Где | Обязательность |
|------------|-----|----------------|
| `DATABASE_URL` | все env | да |
| `BETTER_AUTH_SECRET` | все | да, ≥32 |
| `BETTER_AUTH_URL` | все | да |
| `ENCRYPTION_SECRET` | все | да (даже до BYOK) |
| `NEXT_PUBLIC_APP_URL` | все | да |
| SMTP / mail provider | staging, prod | Beta |
| Platform AI key | staging, prod | P1; не в клиент |
| `VERCEL_*` | GitHub secrets | если выбран Vercel |

Секреты только в env, не в репозитории (TZ-ENV-07). Рукопись и AI-промпты не логировать (TZ-SEC-10) — проверить при подключении error tracker.

---

## Ops к Beta (TZ-REL-03)

Не часть текущего workflow:

- [ ] Ежедневный backup PostgreSQL (staging/prod)
- [ ] Мониторинг ошибок клиента и сервера
- [ ] Алерт `scene_autosave_failed`
- [ ] Feature flags AI и импорта без деплоя кода (ТЗ §8.6)

---

## Локально (как CI)

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
```

Postgres: `docker compose up -d` (сервис `postgres`, порт 5432).  
Миграции в разработке: `pnpm db:migrate` или `pnpm db:push`.  
Схема на CI: `drizzle-kit migrate`. Production start: `drizzle-kit migrate` перед `next start`.

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-20 | Prisma → Drizzle: generate убран, CI migrate, validate = drizzle-kit check |
| 2026-08-04 | ci.yml / cd.yml: pnpm, Prisma, Postgres 16, build artifact |
| 2026-08-13 | Документ сверен с ТЗ: env matrix, gap тестов/migrate/ops, уточнён job validate |
