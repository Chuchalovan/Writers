## Why

Документация «Манускрипт» (PRD v2.1, ТЗ v1.2, MVP Scope Matrix) уже задаёт продукт и границы, но реализация отстаёт: Phase 0 и Sprint 1 закрыты, Sprint 2 — частично, ядро письма, знаний, экспорта и AI ещё не собраны в проверяемый релиз. Нужна единая OpenSpec-спецификация MVP, чтобы закрыть gap между нормативом и кодом без scope creep и без повторного «изобретения» требований в чате.

**MVP в этом изменении** = Closed Alpha (P0 ядро) + MVP Beta (все P0 + P1). Public Launch (тарифы, OAuth, onboarding v2) и Post-MVP (P2) вне объёма.

## What Changes

- Довести auth: сессия уже есть; к Beta — confirm email, reset пароля, профиль, удаление аккаунта с выгрузкой.
- Завершить проекты и dashboard: поиск/фильтр, дублирование, полный обзор (continue / next step).
- Довести дерево рукописи: DnD, move, нераспределённые сцены, каскадный soft delete + корзина, поиск по названиям.
- Реализовать редактор сцены: TipTap, трёхколоночный layout, автосохранение, IndexedDB-буфер, метаданные, фокус; к Beta — история версий и явный conflict UX.
- Реализовать базу знаний Alpha: карточки героев, локации и статьи мира, связи между героями, связь со сценами, поиск по названиям.
- Реализовать знания Beta: сюжетная доска и методы (`blank` / `three-act` / `heros-journey` / `beat-sheet`), таймлайн-список, заметки, полнотекст, command palette.
- Реализовать обмен: Alpha — экспорт DOCX/TXT; Beta — PDF/Markdown/ZIP `manuscript-export` v1 и импорт с preview.
- Реализовать AI (P1): чат и правка выделения с Level 0–3, прозрачный контекст, accept / fragment / reject; platform-ключ на сервере.
- Выровнять контракты, ошибки, изоляцию данных, i18n ru/en, состояния экранов, a11y P0 и ops-ворота Beta (бэкапы, мониторинг, privacy + AI consent).

**Не входит:** OAuth/2FA/workspaces, real-time collab, визуальный граф героев, визуальный таймлайн, AI Level 4–5, BYOK как обязательный путь, WritingGoal/DailyStat, биллинг, нативное mobile-приложение.

Ломающих внешних API нет: публичного HTTP v1 ещё нет; внутренние Server Actions будут расширены и унифицированы (единый `{ error: { code, message, details } }`).

## Capabilities

### New Capabilities

- `auth-account`: регистрация, вход/выход, сессия; к Beta — confirm email, reset, профиль, удаление + выгрузка.
- `projects`: CRUD по названию, dashboard, архив, поиск, дублирование, onboarding-пути, обзор проекта.
- `manuscript-structure`: части/главы/сцены, навигатор, статусы, DnD/move, нераспределённые сцены, soft delete + корзина, поиск по названиям.
- `scene-editor`: TipTap, layout, автосохранение, offline-буфер, метаданные и контекстная панель, фокус, счётчик слов; к Beta — версии и conflict UX.
- `knowledge-base`: описание героев и локаций, статьи мира, связи герой↔герой и герой↔сцена, поиск по названиям (P0 Alpha).
- `plot-notes-search`: методы сюжета и доска, таймлайн-список, заметки/материалы, полнотекст, command palette (P1 Beta).
- `import-export`: экспорт DOCX/TXT (P0); PDF/Markdown/ZIP и импорт с preview (P1).
- `ai-assistant`: контекстный чат и edit Level 0–3, SSE, diff accept, consent и квоты (P1).
- `platform-quality`: изоляция данных, формат ошибок, i18n, состояния P0-экранов, desktop-first / mobile read-only, a11y, аналитика без текста рукописи, мониторинг и бэкапы к Beta.

### Modified Capabilities

- Нет. В `openspec/specs/` существующих capability-спек нет.

## Impact

- **Код:** `apps/web` (App Router, Server Actions, `lib/`, TipTap, i18n), `packages/shared` (Zod/типы), `packages/ai` (провайдеры), `apps/web/drizzle` (миграции под ТЗ §6.5).
- **API:** целевые Server Actions и REST `/api/v1/ai/*`, `/api/v1/export` по [docs/technical/API.md](../../docs/technical/API.md) и [openapi.yaml](../../docs/technical/openapi.yaml).
- **Интеграции:** Better Auth (уже), transactional email (Beta), platform AI (Beta), object storage для вложений/крупных ZIP (P1 по мере Notes/Export).
- **UI:** Figma Ink Studio + [DESIGN-HANDOFF](../../docs/technical/design/DESIGN-HANDOFF.md); текущий широкий sidebar заменить на rail \| navigator \| sheet \| inspector.
- **Ops:** CI уже есть; к Beta — backup БД, мониторинг ошибок, privacy policy, feature flags AI/import.
- **Норматив при расхождении:** MVP Scope Matrix (состав релиза) → PRD/Use Cases (поведение) → ТЗ (контракты и политики) → `technical/` (факт кода).
