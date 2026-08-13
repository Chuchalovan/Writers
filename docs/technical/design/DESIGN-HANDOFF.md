# Design Handoff

> **Figma (SoT):** [Manuscript — Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio)  
> **File key:** `DY4LOZnkponU6E1rmb34Fs`  
> **PRD:** [v2.1](../../prd/PRD.md) — FR-ED / FR-PRJ / FR-KN / §7.8–7.9  
> **ТЗ:** [§5 UI](../../tz/TZ.md#5-пользовательский-интерфейс)  
> **Decision:** [DEC-011](../../roadmap/DECISION-LOG.md#dec-011-figma-design-handoff)  
> **Scope:** [MVP-SCOPE-MATRIX.md](../../roadmap/MVP-SCOPE-MATRIX.md)  
> **Обновлено:** 13 августа 2026 (Ink Studio supersedes старый UI Kit)

Handoff для разработки: экран → Figma frame → route → компоненты → состояния → токены.

Предыдущий файл [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System) (`7vP03INYMrwQ3Q6qT7A2NT`) — **архив**. Не использовать для новой реализации.

---

## Статус audit

| Проверка | Статус | Комментарий |
|----------|--------|-------------|
| Figma file доступен | 🟢 | File key `DY4LOZnkponU6E1rmb34Fs` |
| Страницы / frames P0–P1 | 🟢 | 9 pages; 52 screen frames включая empty/loading/error |
| Design system components | 🟡 | Button, Input, Status Chip, Nav Rail Item, 6 icons |
| Figma variables | 🟢 | 5 collections, Light/Dark semantic Color — [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) |
| Code tokens (`globals.css`) | 🔴 | Код ещё на старой палитре Inter / тёплый workspace |
| shadcn/ui base components | 🟢 | Button, Input, Card… в коде — визуал не совпадает с Ink Studio |
| PRD / ТЗ screen specs | 🟢 | Поведение — PRD + UC; визуал — этот файл |
| Scene editor states | 🟢 | normal, empty, loading, focus, offline, conflict, versions, deleted |
| Compact / mobile | 🟡 | Editor + dashboard compact; mobile read-only (DEC-008) |

**Вывод:** визуальный SoT — **Ink Studio**. Код и CSS-токены **отстают**; реализация экранов должна идти от frames ниже, а не от старого UI Kit.

### Quick links (P0 critical)

| Frame | Figma |
|-------|-------|
| **E.01 Scene editor** | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-183) |
| E.02 Empty scene | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-369) |
| E.03 Loading | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-830) |
| P.01 Dashboard | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-53) |
| Foundations | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=2-2) |
| Components | [Open](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=1-3) |

---

## Figma file structure

```
Manuscript — Ink Studio
├── Cover                       page 0:1      Cover (2:54)
├── 00 Foundations              page 1:2      токены, type ramp (2:2)
├── 01 Components               page 1:3      Button, Input, Status Chip, Icons, Nav Rail
├── 10 Auth                     page 1:4      landing + auth + ошибки
├── 20 Projects                 page 1:5      dashboard, overview, create, search
├── 30 Editor                   page 1:6      редактор и состояния
├── 40 Knowledge                page 1:7      герои, мир, сюжет, таймлайн, заметки
├── 50 IO · AI · Settings       page 1:8      export, import, AI, профиль
└── 60 Responsive               page 13:637   compact 1024 + mobile 390
```

**Deep link template:**

```
https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id={NODE_ID}
```

`{NODE_ID}`: двоеточие → дефис (`5:183` → `5-183`).

---

## Визуальный язык

Не копия старого светлого workspace. Два слоя:

| Слой | Роль | Цвет |
|------|------|------|
| **Chrome** | Rail, навигатор, inspector, chrome dashboard | тёмный ink (`color/bg/chrome` `#0C0F12`) |
| **Sheet** | Рукопись, карточки контента, лендинг-бумага | светлая бумага (`color/bg/sheet` `#F4EFE4`) |

Sheet остаётся бумажным и в Dark mode: тёмнеет оболочка, не страница текста.

**Шрифты**

| Роль | Family | Text style | Где |
|------|--------|------------|-----|
| UI | Geist | `UI/Body`, `UI/Button`, `UI/Label` | nav, формы, кнопки |
| Display | Instrument Serif | `Display/Hero`, `Display/Title`, `Display/H2` | лендинг, названия проекта/сцены |
| Prose | Newsreader | `Prose/Body`, `Prose/Lead` | текст сцены в редакторе |
| Mono | Geist Mono | `Mono/Meta` | статус синка, счётчик слов, timestamps |

**Акцент:** teal (`#2F6F6A`), не тёплый brown старого UI Kit. Destructive: rust/danger `#C23B2E`.

---

## Breakpoints & layout shell

Источник: ТЗ §5.2, [DEC-008](../../roadmap/DECISION-LOG.md#dec-008-глубина-mobile). Figma-канвасы — репрезентативные, не единственные ширины.

| Token | Figma canvas | Поведение |
|-------|--------------|-----------|
| `desktop` | 1440×900 | rail 64 \| navigator 260 \| sheet flex \| inspector 320 |
| `compact` | 1024×768 | inspector скрыт, открывается по запросу |
| `mobile` | 390×844 | **только чтение** сцены; rich-text выключен (DEC-008) |

Продуктовые пороги ТЗ: desktop ≥1280, compact 900–1279, mobile <900. Figma рисует 1440 / 1024 / 390 как эталоны этих зон.

### App shell (dashboard + editor)

```
┌────┬──────────┬──────────────────────────────────┬─────────────┐
│Rail│ Navigator│ Sheet (рукопись / контент)       │ Inspector   │
│ 64 │ 260      │ flex                             │ 320         │
│ink │ ink      │ paper                            │ ink         │
└────┴──────────┴──────────────────────────────────┴─────────────┘
```

**Figma:** [E.01](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-183)  
**Код сегодня:** `apps/web/src/app/[locale]/(dashboard)/layout.tsx` — широкий sidebar, без rail. Заменить при реализации Ink Studio.

---

## Design tokens

**SoT визуала:** Figma collections → [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md).  
**SoT в коде (пока отстаёт):** `apps/web/src/app/globals.css`.

Ключевые semantic (Light):

| Token | Hex | Роль |
|-------|-----|------|
| `color/bg/app` | `#FAF7F0` | страница вне chrome |
| `color/bg/chrome` | `#0C0F12` | rail / navigator / inspector |
| `color/bg/sheet` | `#F4EFE4` | лист рукописи |
| `color/text/primary` | `#0C0F12` | основной текст на бумаге |
| `color/text/on-chrome` | `#F4EFE4` | текст на тёмном chrome |
| `color/accent` | `#2F6F6A` | CTA, ссылки |
| `color/danger` | `#C23B2E` | удаление, ошибки |

Статусы сцен — **иконка + подпись**, не один цвет (PRD §7.8, ТЗ §5.1):

| Status | Token | Hex |
|--------|-------|-----|
| idea | `color/status/idea` | `#6B747C` |
| planned | `color/status/planned` | `#3A424A` |
| draft | `color/status/draft` | `#2F6F6A` |
| revision | `color/status/revision` | `#C45C26` |
| ready | `color/status/ready` | `#3D7A4A` |

---

## Component mapping

PRD / ТЗ → Figma `01 Components` → код.

| Product | Figma | node-id | Code | Code Connect | Status |
|---------|-------|---------|------|--------------|--------|
| Button primary | `Button` / `Variant=Primary` | `2:72` | `@/components/ui/button` `default` | 🟡 remap | код есть, визуал старый |
| Button ghost | `Button` / `Variant=Ghost` | `2:74` | `ghost` | 🟡 remap | |
| Button accent | `Button` / `Variant=Accent` | `2:76` | нет 1:1 (ближайший `secondary`) | 🟡 remap | |
| Button destructive | `Button` / `Variant=Destructive` | `2:78` | `destructive` | ⬜ | |
| Input | `Input` | `3:2` | `@/components/ui/input` | ⬜ | |
| Status chip | `Status Chip` | `3:21` | ⬜ | ⬜ | Figma only |
| Nav rail | `Nav Rail Item` Default / Active | `3:52` / `3:57` | sidebar (широкий) | 🟡 remap | код — старый sidebar |
| Icons | `Icon/book` … `Icon/note` | `3:25`–`3:51` | lucide | ⬜ | |
| Tree item | embedded in `E.01` Navigator | `5:215` | `manuscript-tree.tsx` | 🟡 stale | нет отдельного компонента |
| Project card | embedded in `P.01` | `4:53` | `project-card.tsx` | 🟡 stale | нет отдельного компонента |

**Components page:** [01 Components](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=1-3)

### Button variant map (Figma → shadcn)

| Figma | shadcn `variant` |
|-------|------------------|
| Primary | `default` |
| Ghost | `ghost` |
| Accent | нет; временно `secondary` или новый `accent` |
| Destructive | `destructive` |

---

## Screen inventory

Обязательные состояния (PRD §7.8, ТЗ §5.4): **normal · empty · loading · error · no-access/deleted**.

Ссылка: `https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=` + node-id с `-` вместо `:`.

### P0 — Closed Alpha / Beta-gated auth

| Screen | PRD / ТЗ | Route | Figma frame | node-id | Sprint | States in Figma |
|--------|----------|-------|-------------|---------|--------|-----------------|
| Landing | — | `/[locale]` | [A.01 Landing](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=9-21) | `9:21` | 1 | normal |
| Login | FR-AUTH-02 | `/login` | [A.02 Login](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-2) | `4:2` | 1 | normal |
| Login error | FR-AUTH-02 | `/login` | [A.02e Login error](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-24) | `12:24` | 1 | error |
| Register | FR-AUTH-01 | `/register` | [A.03 Register](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-18) | `4:18` | 1 | normal |
| Register validation | FR-AUTH-01 | `/register` | [A.03e Register validation](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-39) | `12:39` | 1 | error |
| Forgot password | FR-AUTH-04 | `/forgot-password` | [A.04 Forgot password](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-34) | `4:34` | 6 | normal |
| Reset password | FR-AUTH-04 | `/reset-password` | [A.05 Reset password](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-55) | `12:55` | 6 | normal |
| Email confirmed | FR-AUTH-03 | `/verify` | [A.06 Email confirmed](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=9-31) | `9:31` | 6 | normal |
| Email expired | FR-AUTH-03 | `/verify` | [A.07 Email expired](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-70) | `12:70` | 6 | error |
| Dashboard | FR-PRJ-02 | `/projects` | [P.01 Dashboard](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-53) | `4:53` | 2 | normal |
| Dashboard empty | FR-PRJ-02 | `/projects` | [P.01e empty](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-109) | `4:109` | 2 | empty |
| Dashboard loading | FR-PRJ-02 | `/projects` | [P.01l loading](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-430) | `12:430` | 2 | loading |
| Dashboard error | FR-PRJ-02 | `/projects` | [P.01x error](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-472) | `12:472` | 2 | error |
| Create project | FR-PRJ-01 | modal | [P.02 Create project](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-123) | `5:123` | 2 | normal |
| Project overview | FR-PRJ-06 | `/projects/[id]` | [P.03 Overview](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-74) | `5:74` | 2 | normal |
| Overview empty | FR-PRJ-05 | `/projects/[id]` | [P.03e empty](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-512) | `12:512` | 2 | empty |
| Overview error | FR-PRJ-06 | `/projects/[id]` | [P.03x error](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-776) | `13:776` | 2 | error |
| Search empty | FR-KN-08 | overlay | [P.04 Search empty](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-558) | `12:558` | 4 | empty |
| Confirm delete | FR-PRJ-04 | modal | [P.05 Confirm delete](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-599) | `12:599` | 2 | confirm |
| **Scene editor** | **FR-ED-02** | `/projects/…/scenes/[id]` | **[E.01 Scene editor](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-183)** | **`5:183`** | **3** | **normal** |
| Empty scene | FR-ED-01 | — | [E.02 Empty](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-369) | `6:369` | 3 | empty |
| Loading | FR-ED-03 | — | [E.03 Loading](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-830) | `12:830` | 3 | loading |
| Focus mode | FR-ED-07 | — | [E.04 Focus](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-373) | `6:373` | 3 | focus |
| Offline | FR-ED-04 | — | [E.05 Offline](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-376) | `6:376` | 3 | local |
| Conflict | FR-ED-08 | — | [E.06 Conflict](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-836) | `12:836` | 6 | conflict |
| Versions | FR-ED-08 | — | [E.07 Versions](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-850) | `12:850` | 6 | normal |
| Deleted scene | FR-MS-05 | — | [E.10 Deleted](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-867) | `12:867` | 3 | no-access |
| Confirm delete node | FR-MS-05 | modal | [E.11 Confirm](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-875) | `12:875` | 3 | confirm |
| Characters list | FR-KN-01 | `/projects/[id]/characters` | [K.01 Characters](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-2) | `6:2` | 4 | normal |
| Characters empty | FR-KN-01 | — | [K.01e empty](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-692) | `12:692` | 4 | empty |
| Character detail | FR-KN-01 | `/…/characters/[id]` | [K.02 detail](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-58) | `6:58` | 4 | normal |
| Add relationship | FR-KN-10 | modal | [K.03 Add relationship](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-729) | `12:729` | 4 | normal |
| World list | FR-KN-03 | `/projects/[id]/world` | [K.04 World](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-101) | `6:101` | 4 | normal |
| Location detail | FR-KN-03 | `/…/world/[id]` | [K.05 Location](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-750) | `12:750` | 4 | normal |
| Export | FR-IO-01 | modal | [I.01 Export](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-2) | `8:2` | 6 | normal |

### P1 — MVP Beta

| Screen | PRD | Route | Figma frame | node-id | Sprint | States |
|--------|-----|-------|-------------|---------|--------|--------|
| Command palette | FR-ED-09 | overlay | [E.08 Command palette](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-380) | `6:380` | 5 | normal |
| Plot board | FR-KN-05 | `/projects/[id]/plot` | [K.06 Plot board](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-319) | `8:319` | 4 | normal |
| Timeline | FR-KN-06 | `/projects/[id]/timeline` | [K.07 Timeline](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-385) | `8:385` | 4 | normal |
| Notes | FR-KN-07 | `/projects/[id]/notes` | [K.08 Notes](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-430) | `8:430` | 4 | normal |
| Import wizard | FR-IO-03 | modal | [I.02 Import](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-16) | `8:16` | 6 | normal |
| AI context picker | FR-AI-01 | in editor | [AI.01 Context](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-26) | `8:26` | 5 | normal |
| AI diff | FR-AI-02 | inline | [AI.02 Diff](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-34) | `8:34` | 5 | normal |
| AI consent | FR-AI-04 | modal | [AI.03 Consent](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-19) | `13:19` | 5 | normal |
| AI error | FR-AI-01 | — | [AI.04 error](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-28) | `13:28` | 5 | error |
| Profile | FR-AUTH-05 | `/settings` | [S.01 Profile](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-47) | `8:47` | 6 | normal |
| Delete account | FR-AUTH-06 | modal | [S.02 Delete account](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=8-56) | `8:56` | 6 | confirm |
| Project settings | FR-PRJ-* | `/projects/[id]/settings` | [S.03 Project settings](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-36) | `13:36` | 6 | normal |
| AI privacy | FR-AI-04 | `/settings` | [S.04 AI privacy](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-46) | `13:46` | 5 | normal |

### Responsive variants (DEC-008)

| Screen | Desktop 1440 | Compact 1024 | Mobile 390 read-only |
|--------|--------------|--------------|----------------------|
| Scene editor | ✅ `5:183` | ✅ [E.01c](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-638) `13:638` | ✅ [E.01m](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-684) `13:684` |
| Dashboard | ✅ `4:53` | ✅ [P.01c](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=13-692) `13:692` | ⬜ TODO |

---

## Screen spec: Scene Editor (P0 critical)

**PRD FR-ED-02** — главный экран. Figma: [E.01 Scene editor](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=5-183) (`5:183`).

### Zones

| Zone | Width | Content | PRD |
|------|-------|---------|-----|
| Rail | 64px | icon nav (книга, проекты, герои, мир, сюжет, заметки) | shell |
| Navigator | 260px | дерево частей/глав/сцен, нераспределённые | FR-MS-02 |
| Sheet | flex | заголовок сцены, Status Chip, sync + words, Newsreader prose | FR-ED-01 |
| Inspector | 320px | вкладки Сцена / Герои / Мир; цель, конфликт, POV, локация, участники | FR-ED-06 |

### Save indicator states

| State | Label (ru) | Figma |
|-------|------------|-------|
| saving | «Сохраняем…» | E.03 |
| saved | «Сохранено» | E.01 (`Сохранено · 842 слова`) |
| local | «Сохранено на устройстве» | E.05 Offline |
| conflict | «Конфликт» | E.06 |
| error | «Ошибка — повторить» | ⬜ отдельный frame нет; использовать E.06 pattern |

### Editor center states

- [x] empty — [E.02](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-369)
- [x] loading — [E.03](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-830)
- [x] focus — [E.04](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-373)
- [x] offline / local newer — [E.05](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=6-376)
- [x] conflict — [E.06](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-836)
- [x] deleted / no-access — [E.10](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=12-867)
- [ ] error retry + local draft link — нет отдельного кадра

### Keyboard (PRD §7.9, ТЗ §5.5)

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+S | Force sync |
| Ctrl/Cmd+Shift+F | Focus mode (E.04) |
| Alt+↑/↓ | Prev/next scene |
| Ctrl/Cmd+K | Command palette (E.08, P1) |
| Escape | Close overlays |

---

## Screen spec: Dashboard (P0)

**PRD FR-PRJ-02.** Figma: [P.01](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-53).

Карточка проекта живёт внутри кадра (отдельного компонента нет). Empty: ценность + «Новый проект»; импорт — secondary до Sprint 6.

---

## Accessibility checklist (PRD NFR-09)

Применять к каждому P0/P1 frame:

- [ ] Contrast ≥ WCAG AA (4.5:1 body, 3:1 large) — особенно `text/on-chrome` на ink
- [ ] Focus ring visible on all interactives
- [ ] Icon buttons / rail items have `aria-label`
- [ ] Status not color-only (Status Chip = icon + label)
- [ ] Modal focus trap + Escape
- [ ] Tree: keyboard nav, DnD alternative
- [ ] 200% zoom: editor usable at desktop 1280

---

## Design → Dev workflow

```
1. Design создаёт/обновляет frame в Ink Studio
2. Node-id вписывается в Screen inventory
3. Dev вызывает get_design_context(fileKey=DY4LOZnkponU6E1rmb34Fs, nodeId) до реализации
4. Переиспользовать @/components/ui/* ; расширять только доменные компоненты
5. Поведение: PRD + Use Cases; пиксели: этот файл (ТЗ §5.1)
6. Component mapping обновляется, когда код догоняет Figma
```

### Sprint 3 handoff minimum

1. ✅ Figma `E.01` desktop + empty + loading + focus + offline + conflict
2. ⬜ Компоненты: Tree item, Status Chip, Save indicator — как instances, не только embedded
3. ⬜ `globals.css` синхронизирован с Ink Studio variables
4. ⬜ Product sign-off DEC-011

---

## Audit checklist (DEC-011)

| # | Task | Owner | Done |
|---|------|-------|------|
| 1 | Figma pages под P0/P1 | Design | ✅ 9 pages, Ink Studio |
| 2 | Color/type/spacing variables в Figma | Design | ✅ [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) |
| 3 | Component set (кнопки, input, chips, rail) | Design | 🟡 базовый набор; нет Card/Tree как components |
| 4 | Frame Scene editor + состояния | Design | ✅ |
| 5 | Frames P0 screens | Design | ✅ включая error/empty/loading |
| 6 | Frames P1 screens | Design | ✅ plot, timeline, notes, AI, import, settings |
| 7 | Sync variables → `globals.css` | Design + Eng | 🔴 код на старой палитре |
| 8 | Fill node-id column | Design | ✅ |
| 9 | Code Connect remap на новые node-id | Eng | 🟡 URL обновлены; publish по-прежнему Starter-blocked |
| 10 | Product sign-off DEC-011 | Product | ⬜ |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Initial handoff; старый file `7vP03INYMrwQ3Q6qT7A2NT` |
| 2026-08-04 | Frames Landing/Auth/World, Code Connect, variables spec |
| 2026-08-13 | **SoT → Manuscript — Ink Studio** (`DY4LOZnkponU6E1rmb34Fs`): rail + paper sheet, Geist/Newsreader/Instrument Serif, полный inventory P0/P1 + responsive |

---

## Связанные документы

- [DECISION-LOG.md](../../roadmap/DECISION-LOG.md) — DEC-008, DEC-011
- [MVP-SCOPE-MATRIX.md](../../roadmap/MVP-SCOPE-MATRIX.md)
- [PRD v2.1](../../prd/PRD.md)
- [ТЗ §5](../../tz/TZ.md#5-пользовательский-интерфейс)
- [Figma — Manuscript Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio)
- [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md)
- [CODE-CONNECT.md](./CODE-CONNECT.md)
