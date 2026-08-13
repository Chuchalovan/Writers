# Decision Log

> Закрывает [PRD v1.0 §17](../prd/archive/PRD-v1.0.md) и дополняет [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)  
> **Обновлено:** 4 августа 2026

Журнал продуктовых и технических решений. Каждая запись должна иметь **владельца** и **deadline** до перевода в `Accepted`.

### Статусы

| Статус | Значение |
|--------|----------|
| ✅ Accepted | Решение принято, можно реализовывать |
| 🟡 Proposed | Есть рекомендация, ждёт sign-off |
| ⬜ Open | Варианты не сузили |
| 🔴 Blocker | Блокирует спринт или release gate |

### Release gates (deadline-ориентиры)

| Gate | Sprint | Решения должны быть Accepted до |
|------|--------|----------------------------------|
| Closed Alpha | 3–4 | DEC-001…003, DEC-008, DEC-009 |
| MVP Beta | 5–6 | DEC-004…007, DEC-010, DEC-011, DEC-012 |
| Public Launch | Phase 3 | DEC-004 (тарифы), DEC-007 (legal docs) |

---

## Сводка

| ID | Решение | Статус | Owner | Deadline | Блокирует |
|----|---------|--------|-------|----------|-----------|
| [DEC-001](#dec-001-технологическая-платформа) | Технологическая платформа | ✅ Accepted | Engineering | — | — |
| [DEC-002](#dec-002-редактор) | Редактор (TipTap) | 🟡 Proposed | Engineering | Sprint 3 start | Sprint 3 |
| [DEC-003](#dec-003-формат-документа-редактора) | Формат `content_json` | 🟡 Proposed | Engineering | Sprint 3 start | Sprint 3 |
| [DEC-004](#dec-004-тарифы-free--paid) | Тарифы free / paid | ⬜ Open | Product | Phase 3 | Launch |
| [DEC-005](#dec-005-модель-ai-platform--byok--hybrid) | Модель AI | 🟡 Proposed | Product + Eng | Sprint 5 start | Sprint 5 |
| [DEC-006](#dec-006-ai-хранение-и-приватность) | AI: хранение запросов | 🟡 Proposed | Product + Legal | Sprint 5 start | Sprint 5 |
| [DEC-007](#dec-007-юрисдикция-и-legal) | Юрисдикция и compliance | ⬜ Open | Legal / Product | MVP Beta gate | Beta, Launch |
| [DEC-008](#dec-008-глубина-mobile) | Глубина mobile | 🟡 Proposed | Product + Design | Sprint 6 start | Sprint 6 |
| [DEC-009](#dec-009-шаблоны-сюжета-методы-построения) | Методы сюжета (контент битов) | ⬜ Open | Product | Sprint 4 start | Sprint 4 |
| [DEC-010](#dec-010-лимиты-файлов-и-изображений) | Лимиты файлов | ⬜ Open | Product + Eng | Sprint 4 start | Sprint 4 |
| [DEC-011](#dec-011-figma-design-handoff) | Figma tokens & handoff | ⬜ Open | Design | MVP Beta gate | Beta |
| [DEC-012](#dec-012-writinggoaldailystat) | WritingGoal / DailyStat | 🟡 Proposed | Product | Sprint 6 start | — |

---

## DEC-001: Технологическая платформа

**Статус:** ✅ Accepted  
**Owner:** Engineering  
**Deadline:** — (принято)  
**PRD §17:** финальная технологическая платформа

### Контекст

Нужен стек для desktop-first веб-приложения с rich-text редактором, auth, i18n и AI-оркестрацией.

### Решение

| Слой | Выбор |
|------|-------|
| App | Next.js 15 (App Router), TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| DB | PostgreSQL + Prisma |
| Auth | Better Auth (email/password) |
| i18n | next-intl (ru/en) |
| Monorepo | pnpm workspaces |
| Deploy | Vercel / Docker / VPS (гибко) |

### Обоснование

Уже реализовано в Phase 0–1; единая fullstack-кодовая база, type-safe ORM, SSR для landing.

### Последствия

- Server Actions + API routes для AI-стриминга
- Миграции через Prisma

**Ссылки:** [ARCHITECTURE.md](../technical/ARCHITECTURE.md), [README.md](../../README.md)

---

## DEC-002: Редактор

**Статус:** 🟡 Proposed  
**Owner:** Engineering  
**Deadline:** начало Sprint 3  
**PRD §17:** финальный редактор  
**Блокирует:** Sprint 3 (Scene editor)

### Контекст

Редактор сцены — ядро продукта (PRD §23). Нужны: форматирование, autosave, версии, diff для AI.

### Варианты

| | TipTap (ProseMirror) | Lexical | Slate |
|---|---------------------|---------|-------|
| Экосистема | ✅ зрелая | растёт | устаревает |
| Collaboration (post-MVP) | ✅ Yjs extension | ✅ | ограничено |
| Формат | JSON document | JSON | JSON |
| Команда уже выбрала | ✅ README, ARCHITECTURE | — | — |

### Рекомендация

**TipTap 2.x** — зафиксировать как Accepted без пересмотра.

### Критерий принятия

- [ ] Owner sign-off
- [ ] Spike: autosave + version snapshot на одной сцене (1–2 дня)

---

## DEC-003: Формат документа редактора

**Статус:** 🟡 Proposed  
**Owner:** Engineering  
**Deadline:** начало Sprint 3  
**PRD §17:** формат внутреннего документа  
**Блокирует:** Sprint 3, import/export, version history

### Контекст

`SceneContent.contentJson` — источник истины для текста сцены. От формата зависят экспорт, diff, AI-редактура.

### Рекомендация

| Поле | Формат |
|------|--------|
| `contentJson` | TipTap/ProseMirror JSON (`doc` root) |
| `plainText` | Денormalized plain text для поиска и AI |
| `version` | Integer, optimistic concurrency |
| Version snapshots | Полный `contentJson` snapshot (не delta) для MVP |

### Ограничения MVP schema

Разрешённые node types: `doc`, `paragraph`, `heading` (h2–h3), `text` + marks (`bold`, `italic`, `strike`), `bulletList`, `orderedList`, `listItem`, `horizontalRule`.

### Открытые подвопросы

- Slash commands — Sprint 3 nice-to-have или P1?
- Inline comments (post-MVP) — не закладывать в schema v1

### Критерий принятия

- [ ] JSON schema задокументирована в `docs/DATABASE.md`
- [ ] Round-trip test: edit → save → reload → identical JSON

---

## DEC-004: Тарифы free / paid

**Статус:** ⬜ Open  
**Owner:** Product  
**Deadline:** Phase 3 (Launch); draft — до MVP Beta  
**PRD §17:** ограничения бесплатного и платного тарифов  
**Блокирует:** Public Launch, DEC-005 (лимиты AI)

### Контекст

PRD §7.5 требует прозрачных лимитов AI. Billing — Phase 3, но лимиты влияют на архитектуру с Sprint 5.

### Варианты

**A. Free-only до Launch**  
Все функции бесплатно в Beta; тарифы после validation.

**B. Freemium с первого Launch**

| | Free | Pro (ориентир) |
|---|------|----------------|
| Проекты | 3 | Unlimited |
| AI запросы/мес | BYOK only *или* 50 platform | Unlimited BYOK + 500 platform |
| Хранилище | 100 MB | 5 GB |
| Export | все форматы | все форматы |

**C. BYOK-only (нет platform AI)**  
Нет расходов на AI; монетизация за pro-фичи (collab, версии, export batch).

### Рекомендация

**A для Beta** → **B для Launch**, с platform AI quota только если DEC-005 = Hybrid.

### Нужно решить

- [ ] Есть ли platform-provided AI или только BYOK?
- [ ] Цена Pro (ориентир для UX, не обязательно финальная)
- [ ] Trial period?

---

## DEC-005: Модель AI (platform / BYOK / hybrid)

**Статус:** 🟡 Proposed  
**Owner:** Product + Engineering  
**Deadline:** начало Sprint 5  
**PRD §17:** провайдер AI  
**Блокирует:** Sprint 5

### Контекст

В коде уже есть `UserApiKey`, ARCHITECTURE описывает BYOK. PRD §7 не упоминает BYOK. MVP-SCOPE-MATRIX ставит BYOK в P2/TBD.

### Варианты

| | BYOK only | Platform only | Hybrid |
|---|-----------|---------------|--------|
| Cost to us | $0 | высокий | средний |
| UX friction | выше (нужен ключ) | ниже | гибко |
| Privacy story | ✅ сильная | нужна политика | ✅ |
| Уже в коде | ✅ UserApiKey | ⬜ | частично |

### Рекомендация

**Hybrid для Beta:**

1. **Default:** platform key (OpenAI `gpt-4o-mini` или аналог) — лимит N запросов/день (см. DEC-004)
2. **Optional:** BYOK в настройках — без лимитов platform, ключ шифруется (уже в ARCHITECTURE)
3. **Fallback:** при недоступности platform AI — редактор работает; AI UI показывает «добавьте ключ»

Provider abstraction: `@manuscript/ai` — `openai` + `custom` (OpenAI-compatible).

### Критерий принятия

- [ ] Product sign-off на Hybrid
- [ ] Обновить PRD §7 и MVP-SCOPE-MATRIX (BYOK → P1 optional, не P2)
- [ ] Env: `PLATFORM_OPENAI_API_KEY` для server-side quota

---

## DEC-006: AI — хранение и приватность

**Статус:** 🟡 Proposed  
**Owner:** Product + Legal  
**Deadline:** начало Sprint 5  
**PRD §17:** политика хранения  
**Блокирует:** Sprint 5, MVP Beta gate (§16)

### Контекст

PRD §7.5: рукопись не для обучения; настройка хранения запросов; удаление проекта удаляет AI-контекст.

### Рекомендация

| Данные | Хранение MVP | Retention |
|--------|--------------|-----------|
| `AIMessage.content` | ✅ последние 50 сообщений / conversation | до удаления conversation |
| Контекст snapshot (entity IDs) | ✅ metadata only |同上 |
| Текст рукописи в prompt | ❌ не логировать | — |
| Platform provider logs | opt-out через zero-data retention API если доступно | — |
| Analytics | event names only, no manuscript text | 90 days |

**User controls (MVP Beta):**
- «Не сохранять историю AI-чатов» — toggle в настройках проекта
- Удаление проекта → cascade delete `AIConversation`, `AIMessage`

### Критерий принятия

- [ ] Текст для Privacy Policy согласован (DEC-007)
- [ ] Реализован toggle + cascade delete

---

## DEC-007: Юрисдикция и legal

**Статус:** ⬜ Open  
**Owner:** Legal / Product  
**Deadline:** MVP Beta gate (документы); draft — Sprint 6  
**PRD §17:** юрисдикция и требования к данным  
**Блокирует:** MVP Beta (§16), Launch

### Контекст

Продукт хранит рукописи (персональные творческие данные) + AI-обработку. PRD §16 требует privacy policy до Beta.

### Нужно решить

| Вопрос | Опции |
|--------|-------|
| Юрисдикция оператора | РФ / EU (GDPR) / hybrid |
| Hosting region | EU / US / RU |
| Возраст пользователей | 16+ / 18+ |
| DPA с AI-провайдером | OpenAI DPA, SCCs |

### Рекомендация (draft)

- **MVP Beta:** Privacy Policy + Terms of Service + AI Usage Policy (3 отдельных doc или раздела)
- **Минимум GDPR-ready:** export data (§6.1), delete account, consent для AI, cookie banner если analytics
- **Hosting:** уточнить при выборе deploy; для EU users — prefer EU region

### Deliverables

- [ ] `docs/legal/PRIVACY-POLICY.md` (draft)
- [ ] `docs/legal/TERMS.md` (draft)
- [ ] `docs/legal/AI-POLICY.md` (draft)
- [ ] Cookie/consent UI scope

### Owner action

Назначить ответственного за legal review до Beta.

---

## DEC-008: Глубина mobile

**Статус:** 🟡 Proposed  
**Owner:** Product + Design  
**Deadline:** Sprint 6  
**PRD §17:** глубина мобильной адаптации

### Контекст

PRD §1.4: полноценное mobile app — non-goal. §11.4: read-only + limited edit до 899px.

### Рекомендация

| Breakpoint | Поведение MVP |
|------------|---------------|
| ≥1280px | Full 3-column editor |
| 900–1279px | Collapsed side panels, editor priority |
| <900px | **Read-only:** просмотр сцен, поиск, заметки; **no** rich-text editing |

### Критерий принятия

- [ ] Design: mobile frames для read-only scene view
- [ ] Engineering: `useMediaQuery` guard на editor mount

---

## DEC-009: Шаблоны сюжета (методы построения)

**Статус:** ⬜ Open  
**Owner:** Product  
**Deadline:** начало Sprint 4  
**PRD:** `FR-KN-05`; **BRD:** §8 Must/Should  
**Блокирует:** Sprint 4 (Plot board + методы)

### Контекст

Автор должен иметь возможность **создать произведение, выбрав один метод построения сюжета** (или `blank`). Канон методов и MoSCoW: [plot-methods.md](../brd/plot-methods.md), бизнес-правила: [BRD.md](../brd/BRD.md).

Нужен **контент** битов/шагов с i18n и пояснениями простым языком — не только названия.

### Рекомендация — Must к MVP Beta (P1)

| ID | Метод | Битов / шагов | Источник |
|----|-------|---------------|----------|
| `blank` | Без метода / пустая структура | 0 | — |
| `three-act` | Трёхактная | ~9 | Setup / Confrontation / Resolution |
| `heros-journey` | Путь героя | 12 | Campbell (упрощённый) |
| `beat-sheet` | Сценарный план (Beat Sheet) | ~15 | Цель→Конфликт→… / близок Save the Cat |

### Should (после Must или Launch+)

`snowflake-lite`, `string`, `index-cards` — см. каталог.

### Deliverable

- [ ] `packages/shared/src/templates/plot/*.json` — beat/step definitions с i18n keys  
- [ ] UI: выбор одного метода при создании/в сюжете; tooltip с plain-language объяснением  
- [ ] Связь элементов каркаса со сценами; смена метода без потери текста рукописи  

### Owner action

Утвердить список битов Must-методов (можно начать с `blank` + `three-act` для Sprint 4, `heros-journey` + `beat-sheet` следом в том же gate Beta).

---

## DEC-010: Лимиты файлов и изображений

**Статус:** ⬜ Open  
**Owner:** Product + Engineering  
**Deadline:** Sprint 4 (Notes & materials)  
**PRD §17:** лимиты файлов и изображений

### Контекст

§6.10: текстовые заметки + ссылки в MVP; изображения с квотами. Character/world `imageUrl`, note attachments.

### Рекомендация (draft)

| Лимит | Free (draft) | Pro (draft) |
|-------|--------------|-------------|
| Max file size | 5 MB | 20 MB |
| Allowed types | JPEG, PNG, WebP, GIF | + PDF (notes only) |
| Storage / project | 50 MB | 2 GB |
| Max images / character | 1 | 5 |

**Implementation:** S3-compatible object storage (MinIO dev / R2 prod); signed URLs; virus scan — post-MVP.

### Критерий принятия

- [ ] Согласовано с DEC-004 (tariff limits)
- [ ] Env vars + upload API spec в `docs/API.md`

---

## DEC-011: Figma design handoff

**Статус:** ⬜ Open  
**Owner:** Design  
**Deadline:** MVP Beta gate  
**PRD §17:** финальные токены и компоненты  
**Блокирует:** Beta (§30 PRD checklist)

### Контекст

Визуальный SoT: [Manuscript — Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio) (`DY4LOZnkponU6E1rmb34Fs`). Старый UI Kit `7vP03INYMrwQ3Q6qT7A2NT` — архив. Код (`globals.css`) ещё на прежней палитре.

### Deliverables

- [x] [DESIGN-HANDOFF.md](../technical/design/DESIGN-HANDOFF.md) — screen inventory, tokens, component map, audit checklist
- [x] Figma frame node-id column filled (Ink Studio, 13 августа 2026)
- [ ] Exported tokens synced with `globals.css`

### Рекомендация

1. Реализация экранов — от Ink Studio frames, не от старого UI Kit
2. Расхождения поведения — PRD + Use Cases; пиксели — Figma
3. Sync `globals.css` + шрифты (Geist / Newsreader / Instrument Serif) до Beta

### Критерий принятия

- [x] Figma-frame на ключевые P0 экраны + empty/loading/error
- [x] P1 screens (plot, timeline, notes, AI, import, settings)
- [x] Figma variables (5 collections, Light/Dark)
- [ ] Tokens + type ramp в коде
- [ ] Product sign-off

---

## DEC-012: WritingGoal / DailyStat

**Статус:** 🟡 Proposed  
**Owner:** Product  
**Deadline:** Sprint 6 (или Post-MVP)  
**PRD §17:** — (gap между PRD и кодом)

### Контекст

Prisma уже содержит `WritingGoal`, `DailyStat`. PRD §6.5 — «цель по словам» на уровне сцены; PRD §6.3 — прогресс на overview. Нет явного daily writing goal.

### Варианты

**A. Post-MVP (P2)** — убрать из Alpha/Beta scope, модели остаются для будущего  
**B. Minimal MVP** — только project `targetWordCount` + progress bar (уже в Project)  
**C. Full stats** — daily goal + streak + dashboard (конкурирует с «не productivity tracker», PRD §5.5)

### Рекомендация

**B для Beta:** project-level target + word count progress на Overview.  
**A для daily goals:** `WritingGoal` / `DailyStat` UI → Post-MVP (Phase 4).

### Критерий принятия

- [ ] Product sign-off
- [ ] MVP-SCOPE-MATRIX обновлён
- [ ] Не строить stats dashboard в Sprint 4–5

---

## Процесс обновления

1. **Новое решение** — добавить строку в сводку + полную секцию DEC-XXX
2. **Sign-off** — сменить статус на ✅ Accepted, заполнить дату в changelog ниже
3. **Изменение Accepted** — новая запись DEC-XXX v2 с ссылкой на предыдущую (не редактировать silently)
4. **Синхронизация** — при Accepted обновлять PRD / MVP-SCOPE-MATRIX / ARCHITECTURE если нужно

---

## Changelog

| Дата | ID | Изменение |
|------|-----|-----------|
| 2026-08-04 | DEC-001 | Accepted (зафиксировано по текущему стеку) |
| 2026-08-04 | ALL | Initial decision log created from PRD §17 |

---

## Связанные документы

- [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)
- [PRD v1.0 §17](../prd/archive/PRD-v1.0.md)
- [ARCHITECTURE.md](../technical/ARCHITECTURE.md)
- [ROADMAP.md](./ROADMAP.md)
