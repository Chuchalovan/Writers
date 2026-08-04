# PRD — Manuscript

> **Продукт:** «Манускрипт» — рабочая среда для авторов художественной прозы  
> **Версия документа:** 1.1 (consolidated)  
> **Дата:** 4 августа 2026  
> **Статус:** рабочая спецификация для проектирования и разработки  
> **Базовый PRD:** [Манускрипт — PRD v1.0](./Манускрипт%20—%20Product%20Requirements%20Document%20(PRD)%20v1.0.md) (30 июля 2026)  
> **Figma:** [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)

---

## О документе

Этот файл — **единый продуктовый документ**, собранный из переработанных артефактов v1.0:

| Было | Содержание в этом PRD |
|------|------------------------|
| PRD v1.0 | Продукт, UX, функциональные требования, экраны |
| MVP-SCOPE-MATRIX | Приоритеты P0/P1/P2, спринты, релизы, статус |
| DECISION-LOG | Открытые и принятые решения (§17) |
| DESIGN-HANDOFF | Figma, tokens, экраны, компоненты |
| DATABASE.md | Модель данных (Prisma ↔ PRD §9) |
| FIGMA-VARIABLES / CODE-CONNECT | Design tokens и связь с кодом |

**Правило при расхождении:** побеждает **§3 Scope Matrix** этого документа.

**Текущая разработка:** [ROADMAP.md](./ROADMAP.md) · **Архитектура:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 1. Резюме продукта

«Манускрипт» объединяет планирование книги, персонажей, мира, сюжетную структуру, части/главы/сцены, написание текста и контекстную помощь AI.

**Главная ценность:** снизить когнитивную нагрузку — хранить замысел, факты и связи в одной системе, помогать видеть целое и быстро переходить от планирования к написанию.

**Целевая платформа MVP:** адаптивное веб-приложение, **desktop-first**.

**MVP (в смысле PRD):** завершение **MVP Beta** = все **P0 + P1** (не Closed Alpha и не Public Launch).

### 1.1. Цели MVP

Помочь автору создать структуру книги и последовательно написать первый черновик.

### 1.2. Не-цели MVP

Социальная сеть, маркетплейс редакторов, профессиональная вёрстка, автопубликация, real-time co-authoring, генерация целой книги одной командой, полнофункциональное mobile-приложение.

### 1.3. Аудитория

| Сегмент | Потребность |
|---------|-------------|
| Начинающий автор | Подсказки, шаблоны, понятная последовательность |
| Автор-планировщик | Структура, фильтры, связи, таймлайн |
| Автор-импровизатор | Быстрый старт со сцены, структура по мере роста |

### 1.4. Принципы UX

1. **Автор остаётся главным** — AI не меняет текст без явного действия  
2. **Прогрессивное раскрытие** — простой путь для новичка, глубина для планировщика  
3. **Контекст рядом с текстом** — персонажи, локация, цель сцены в боковой панели  
4. **Спокойный интерфейс** — нейтральный фон, минимум акцентов  
5. **Данные принадлежат автору** — автосохранение, версии, экспорт  

---

## 2. Релизы и gates

```
Phase 0 ✅ ──► Прототип, документация, CI
     │
Phase 1 ──► Closed Alpha     ← P0 ядро
     │
Phase 2 ──► MVP Beta         ← P0 + P1 = «MVP»
     │
Phase 3 ──► Public Launch    ← тарифы, OAuth, справка
     │
Phase 4 ──► Post-MVP         ← P2 и backlog
```

### Closed Alpha

Автор: **регистрация → проект → структура → сцена → персонаж/локация → экспорт DOCX/TXT** без потери текста при кратком offline.

**Не требуется:** AI, plot board, templates, timeline, import, full search, billing.

### MVP Beta (= MVP)

Все P0 + P1. Критерии готовности PRD v1.0 §16: usability (≥5 авторов), a11y, privacy, мониторинг.

### Public Launch

Тарифы, OAuth, onboarding v2, справка, расширенная аналитика.

---

## 3. Scope Matrix

> Единый источник истины для приоритетов. При противоречии §13/§14/§27 исходного PRD побеждает эта таблица.

### Решения по расхождениям PRD v1.0

| Противоречие | Решение |
|--------------|---------|
| §13.1 vs §27: сюжет/AI/templates в MVP | **§27:** plot/templates/AI/timeline = **P1 → Beta** |
| Поиск «в MVP» vs P0 | **Split:** по названиям P0; полнотекст P1 |
| Экспорт все форматы vs P0 | **Split:** DOCX/TXT P0; PDF/Markdown/ZIP P1 |
| Auth recovery в §6.1 MVP, Sprint 6 | Core auth Sprint 1; reset/profile/delete → **Sprint 6, gate Beta** |
| WritingGoal, DailyStat в Prisma | **P2** до DEC-012 |

### Foundation & Auth

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Platform | Next.js, Tailwind, shadcn, monorepo, CI | — | 1 | Phase 0 | ✅ |
| Auth | Регистрация / вход / выход (email) | P0 | 1 | Alpha | ✅ |
| Auth | i18n ru/en, Landing, Layout | P0 | 1 | Alpha | ✅ |
| Auth | Email confirm, password reset, profile, delete account | P0 | 6 | Beta | ⬜ |
| Auth | OAuth, 2FA, workspaces | P2 | — | Launch+ | ⬜ |

### Projects & Dashboard

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Projects | CRUD (создание по названию) | P0 | 2 | Alpha | ✅ |
| Projects | Карточки, архив, onboarding §22 | P0 | 2 | Alpha | 🟡 |
| Projects | DnD, фильтры, дублирование | P0 | 2 | Alpha | 🟡 |
| Projects | Project overview (continue, progress) | P0 | 2 | Alpha | 🟡 |

### Manuscript Structure

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Manuscript | Части → главы → сцены (CRUD) | P0 | 2 | Alpha | ✅ |
| Manuscript | Дерево, статусы сцены | P0 | 2 | Alpha | ✅ |
| Manuscript | Drag-and-drop порядка | P0 | 2 | Alpha | ⬜ |
| Manuscript | Soft delete + корзина | P0 | 3 | Alpha | ⬜ |
| Manuscript | Поиск по названиям в навигаторе | P0 | 2 | Alpha | ⬜ |

### Scene Editor (ядро)

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Editor | TipTap, форматирование, 3-column layout | P0 | 3 | Alpha | ⬜ |
| Editor | Autosave, offline buffer, word count, focus mode | P0 | 3 | Alpha | ⬜ |
| Editor | Метаданные сцены + контекстная панель | P0 | 3 | Alpha | ⬜ |
| Editor | Version history, conflict UX | P0 | 3 | Beta | ⬜ |
| Editor | Command palette (Ctrl+K) | P1 | 4 | Beta | ⬜ |

### Knowledge Base

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Characters | Карточки + связи со сценами | P0 | 4 | Alpha | ⬜ |
| World | Локации и статьи мира | P0 | 4 | Alpha | ⬜ |
| Plot | Доска + шаблоны (3-act, Hero's Journey, …) | P1 | 4 | Beta | ⬜ |
| Timeline | Список событий | P1 | 4 | Beta | ⬜ |
| Notes | Заметки и материалы | P1 | 4 | Beta | ⬜ |
| Search | Глобальный по названиям | P0 | 4 | Alpha | ⬜ |
| Search | Полнотекстовый | P1 | 4 | Beta | ⬜ |

### AI Assistant

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| AI | Чат с выбором контекста (Level 0–3) | P1 | 5 | Beta | ⬜ |
| AI | Редактура выделенного, diff accept/reject | P1 | 5 | Beta | ⬜ |
| AI | Hybrid platform + BYOK (DEC-005) | P1 | 5 | Beta | ⬜ |
| AI | Consistency check, style profile | P2 | — | Post-MVP | ⬜ |

### Import / Export

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| Export | DOCX, TXT | P0 | 6 | Alpha | ⬜ |
| Export | PDF, Markdown, ZIP | P1 | 6 | Beta | ⬜ |
| Import | DOCX, TXT, Markdown + wizard | P1 | 6 | Beta | ⬜ |

### Cross-cutting

| Область | Возможность | P | Sprint | Release | Статус |
|---------|-------------|---|--------|---------|--------|
| UX | Empty/loading/error states | P0 | 6 | Beta | ⬜ |
| UX | Desktop-first, mobile read-only (DEC-008) | P0 | 6 | Beta | ⬜ |
| UX | WCAG AA, keyboard | P0 | 6 | Beta | ⬜ |
| Ops | Privacy policy, analytics (без текста рукописи) | P0/P1 | 6 | Beta | ⬜ |
| Ops | Тарифы, billing | P2 | — | Launch | ⬜ |

### Post-MVP (P2)

Real-time collab, ProjectMember, WritingGoal/DailyStat, editor cabinet, custom fields, diff UI, series, API, native mobile.

---

## 4. Ключевые user flows

### 4.1. Создание проекта (§22)

Минимум — рабочее название. После создания: **«Начать писать»** · **«Спланировать сюжет»** · **«Добавить материалы»**.

### 4.2. Цикл работы со сценой

Открыть сцену → контекст → написать → метаданные → связи → следующая сцена.

### 4.3. AI (§7, §23.7)

Контекст выбирается до отправки. Результат **не вставляется автоматически** — diff, «Принять» / «Отклонить».

---

## 5. Scene Editor — спецификация (P0 critical)

**Route:** `/projects/[projectId]/scenes/[sceneId]`  
**Figma:** [10.07 Scene Editor](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-211) (`9:211`)

### 5.1. Layout

| Zone | Width | Content |
|------|-------|---------|
| Top bar | 100% | breadcrumb, title, status, save, words, focus, versions, AI |
| Left nav | 240–280px | tree, DnD, context menu |
| Editor | flex ~65ch | TipTap, floating toolbar |
| Right panel | 300–360px | Scene / Characters / World / Links / Notes |

### 5.2. Save indicator

| State | Label (ru) |
|-------|------------|
| saving | «Сохраняем…» |
| saved | «Сохранено» |
| local | «Сохранено на устройстве» |
| conflict | «Конфликт» |
| error | «Ошибка — повторить» |

### 5.3. Editor states (§23.5)

| State | Figma | Sprint 3 |
|-------|-------|----------|
| normal | `9:211` ✅ | |
| empty | `14:2` ✅ | |
| loading | `14:69` ✅ | |
| local newer | — | ⬜ |
| read-only | — | ⬜ |
| conflict | — | ⬜ |
| error | — | ⬜ |

### 5.4. Keyboard (§23.8)

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+S | Force sync |
| Ctrl/Cmd+Shift+F | Focus mode |
| Alt+↑/↓ | Prev/next scene |
| Ctrl/Cmd+K | Command palette |
| Escape | Close overlays |

### 5.5. Scene status lifecycle

`idea → planned → draft → revision → ready` — не блокирует редактирование; icon + label (не только цвет).

---

## 6. Design System

### 6.1. Источники

| Слой | Файл / ресурс |
|------|---------------|
| Code tokens | `apps/web/src/app/globals.css` |
| Tailwind | `apps/web/tailwind.config.ts` |
| Figma file | `7vP03INYMrwQ3Q6qT7A2NT` |
| Token export | `apps/web/design-tokens/manuscript-tokens.json` |
| Figma sync scripts | `apps/web/scripts/figma-sync-*.js` |

### 6.2. Typography

| Role | Font | Usage |
|------|------|-------|
| UI / body | Inter | Nav, forms, labels |
| Display | Source Serif 4 | Hero, project titles |
| Mono | system mono | Word count, timestamps |

### 6.3. Color tokens (light)

| Token | HSL | Role |
|-------|-----|------|
| `background` | `40 25% 98%` | Page bg |
| `foreground` | `24 10% 14%` | Body text |
| `accent` | `24 28% 38%` | Links, highlights |
| `muted-foreground` | `24 6% 46%` | Secondary text |
| `destructive` | `0 72% 51%` | Errors, delete |
| `sidebar-background` | `38 20% 96%` | Nav panel |

**Scene status:** `--status-idea` … `--status-ready` → Tailwind `text-status-*`.

**Figma collection (target):** `Manuscript / Color` — 29 vars, modes Light/Dark. Spec: [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md).

### 6.4. Breakpoints (DEC-008)

| Token | Min width | Behavior |
|-------|-----------|----------|
| desktop | 1280px | 3 columns |
| compact | 900px | Collapsible panels |
| mobile | <900px | Read-only scene view |

### 6.5. Figma structure

```
Manuscript Design System (Starter — max 3 pages)
├── 00 Foundations          ← tokens, swatches (TODO publish)
├── 01 Components           ← UI Kit (11 components, node 8:2)
└── 10 Screens — P0/P1      ← screens + auth co-located
```

### 6.6. Screen inventory (P0)

| Screen | Route | Figma node | Sprint |
|--------|-------|------------|--------|
| Landing | `/[locale]` | `14:142` | 1 ✅ |
| Login / Register | `/login`, `/register` | `14:192`, `14:202` | 1 ✅ |
| Dashboard | `/projects` | `9:2` | 2 |
| Project overview | `/projects/[id]` | `9:65` | 2 |
| **Scene editor** | `…/scenes/[id]` | **`9:211`** | **3** |
| Characters | `…/characters` | `9:278` | 4 |
| World | `…/world` | `14:149` | 4 |

**P1 screens:** Plot `9:135`, Timeline `9:340`, AI Panel `9:427`. Missing Figma: Notes, Search, Settings, Import.

### 6.7. UI Kit → Code (Code Connect)

| Figma | Code | Status |
|-------|------|--------|
| Button/Primary, Secondary, Ghost | `@/components/ui/button` | ✅ 7 templates |
| Navigation Item | `sidebar.tsx` | ✅ |
| Card/Scene | `project-card.tsx` | ✅ |
| Tree item (`9:239`) | `manuscript-tree.tsx` | ✅ |
| Chip/*, Panel/AI Review | — | ⬜ |

Publish в Figma blocked: Starter plan (Org required). Детали: [CODE-CONNECT.md](./CODE-CONNECT.md).

### 6.8. Обязательные состояния экранов (§8.5)

normal · empty · loading · error · no-access/deleted

---

## 7. Модель данных

**Реализация:** `apps/web/prisma/schema.prisma`  
**Полная целевая модель:** PRD v1.0 §9

### 7.1. ER (текущая)

```
User ──1:N── Project ──1:N── ManuscriptNode ──0:1── SceneContent
                  ├── Character
                  ├── WorldArticle
                  ├── DailyStat      (P2)
                  └── WritingGoal    (P2)
User ── UserApiKey (Sprint 5)
```

### 7.2. Sync matrix (PRD §9 ↔ Prisma)

| PRD | Prisma | Sprint | Status |
|-----|--------|--------|--------|
| User | User | 1 | 🟡 Partial |
| Project | Project | 2 | 🟢 |
| ManuscriptNode | ManuscriptNode | 2–3 | 🟢 |
| SceneContent | SceneContent | 3 | 🟡 (no `updated_by`) |
| Character | Character | 4 | 🟡 Partial |
| WorldArticle | WorldArticle | 4 | 🟢 |
| SceneMetadata | — | 4 | ⬜ |
| Storyline, StoryBeat, TimelineEvent | — | 4 P1 | ⬜ |
| Note, AIConversation, Version | — | 5+ | ⬜ |
| ProjectMember | — | Post-MVP | ⬜ |

### 7.3. Инварианты (§24.1)

- Scene = `ManuscriptNode` type `scene`
- `SceneContent` отдельно от дерева (частые saves)
- Soft delete для сущностей
- `SceneContent.version` — optimistic concurrency
- Word count — кэш, пересчёт из `plainText`

### 7.4. Scene status enum

`idea | planned | draft | revision | ready`

---

## 8. Технологии

| Слой | Выбор | DEC |
|------|-------|-----|
| App | Next.js 15, TypeScript | DEC-001 ✅ |
| UI | Tailwind, shadcn/ui | DEC-001 ✅ |
| DB | PostgreSQL + Prisma | DEC-001 ✅ |
| Auth | Better Auth | DEC-001 ✅ |
| i18n | next-intl (ru/en) | DEC-001 ✅ |
| Editor | TipTap 2.x (Proposed) | DEC-002 🟡 |
| Document format | TipTap JSON + plainText | DEC-003 🟡 |
| AI | Hybrid platform + BYOK | DEC-005 🟡 |
| Monorepo | pnpm workspaces | DEC-001 ✅ |

---

## 9. Decision Log

| ID | Решение | Статус | Deadline | Блокирует |
|----|---------|--------|----------|-----------|
| DEC-001 | Stack: Next.js, Prisma, Better Auth | ✅ Accepted | — | — |
| DEC-002 | Editor: TipTap | 🟡 Proposed | Sprint 3 | Scene editor |
| DEC-003 | `contentJson` TipTap schema | 🟡 Proposed | Sprint 3 | Import/export |
| DEC-004 | Тарифы free/paid | ⬜ Open | Launch | Billing |
| DEC-005 | AI: Hybrid + BYOK | 🟡 Proposed | Sprint 5 | AI sprint |
| DEC-006 | AI privacy / retention | 🟡 Proposed | Sprint 5 | AI sprint |
| DEC-007 | Legal / jurisdiction | ⬜ Open | Beta gate | Launch |
| DEC-008 | Mobile: read-only | 🟡 Proposed | Sprint 6 | Responsive |
| DEC-009 | Plot template content | ⬜ Open | Sprint 4 | Plot board |
| DEC-010 | File/image limits | ⬜ Open | Sprint 4 | Notes |
| DEC-011 | Figma handoff & variables | 🟡 Partial | Beta | Design QA |
| DEC-012 | WritingGoal / DailyStat scope | 🟡 Proposed → P2 | Sprint 6 | — |

Полные записи: [DECISION-LOG.md](./DECISION-LOG.md)

---

## 10. Критерии готовности MVP (§16)

- [ ] ≥70% тестовых авторов завершают путь до первой сохранённой сцены  
- [ ] Нет потери подтверждённого текста при типичном offline  
- [ ] Usability-тесты ≥5 авторов  
- [ ] WCAG AA на P0 экранах  
- [ ] Privacy policy + AI consent  
- [ ] Мониторинг ошибок, бэкапы  
- [ ] Схема данных подтверждена миграциями  

---

## 11. Текущий статус (4 августа 2026)

| Область | Прогресс |
|---------|----------|
| Phase 0 | ✅ Complete |
| Sprint 1 | ✅ Complete |
| Sprint 2 | ~60% (projects, tree; DnD, overview pending) |
| Sprint 3 | ⬜ Scene editor — next blocker |
| Figma frames P0 | 🟡 10/14 |
| Figma variables | 🟡 Spec ready, publish pending |
| Code Connect | 🟡 7 templates local, publish pending |
| Prisma vs PRD §9 | 🟡 Core models; metadata/plot/AI tables pending |

---

## 12. Приложения

| Документ | Назначение |
|----------|------------|
| [PRD v1.0 (полный текст)](./Манускрипт%20—%20Product%20Requirements%20Document%20(PRD)%20v1.0.md) | Нормативные §6–§29, user stories, AI spec |
| [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md) | Полная матрица (identical §3) |
| [DECISION-LOG.md](./DECISION-LOG.md) | Детали DEC-001…012 |
| [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md) | Figma node-ids, component map |
| [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) | Tokens, sync scripts |
| [CODE-CONNECT.md](./CODE-CONNECT.md) | Figma ↔ React mappings |
| [DATABASE.md](./DATABASE.md) | Prisma models, migrations backlog |
| [ROADMAP.md](./ROADMAP.md) | Sprint checklist |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-07-30 | PRD v1.0 — исходная спецификация |
| 2026-08-04 | v1.1 consolidated: scope matrix, decisions, design, data, Figma, Code Connect |
