# MVP Scope Matrix

> **PRD:** [PRD v2.0](../prd/PRD.md)  
> **Источник приоритетов:** PRD v1.0 §27 → матрица; в v2.0 — §6  
> **Спринты:** [ROADMAP.md](./ROADMAP.md) Phase 1  
> **Релизы:** PRD v2.0 §12–§13  
> **Обновлено:** 11 августа 2026

Этот документ — **единый источник истины** для scope. При противоречии между PRD v2.0 §6, архивным PRD §13/§14 и ROADMAP побеждает эта матрица.

---

## Как читать

| Колонка | Значение |
|---------|----------|
| **P** | P0 = без этого продукт не работает; P1 = сильно усиливает запуск; P2 = post-MVP |
| **Sprint** | Спринт реализации (Phase 1) |
| **Release** | Минимальный релиз, в котором фича **должна** быть готова |
| **Gate** | Критерий выхода на этот релиз |

### Релизы (gates)

```
Phase 0 ✅ ──► Этап 0: прототип, документация
     │
Phase 1 ──► Этап 1: Closed Alpha     ← P0 ядро: писать + структура + персонажи + базовый экспорт
     │
Phase 2 ──► Этап 2: MVP Beta         ← P0 завершён + P1; критерии §16 PRD
     │
Phase 3 ──► Этап 3: Public Launch    ← тарифы, OAuth, справка, onboarding v2
     │
Phase 4 ──► Этап 4: Post-MVP         ← P2 и backlog §15
```

**«MVP» в смысле PRD §13.1** = завершение **MVP Beta** (Phase 2), не Alpha и не Public Launch.

---

## Решения по расхождениям PRD

| Было противоречие | Решение в матрице |
|-------------------|-------------------|
| §13.1 включает сюжет/шаблоны/AI в MVP, §27 ставит их в P1 | **§27 побеждает:** plot/templates/AI/timeline = P1 → Beta |
| §14 Этап 3 «шаблоны», ROADMAP Phase 3 «шаблоны» | Шаблоны сюжета → **Sprint 4, Beta**; Launch = onboarding v2 + пользовательские шаблоны позже |
| §6.1 все auth-функции «MVP», Sprint 6 — password recovery | Core auth → Sprint 1; password reset + email confirm → **Sprint 6, но gate Beta** (до публичного запуска) |
| Поиск в §13 «в MVP», §27 P0 только по названиям | **Split:** по названиям P0; полнотекст P1 |
| Экспорт в §13 все форматы, §27 P0 только DOCX/TXT | **Split:** DOCX/TXT P0; PDF/Markdown/ZIP P1 |
| DATABASE/Prisma: UserApiKey, WritingGoal, DailyStat | **Post-MVP (P2)** до [DEC-012](./DECISION-LOG.md#dec-012-writinggoal--dailystat) |

---

## Scope Matrix

### Foundation & Auth

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Platform | Next.js, Tailwind, shadcn, monorepo, CI | — | 1 | Phase 0 ✅ | — | ✅ |
| Auth | Регистрация / вход / выход (email) | P0 | 1 | Alpha | §6.1 | ✅ |
| Auth | i18n ru/en | P0 | 1 | Alpha | §13.1 | ✅ |
| Auth | Landing page | P0 | 1 | Alpha | — | ✅ |
| Auth | Layout (sidebar, header) | P0 | 1 | Alpha | §8.2 | ✅ |
| Auth | Подтверждение email | P0 | 6 | Beta | §6.1 | ⬜ |
| Auth | Восстановление пароля | P0 | 6 | Beta | §6.1 | ⬜ |
| Auth | Профиль (имя, аватар) | P0 | 6 | Beta | §6.1 | ⬜ |
| Auth | Удаление аккаунта + выгрузка данных | P0 | 6 | Beta | §6.1 | ⬜ |
| Auth | OAuth (Google/Apple) | P2 | — | Launch+ | §6.1 | ⬜ |
| Auth | 2FA, рабочие пространства | P2 | — | Post-MVP | §6.1 | ⬜ |

### Projects & Dashboard

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Projects | CRUD (создание только по названию) | P0 | 2 | Alpha | §5.1, §6.2 | ✅ |
| Projects | Карточки, архив, сортировка | P0 | 2 | Alpha | §6.2 | 🟡 частично |
| Projects | Поиск и фильтр на dashboard | P0 | 2 | Alpha | §6.2 | ⬜ |
| Projects | Дублирование, переименование, удаление | P0 | 2 | Alpha | §6.2 | 🟡 частично |
| Projects | Onboarding «Начать писать / Спланировать / Материалы» | P0 | 2 | Alpha | §22 | ✅ |
| Projects | Обзор проекта (continue, прогресс, next step) | P0 | 2 | Alpha | §6.3 | 🟡 частично |
| Projects | Onboarding v2 (улучшенный) | P2 | — | Launch | §14 Э3 | ⬜ |

### Manuscript Structure

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Manuscript | Части → главы → сцены (CRUD) | P0 | 2 | Alpha | §6.4 | ✅ |
| Manuscript | Дерево навигатора, статусы сцены | P0 | 2 | Alpha | §6.4 | ✅ |
| Manuscript | Drag-and-drop порядка | P0 | 2 | Alpha | §5.2, §6.4 | ⬜ |
| Manuscript | Сворачивание уровней, контекстное меню | P0 | 2 | Alpha | §6.4 | 🟡 частично |
| Manuscript | Нераспределённые сцены | P0 | 2 | Alpha | §5.2 | ⬜ |
| Manuscript | Soft delete + корзина | P0 | 3 | Alpha | §23.4, §24.1 | ⬜ |
| Manuscript | Поиск по названиям в навигаторе | P0 | 2 | Alpha | §6.4 | ⬜ |

### Scene Editor (ядро продукта)

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Editor | TipTap, базовое форматирование | P0 | 3 | Alpha | §6.5 | ⬜ |
| Editor | Трёхколоночный layout (нав \| текст \| контекст) | P0 | 3 | Alpha | §23 | ⬜ |
| Editor | Автосохранение | P0 | 3 | Alpha | §6.5 | ⬜ |
| Editor | Локальный буфер при потере сети | P0 | 3 | Alpha | §5.3, §6.5 | ⬜ |
| Editor | Подсчёт слов, цель по словам | P0 | 3 | Alpha | §6.5 | ⬜ |
| Editor | Режим фокуса, горячие клавиши | P0 | 3 | Alpha | §6.5, §23.8 | ⬜ |
| Editor | История версий сцен | P0 | 3 | Beta | §6.5, §27 | ⬜ |
| Editor | Конфликт версий (merge UX) | P0 | 3 | Beta | §23.5 | ⬜ |
| Editor | Метаданные сцены (цель, конфликт, POV, локация) | P0 | 3 | Alpha | §6.5 | ⬜ |
| Editor | Контекстная панель (вкладки Сцена/Персонажи/Мир) | P0 | 3 | Alpha | §23.6 | ⬜ |
| Editor | Command palette (Ctrl+K) | P1 | 4 | Beta | §25.7 | ⬜ |

### Knowledge Base

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Characters | **Описание героев:** карточки (имя обязательно; роль, описание, внешность, мотивация, заметки — опционально) | P0 | 4 | Alpha | PRD FR-KN-01 | ⬜ |
| Characters | Связи герой ↔ сцена | P0 | 4 | Alpha | PRD FR-KN-02 | ⬜ |
| Characters | **Связи между героями** (тип + комментарий; список на карточке) | P0 | 4 | Alpha | PRD FR-KN-10 / BRD BR-FR-05b | ⬜ |
| Characters | Визуальный граф отношений | P2 | — | Post-MVP | PRD §6.3 | ⬜ |
| World | **Описание локаций** (название + текст; связь со сценами) | P0 | 4 | Alpha | PRD FR-KN-03 / BRD BR-FR-05a | ⬜ |
| World | Прочие базовые статьи мира | P0 | 4 | Alpha | PRD FR-KN-03a | ⬜ |
| World | Обратные ссылки (упоминания) | P1 | 4 | Beta | §25.5 | ⬜ |
| Plot | Сюжетная доска (карточки, DnD) | P1 | 4 | Beta | §6.6, §27 | ⬜ |
| Plot | Шаблоны (3-act, Hero's Journey, Save the Cat, пустой) | P1 | 4 | Beta | §6.6, §27 | ⬜ |
| Plot | Сюжетные линии (Storyline) | P1 | 4 | Beta | §6.6 | ⬜ |
| Timeline | Простой список событий | P1 | 4 | Beta | §6.9, §27 | ⬜ |
| Timeline | Визуальный масштабируемый таймлайн | P2 | — | Post-MVP | §6.9 | ⬜ |
| Notes | Заметки и материалы (текст + ссылки) | P1 | 4 | Beta | §6.10 | ⬜ |
| Notes | Файловое хранилище (изображения, квоты) | P1 | 4 | Beta | §6.10 | ⬜ |
| Search | Глобальный поиск по названиям | P0 | 4 | Alpha | §27 | ⬜ |
| Search | Полнотекстовый поиск по проекту | P1 | 4 | Beta | §6.11, §27 | ⬜ |

### AI Assistant

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| AI | Чат с выбором контекста (Level 0–3) | P1 | 5 | Beta | §7, §26 | ⬜ |
| AI | Анализ / редактура выделенного текста | P1 | 5 | Beta | §7.2, §23.7 | ⬜ |
| AI | Принять / принять фрагмент / отклонить (diff) | P1 | 5 | Beta | §7.1, §23.7 | ⬜ |
| AI | Прозрачность контекста и источников | P1 | 5 | Beta | §7.3 | ⬜ |
| AI | Настройки AI и политика приватности | P1 | 5 | Beta | §7.5 | ⬜ |
| AI | Level 4–5 (весь проект), consistency check | P2 | — | Post-MVP | §26.2, §27 | ⬜ |
| AI | Профиль стиля автора | P2 | — | Post-MVP | §7.4, §27 | ⬜ |
| AI | BYOK (свой API-ключ) | P2 | — | [DEC-005](./DECISION-LOG.md#dec-005-модель-ai-platform--byok--hybrid) | — | ⬜ |

### Import / Export

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| Export | DOCX, TXT | P0 | 6 | Alpha | §6.12, §27 | ⬜ |
| Export | PDF, Markdown, ZIP проекта | P1 | 6 | Beta | §6.12, §27 | ⬜ |
| Import | DOCX, TXT, Markdown, вставка текста | P1 | 6 | Beta | §6.12, §27 | ⬜ |
| Import | Wizard с preview и отчётом | P1 | 6 | Beta | §25.8 | ⬜ |

### Cross-cutting (Polish & Ops)

| Область | Возможность | P | Sprint | Release | PRD | Статус |
|---------|-------------|---|--------|---------|-----|--------|
| UX | Empty / loading / error states (все P0 экраны) | P0 | 6 | Beta | §8.5, §18 | ⬜ |
| UX | Responsive desktop-first, read-only mobile | P0 | 6 | Beta | §11.4, §13.1 | ⬜ |
| UX | Accessibility (клавиатура, WCAG AA) | P0 | 6 | Beta | §8.4, §16 | ⬜ |
| UX | Usability-тесты (≥5 авторов) | P0 | 6 | Beta | §16, §29 | ⬜ |
| Ops | Продуктовая аналитика (без текста рукописи) | P1 | 2 | Beta | §12, §13.1 | ⬜ |
| Ops | Политика приватности + AI consent | P0 | 6 | Beta | §16 | ⬜ |
| Ops | Мониторинг ошибок, бэкапы | P0 | 6 | Beta | §11.2 | ⬜ |
| Ops | Платёжная инфраструктура | P2 | — | Launch | §14 Э3 | ⬜ |
| Ops | Тарифы free/paid | P2 | — | Launch | §17 | ⬜ |
| Ops | Справка и документация | P2 | — | Launch | §14 Э3 | ⬜ |

### Post-MVP (P2 / Phase 4)

| Область | Возможность | P | Sprint | Release | PRD |
|---------|-------------|---|--------|---------|-----|
| Collab | Real-time совместная работа | P2 | — | Post-MVP | §13.2, §15 |
| Collab | ProjectMember, роли | P2 | — | Post-MVP | §9.3 |
| Product | WritingGoal, DailyStat (цели и статистика) | P2 | — | TBD | DATABASE.md |
| Product | Редакторский кабинет, комментарии | P2 | — | Post-MVP | §15 |
| Product | Кастомные поля, пользовательские шаблоны | P2 | — | Post-MVP | §15 |
| Product | Сравнение версий (diff UI) | P2 | — | Post-MVP | §15 |
| Product | Серия книг, перевод проекта | P2 | — | Post-MVP | §15 |
| Product | API, интеграции, облачные диски | P2 | — | Post-MVP | §15 |
| Product | Мобильное приложение | P2 | — | Post-MVP | §13.2 |

---

## Release Gates (чеклисты)

### Closed Alpha (Phase 1 complete)

Автор может **зарегистрироваться → создать проект → построить структуру → написать сцену → создать персонажа/локацию → экспортировать DOCX/TXT** без потери текста при кратковременном offline.

| Must-have P0 | Sprint |
|--------------|--------|
| Auth (register/login) | 1 ✅ |
| Projects + onboarding | 2 |
| Manuscript tree + DnD | 2 |
| Scene editor + autosave + offline buffer | 3 |
| Scene metadata + context panel | 3 |
| Characters (basic) + locations | 4 |
| Export DOCX/TXT | 6 |

**Не требуется для Alpha:** AI, plot board, templates, timeline, import, full search, version history, billing.

### MVP Beta (Phase 2 complete) = PRD §13.1 «MVP»

Все P0 + все P1. Выполнены критерии готовности PRD §16.

| Добавляется к Alpha | Sprint |
|---------------------|--------|
| Version history + conflict UX | 3 |
| Plot board + templates + timeline | 4 |
| Full-text search + command palette | 4 |
| Notes & materials | 4 |
| AI (context chat + edit suggestions) | 5 |
| Import + PDF/Markdown/ZIP export | 6 |
| Auth polish (email confirm, password, profile, delete) | 6 |
| Analytics, privacy policy, a11y, usability tests | 6 |

### Public Launch (Phase 3)

| Добавляется | PRD |
|-------------|-----|
| Тарифы и billing | §14 Э3 |
| OAuth | §6.1 |
| Onboarding v2 | §14 Э3 |
| Справка | §14 Э3 |
| Аналитика активации (расширенная) | §14 Э3 |

---

## Sprint ↔ Release (сводка)

| Sprint | Фокус | Release gate |
|--------|-------|--------------|
| 1 ✅ | Foundation | Phase 0 |
| 2 | Projects + manuscript structure | → Alpha |
| 3 | Scene editor | → Alpha |
| 4 | Knowledge base (P0 chars/world + P1 plot/search) | → Alpha (P0) / Beta (P1) |
| 5 | AI assistant | → Beta |
| 6 | Import/export + polish + auth completion | → Beta |
| Phase 2 | Billing infra, search indexing, sync reliability | → Beta hardening |
| Phase 3 | Tariffs, OAuth, help, onboarding v2 | → Launch |
| Phase 4 | P2 backlog | → Post-MVP |

---

## P0 / P1 / P2 (быстрая сводка из §27)

### P0 — Closed Alpha + часть Beta
Авторизация · проекты · дерево рукописи · сцены · надёжный редактор · автосохранение · персонажи · базовые локации · экспорт DOCX/TXT · история версий · поиск по названиям

### P1 — MVP Beta
Сюжетная доска · шаблоны · импорт DOCX · глобальный поиск по тексту · AI по текущей сцене · PDF/Markdown export · простая хронология · заметки · аналитика · command palette

### P2 — Post-MVP
Визуальный граф отношений · профиль стиля · полный AI-анализ проекта · расширенные изображения · кастомные поля · совместная работа · BYOK (optional P1 — см. [DEC-005](./DECISION-LOG.md#dec-005-модель-ai-platform--byok--hybrid)) · WritingGoal/DailyStat (см. [DEC-012](./DECISION-LOG.md#dec-012-writinggoal--dailystat))

> **MVP (Alpha+):** описание героев, описание локаций и **связи между героями** (не визуальный граф) — P0; см. PRD v2.1 / BRD v1.1.

---

## Связанные документы

- [PRD v1.0](../prd/archive/PRD-v1.0.md) — нормативные требования
- [DECISION-LOG.md](./DECISION-LOG.md) — открытые решения §17
- [DESIGN-HANDOFF.md](../technical/design/DESIGN-HANDOFF.md) — Figma ↔ code handoff
- [ROADMAP.md](./ROADMAP.md) — спринтовый трекер (статусы задач)
- [DATABASE.md](../technical/DATABASE.md) — схема данных (синхронизирована с Prisma + PRD §9 matrix)
