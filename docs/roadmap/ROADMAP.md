# Roadmap

> **PRD:** [PRD v2.1](../prd/PRD.md) §12–§13  
> **BRD:** [BRD v1.1](../brd/BRD.md) §4.3, §9, BG-1…BG-6  
> **ТЗ:** [TZ v1.2](../tz/TZ.md) §9  
> **Scope (P0/P1/P2 ↔ sprint ↔ release):** [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)  
> **Решения:** [DECISION-LOG.md](./DECISION-LOG.md)  
> **Чеклист реализации:** [openspec/changes/develop-mvp/tasks.md](../../openspec/changes/develop-mvp/tasks.md)  
> **Обновлено:** 20 августа 2026

Спринтовый трекер поставки. Состав релиза и приоритеты — в матрице. Поведение — в PRD / Use Cases. Контракты и приёмка — в ТЗ.

**Правило при расхождении:** scope → матрица; поведение → PRD; контракты → ТЗ; статусы спринтов → этот файл.

```
Phase 0 ✅ ──► прототип, документация, CI
     │
Phase 1 ──► Closed Alpha     ← P0 ядро (BG-1 / PRD §12.1 / ТЗ §9.2)
     │
Phase 2 ──► MVP Beta         ← все P0 + P1 (BG-2 / PRD §12.2 / ТЗ §9.3)
     │
Phase 3 ──► Public Launch    ← тарифы, OAuth, legal (BG-6 / DEC-004, DEC-007)
     │
Phase 4 ──► Post-MVP         ← P2 / Could
```

**Сейчас:** Phase 1, Sprint 3 ядро редактора закрыто. Следующий кусок — база знаний Alpha (герои, локации, связи).

---

## Phase 0 — Подготовка ✅

Инфра готова к разработке (BRD §4.3, ТЗ §9.1).

- [x] PRD / BRD / ТЗ и структура документации
- [x] Структура monorepo
- [x] Drizzle schema (целевая модель; P2-таблицы в схеме, не в UI)
- [x] CI/CD pipeline (GitHub Actions)
- [x] PostgreSQL — нативная установка Windows (`scripts/setup-db.ps1`)
- [x] Landing page

---

## Phase 1 — Closed Alpha (Этап 1)

**Deliverable (BRD):** ядро письма + структура + описание героев и локаций + связи между героями + экспорт DOCX/TXT; старт **без** обязательного метода сюжета (`plotMethod = blank`).

**Не требуется на Alpha (PRD §12.1, ТЗ §9.2):** AI, plot board, методы кроме `blank`, timeline, import, full-text, billing, confirm email, история версий.

Спринты 1–3 и P0 из 4 и 6. Детальные задачи — OpenSpec §1–7.

### Sprint 1: Foundation ✅

- [x] Next.js 15 + Tailwind + shadcn/ui
- [x] PostgreSQL + Drizzle
- [x] Better Auth (email/password; сессия без confirm)
- [x] i18n (next-intl, ru/en)
- [x] Базовый layout (sidebar, header)
- [x] Landing page

### Sprint 2: Projects & Manuscript structure ✅

- [x] CRUD проектов (создание только по названию) — FR-PRJ-01
- [x] Карточки, архив, сортировка, поиск/фильтр на dashboard — FR-PRJ-02, FR-PRJ-03
- [x] Дублирование, переименование, удаление с подтверждением — FR-PRJ-04
- [x] Onboarding: «Начать писать» / «Спланировать сюжет» / «Добавить материалы» — FR-PRJ-05
- [x] Обзор проекта: continue, counts, next step (без ложного % без цели объёма) — FR-PRJ-06
- [x] ManuscriptNode: части, главы, сцены (CRUD) — FR-MS-01
- [x] Навигатор: дерево, статусы сцен, сворачивание уровней — FR-MS-02
- [x] Drag-and-drop порядка и move с проверкой циклов — FR-MS-03
- [x] Нераспределённые сцены (`parentId` null) — FR-MS-04
- [x] Soft delete + корзина + restore — FR-MS-05
- [x] Поиск по названиям в навигаторе — FR-MS-06

Контекстное меню навигатора — частично (инлайн-действия, не отдельное меню). Не блокер Alpha.

### Sprint 3: Scene editor ✅

Ядро редактора (FR-ED-01…07). История версий и merge UX — **Phase 2** (FR-ED-08).

- [x] TipTap: абзацы, bold/italic/strike, списки, undo/redo
- [x] Автосохранение (debounce 2 с, Ctrl/Cmd+S, blur)
- [x] Локальный буфер IndexedDB при потере сети
- [x] Конфликт 409: «загрузить с сервера» / «оставить моё» (без тихого overwrite)
- [x] Подсчёт слов и знаков
- [x] Empty / loading / error / deleted состояния редактора
- [x] `<900px`: сцена read-only, rich-text не монтируется
- [x] Трёхколоночный Ink Studio: rail | navigator | лист | inspector (compact прячет inspector)
- [x] Метаданные сцены (цель, конфликт, POV, локация, участники) во вкладках inspector
- [x] Режим фокуса и шорткаты (Ctrl/Cmd+Shift+F, Alt+↑/↓, Escape)

### Sprint 4 (P0): Knowledge base — Alpha ⬜

Must к Alpha (BRD BR-FR-05…05c, PRD FR-KN-01…03a, 08, 10). Сюжетные методы, доска, таймлайн, заметки, FTS — Sprint 4 P1 / Phase 2.

- [ ] Карточки героев (имя обязательно; описание опционально) — FR-KN-01
- [ ] Связи герой ↔ сцена — FR-KN-02
- [ ] Описание локаций и прочие статьи мира — FR-KN-03, FR-KN-03a
- [ ] Связи между героями (тип + комментарий; не визуальный граф) — FR-KN-10
- [ ] Глобальный поиск по названиям (узлы, герои, мир) — FR-KN-08

### Sprint 6 (P0): Export DOCX/TXT ⬜

- [ ] Экспорт выбранной области в DOCX и TXT — FR-IO-01, ТЗ §8.4
- [ ] Диалог формата и scope (ru/en); пустой набор → ошибка, без файла

PDF / Markdown / ZIP и импорт — Phase 2.

### Closed Alpha gate ⬜

Сценарий (PRD §12.1, ТЗ §9.2, BRD BG-1):

**регистрация → проект → структура → сцена → герой и локация → связь между героями → экспорт DOCX/TXT**, без потери текста при кратком offline (TZ-REL-01).

- [ ] Walkthrough сценария выше
- [ ] Offline ~5 мин / kill-tab: буфер сцены восстанавливается
- [ ] Изоляция: нельзя читать или менять чужой проект
- [ ] P0-экраны: empty / loading / error / no-access; ru и en без сырых ключей
- [ ] `docs/technical/` (API, DATABASE, OpenAPI) обновлены под Alpha
- [ ] Скрыты entry points plot / AI / import / billing

---

## Phase 2 — MVP Beta (Этап 2)

**Deliverable (BRD):** все P0 + P1; Must-методы сюжета доступны при создании/планировании (`blank`, `three-act`, `heros-journey`, `beat-sheet`).

**«MVP» продукта = этот этап**, не Alpha и не Public Launch (матрица, PRD §13).

Биллинг и тарифы сюда **не входят** (Phase 3 / DEC-004).

### Sprint 3 leftover: Versions (P0 к Beta)

- [ ] Снимки `SceneVersion` при успешном изменении текста; restore UI — FR-ED-08
- [ ] Conflict UX до Beta-бара: явный merge/выбор, без тихого discard

### Sprint 4 (P1): Plot, notes, search

- [ ] Каталог методов + доска + DnD; смена метода не удаляет текст сцен — FR-KN-05, DEC-009
- [ ] Сюжетные линии (Storyline)
- [ ] Таймлайн — список событий по story time (не визуальный граф) — FR-KN-06
- [ ] Заметки (текст + ссылки); файлы по DEC-010 — FR-KN-07
- [ ] Обратные ссылки на карточках героя/локации — FR-KN-04
- [ ] PostgreSQL FTS + подсветка — FR-KN-09
- [ ] Command palette Ctrl/Cmd+K — FR-ED-09

### Sprint 5: AI assistant (P1)

- [ ] Чат с выбором контекста Level 0–3 (не 4–5) — FR-AI-01
- [ ] Анализ / редактура выделения — FR-AI-02
- [ ] Принять / принять фрагмент / отклонить; никогда auto-apply
- [ ] Прозрачность контекста и источников — FR-AI-03
- [ ] Consent, do-not-store, квота, `AI_ENABLED` — FR-AI-04, DEC-005/006

### Sprint 6 (P1): Extended IO, auth, polish

- [ ] Экспорт PDF, Markdown, ZIP `manuscript-export` v1 — FR-IO-02
- [ ] Импорт DOCX/TXT/MD/paste и ZIP с preview; флаг `IMPORT_ENABLED` — FR-IO-03
- [ ] Confirm email, reset пароля, профиль, удаление аккаунта + выгрузка — FR-AUTH-03…06
- [ ] Empty/loading/error на всех P0-экранах; desktop-first, mobile read-only
- [ ] WCAG 2.1 AA на P0; критичные потоки с клавиатуры
- [ ] Privacy policy + AI consent (DEC-007 — gate Beta, не Alpha)
- [ ] Аналитика: именованные события, без текста рукописи
- [ ] Ежедневный backup БД, мониторинг ошибок (в т.ч. autosave fail без текста)
- [ ] Usability ≥5 авторов; ≥70% тестовых авторов до первой сохранённой сцены (PRD §12.2)

### MVP Beta gate ⬜

- [ ] 100% P0+P1 матрицы (ТЗ §9.3)
- [ ] Политики ТЗ §8.1, §8.4, §8.5
- [ ] Критичные DEC для Beta — Accepted или явно сняты
- [ ] Feature flags AI и import выключаемы без деплоя кода

---

## Phase 3 — Public Launch (Этап 3)

PRD §12.3, BRD BG-6. Не смешивать с Beta.

- [ ] Тарифы free/paid (DEC-004)
- [ ] OAuth (Google/Apple) — FR-AUTH-07 / P2 в матрице, план Launch
- [ ] Onboarding v2
- [ ] Справка и документация
- [ ] Legal docs (DEC-007) в продакшен-виде
- [ ] Расширенная аналитика активации

---

## Phase 4 — Post-MVP

P2 / Could (PRD §3.4, BRD §4.2). Не расширять Beta этими пунктами.

- [ ] Real-time collaboration
- [ ] Редакторский кабинет, комментарии
- [ ] Визуальный граф отношений героев
- [ ] Визуальный масштабируемый таймлайн
- [ ] Кастомные поля, пользовательские шаблоны
- [ ] AI Level 4–5, consistency check, профиль стиля, BYOK
- [ ] WritingGoal / DailyStat UI (DEC-012 → P2)
- [ ] API и интеграции, облачные диски
- [ ] Нативное мобильное приложение
- [ ] Could-методы сюжета (`snowflake-lite`, `string`, `index-cards`, …)

---

## Sprint ↔ release

| Sprint | Фокус | Gate |
|--------|-------|------|
| 1 ✅ | Foundation | Phase 0 |
| 2 ✅ | Projects + дерево рукописи | → Alpha |
| 3 ✅ | Редактор сцены (ядро) | → Alpha; версии → Beta |
| 4 | Знания: P0 герои/мир/связи → Alpha; P1 сюжет/поиск → Beta | split |
| 5 | AI assistant | → Beta |
| 6 | P0 экспорт DOCX/TXT → Alpha; P1 IO + auth + polish → Beta | split |

Очередь реализации (design `develop-mvp`): остаток Sprint 3 → Knowledge P0 → экспорт → Alpha gate → затем P1.

---

## Связанные документы

- [MVP Scope Matrix](./MVP-SCOPE-MATRIX.md) — состав релиза
- [PRD §12](../prd/PRD.md) — критерии приёмки Alpha / Beta / Launch
- [BRD §4.3](../brd/BRD.md) — бизнес-deliverables фаз
- [ТЗ §9](../tz/TZ.md) — чеклисты приёмки
- [plot-methods.md](../brd/plot-methods.md) — Must-методы к Beta
- [DECISION-LOG.md](./DECISION-LOG.md)
