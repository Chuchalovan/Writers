# Roadmap

## Phase 0 — Подготовка ✅

- [x] PRD и документация
- [x] Структура monorepo
- [x] Prisma schema (черновик)
- [x] CI/CD pipeline (GitHub Actions)
- [x] PostgreSQL — нативная установка Windows (скрипт `scripts/setup-db.ps1`)

---

## Phase 1 — MVP Core (4–6 недель)

### Sprint 1: Foundation
- [x] Инициализация Next.js + Tailwind + shadcn/ui
- [x] PostgreSQL + Prisma setup, миграции (нативная установка Windows)
- [x] Better Auth (email/password)
- [x] i18n (next-intl, ru/en)
- [x] Базовый layout (sidebar, header)

### Sprint 2: Projects & Chapters
- [ ] CRUD проектов
- [ ] CRUD глав
- [ ] Навигация: список проектов → проект → глава
- [ ] Drag-and-drop сортировка глав

### Sprint 3: Editor
- [ ] TipTap редактор с базовым форматированием
- [ ] Автосохранение (debounce)
- [ ] Подсчёт слов в реальном времени
- [ ] Режим «фокус»

### Sprint 4: Stats
- [ ] DailyStat tracking при сохранении
- [ ] Дашборд статистики (график, прогресс)
- [ ] Цели по словам (daily / project)
- [ ] Streak

### Sprint 5: AI (BYOK)
- [ ] UI настройки API-ключа
- [ ] Шифрование / хранение ключей
- [ ] AI: правка текста
- [ ] AI: продолжение текста
- [ ] AI: генерация идей
- [ ] AI: чат по проекту

### Sprint 6: Polish
- [ ] Landing page
- [ ] Onboarding flow
- [ ] Error handling & loading states
- [ ] Responsive design
- [ ] Тестирование, баг-фиксы

---

## Phase 2 — Collaboration (6–8 недель)

- [ ] Приглашение пользователей в проект
- [ ] Роли: owner, editor, viewer
- [ ] Комментарии к тексту
- [ ] Совместное редактирование (Yjs / Liveblocks)
- [ ] Уведомления

---

## Phase 3 — Rich Structure (4–6 недель)

- [ ] Персонажи (Character cards)
- [ ] Локации (Location cards)
- [ ] Timeline / хронология
- [ ] Связи между сущностями и главами
- [ ] Outline view (карточки сцен)

---

## Phase 4 — Export & Integrations (3–4 недели)

- [ ] Экспорт: PDF, DOCX, EPUB
- [ ] Импорт из Scrivener / plain text
- [ ] Webhook API
- [ ] OAuth провайдеры (Google, GitHub)

---

## Phase 5 — Platform (ongoing)

- [ ] Подписки / billing
- [ ] Managed AI (без BYOK, с лимитами)
- [ ] Мобильное PWA
- [ ] Офлайн-режим
- [ ] Self-hosted Docker image
- [ ] Marketplace шаблонов / промптов

---

## Приоритеты

```
MVP (Phase 1)  ──────────────────►  Release v1.0
     │
     ├── Phase 2 (Collaboration)  ──►  v1.5
     ├── Phase 3 (Structure)       ──►  v2.0
     ├── Phase 4 (Export)          ──►  v2.5
     └── Phase 5 (Platform)        ──►  v3.0+
```
