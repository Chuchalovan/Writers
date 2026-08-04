# Design Handoff

> **Figma:** [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)  
> **PRD:** §8 (design system), §23–25 (screens)  
> **Decision:** [DEC-011](./DECISION-LOG.md#dec-011-figma-design-handoff)  
> **Scope:** [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)  
> **Обновлено:** 4 августа 2026 (Figma frames synced)

Handoff-документ для разработки: экран → Figma frame → route → компоненты → состояния → токены.

---

## Статус audit

| Проверка | Статус | Комментарий |
|----------|--------|-------------|
| Figma file доступен | 🟢 | File key `7vP03INYMrwQ3Q6qT7A2NT` |
| Страницы / frames P0–P1 | 🟡 | **13 screen frames** на page `10 Screens — P0/P1`; auth на той же page (лимит Starter: 3 pages) |
| Design system components | 🟡 | UI Kit: 11 components на `01 Components` |
| Figma variables | 🟡 | Spec + script готовы — [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md); MCP publish blocked |
| Code tokens (`globals.css`) | 🟢 | Source of truth + scene status tokens |
| shadcn/ui base components | 🟢 | Button, Input, Card… в коде |
| PRD screen specs | 🟢 | §23–25 нормативны |
| Scene editor states | 🟡 | normal + empty + loading; conflict/error/read-only — TODO |

**Вывод:** основные P0/P1 frames **существуют в Figma** и привязаны ниже. Остаётся: variables, missing screens (Notes, Search, Settings…), error states, Code Connect publish (шаблоны готовы — см. [CODE-CONNECT.md](./CODE-CONNECT.md)).

### Quick links (P0 critical)

| Frame | Figma |
|-------|-------|
| **10.07 Scene Editor** | [Open](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-211) |
| 10.07b Empty | [Open](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-2) |
| 10.07c Loading | [Open](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-69) |
| 10.02 Projects | [Open](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-2) |
| Manuscript UI Kit | [Open](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=8-2) |

---

## Figma file structure (фактическая)

```
Manuscript Design System (Starter plan — max 3 pages)
├── 00 Foundations          page id: 0:1     ← пусто; tokens TODO
├── 01 Components           page id: 6:82   ← Manuscript UI Kit (8:2)
└── 10 Screens — P0/P1      page id: 6:83   ← все экраны + auth
```

> **Note:** отдельная page `12 Screens — Auth` недоступна на Starter plan. Auth frames (`12.01`, `12.02`) размещены на `10 Screens — P0/P1`.

**Deep link template:**

```
https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id={NODE_ID}
```

`{NODE_ID}`: двоеточие → дефис (`9:211` → `9-211`).

---

## Breakpoints & layout shell

Источник: PRD §8.2, [DEC-008](./DECISION-LOG.md#dec-008-глубина-mobile).

| Token | Min width | Layout |
|-------|-----------|--------|
| `desktop` | 1280px | 3 columns: nav (240–280px) \| editor (flex) \| context (300–360px) |
| `compact` | 900px | Side panels collapsible; editor priority |
| `mobile` | &lt;900px | Read-only scene view; no rich-text editing |

### App shell (dashboard routes)

```
┌──────────────────────────────────────────────────────────────┐
│ Header — breadcrumb, save status, actions, profile           │
├──────────┬───────────────────────────────────┬───────────────┤
│ Sidebar  │ Main content                      │ (optional)    │
│ global   │ page-specific                     │ context panel │
│ nav      │                                   │               │
│ 240px    │ flex-1                            │ 320px         │
└──────────┴───────────────────────────────────┴───────────────┘
```

**Code:** `apps/web/src/app/[locale]/(dashboard)/layout.tsx` — Sidebar + Header + main.  
**Scene editor (Sprint 3):** заменит generic main на 3-column внутри route.

---

## Design tokens

### Interim: code → Figma

**Source of truth:** `globals.css` → [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) → Figma `Manuscript / Color` collection.

#### Color (HSL CSS variables)

| Token | Light | Role | Tailwind |
|-------|-------|------|----------|
| `background` | `40 25% 98%` | Page bg, calm neutral | `bg-background` |
| `foreground` | `24 10% 14%` | Body text | `text-foreground` |
| `primary` | `24 10% 14%` | Primary actions | `bg-primary` |
| `secondary` | `38 18% 94%` | Secondary surfaces | `bg-secondary` |
| `muted` | `38 15% 92%` | Subtle bg | `bg-muted` |
| `muted-foreground` | `24 6% 46%` | Secondary text | `text-muted-foreground` |
| `accent` | `24 28% 38%` | Links, highlights | `text-accent` |
| `destructive` | `0 72% 51%` | Delete, errors | `bg-destructive` |
| `border` | `38 14% 88%` | Borders | `border-border` |
| `sidebar-background` | `38 20% 96%` | Nav panel | `bg-sidebar` |

**File:** `apps/web/src/app/globals.css`  
**Dark mode:** `.dark` variants defined — MVP: light only unless Design specifies otherwise.

#### Typography

| Role | Font | CSS | Usage |
|------|------|-----|-------|
| UI / body | Inter | `--font-sans` | Labels, nav, forms |
| Display / hero | Source Serif 4 | `--font-serif` | Landing headings, project titles |
| Mono labels | system mono | `.font-label` | Status, word count, timestamps |

**File:** `apps/web/src/app/[locale]/layout.tsx`

#### Radius & spacing

| Token | Value | Notes |
|-------|-------|-------|
| `--radius` | `0.375rem` (6px) | Base; cards `rounded-lg` |
| Button height | 36px (`h-9`) | shadcn default |
| Content padding | 24px (`p-6`) | Dashboard main |

#### Scene status colors

PRD §6.4 — **icon + label**, не только цвет (§8.4).

| Status | Token | Tailwind | Light HSL |
|--------|-------|----------|-----------|
| idea | `--status-idea` | `text-status-idea` | `24 6% 46%` |
| planned | `--status-planned` | `text-status-planned` | `24 28% 62%` |
| draft | `--status-draft` | `text-status-draft` | `24 28% 38%` |
| revision | `--status-revision` | `text-status-revision` | `32 95% 44%` |
| ready | `--status-ready` | `text-status-ready` | `142 76% 36%` |

Figma: `color/status/*` — см. [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md).

---

## Component mapping

PRD §8.3 → Figma `Manuscript UI Kit` → код.

| PRD component | Figma component | node-id | Code | Code Connect | Status |
|---------------|-----------------|---------|------|--------------|--------|
| Button primary | `Button/Primary` | `8:6` | `@/components/ui/button` `default` | ✅ `button-primary.figma.ts` | 🟢 |
| Button secondary | `Button/Secondary` | `8:8` | `secondary` | ✅ `button-secondary.figma.ts` | 🟢 |
| Button tertiary | `Button/Ghost` | `8:10` | `ghost` | ✅ `button-ghost.figma.ts` | 🟢 |
| Nav item | `Navigation Item/Active` / `Default` | `8:13` / `8:16` | `@/components/layout/sidebar` | ✅ `navigation-item*.figma.ts` | 🟡 custom |
| Badge / chip | `Chip/POV`, `Chip/Location`, … | `8:20`–`8:29` | ⬜ | ⬜ | 🟡 Figma only |
| Scene card | `Card/Scene` | `8:33` | `project-card.tsx` pattern | ✅ `project-card.figma.ts` | 🟡 |
| AI block | `Panel/AI Review` | `8:36` | ⬜ | ⬜ | 🟡 Figma only |
| Input | — | — | `@/components/ui/input` | ⬜ | 🔴 no Figma |
| Tree item | embedded in `10.07` | `9:239` | `manuscript-tree.tsx` | ✅ `tree-item.figma.ts` | 🟡 |
| Project card | embedded in `10.02` | `9:32` | `project-card.tsx` | ⬜ | 🟡 |
| Character card | embedded in `10.08` | `9:306` | ⬜ | ⬜ | 🟡 |
| Textarea, Select, Dialog, Toast… | — | — | ⬜ | ⬜ | 🔴 |

**UI Kit:** [Manuscript UI Kit](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=8-2)

### Button variant map (PRD → shadcn)

| PRD | shadcn `variant` |
|-----|------------------|
| primary | `default` |
| secondary | `secondary` |
| tertiary | `ghost` or `outline` |
| destructive | `destructive` |
| icon | `size="icon"` + `ghost` |

---

## Screen inventory

Обязательные состояния (PRD §8.5): **normal · empty · loading · error · no-access/deleted**.

### P0 — Closed Alpha

| Screen | PRD | Route | Figma frame | node-id | Sprint | States in Figma |
|--------|-----|-------|-------------|---------|--------|-----------------|
| Landing | — | `/[locale]` | [10.01 Landing](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-142) | `14:142` | 1 | normal |
| Login | §6.1 | `/login` | [12.01 Login](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-192) | `14:192` | 1 | normal |
| Register | §6.1 | `/register` | [12.02 Register](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-202) | `14:202` | 1 | normal |
| Dashboard (projects) | §25.1 | `/projects` | [10.02 Dashboard — Projects](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-2) | `9:2` | 2 | normal |
| Project overview | §25.2 | `/projects/[id]` | [10.05 Project Overview](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-65) | `9:65` | 2 | normal |
| **Scene editor** | **§23** | `/projects/…/scenes/[id]` | **[10.07 Scene Editor](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-211)** | **`9:211`** | **3** | **normal** |
| Scene editor empty | §23.5 | — | [10.07b Empty](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-2) | `14:2` | 3 | empty |
| Scene editor loading | §23.5 | — | [10.07c Loading](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-69) | `14:69` | 3 | loading |
| Characters list | §25.4 | `/projects/[id]/characters` | [10.08 Characters](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-278) | `9:278` | 4 | normal |
| World list | §25.5 | `/projects/[id]/world` | [10.10 World](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-149) | `14:149` | 4 | normal |
| Create project dialog | §5.1 | modal | ⬜ `10.03` | — | 2 | TODO |
| Project onboarding | §22 | `/projects/[id]` | ⬜ `10.04` | — | 2 | TODO (code exists) |
| Character detail | §6.7 | `/…/characters/[id]` | ⬜ `10.09` | — | 4 | TODO |
| Export dialog | §25.9 | modal | ⬜ `10.11` | — | 6 | TODO |

### P1 — MVP Beta

| Screen | PRD | Route | Figma frame | node-id | Sprint | States |
|--------|-----|-------|-------------|---------|--------|--------|
| Plot board | §25.3 | `/projects/[id]/plot` | [11.01 Plot Board](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-135) | `9:135` | 4 | normal |
| Timeline | §25.6 | `/projects/[id]/timeline` | [11.02 Timeline](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-340) | `9:340` | 4 | normal |
| AI panel | §23.7 | in editor | [11.05 AI Panel](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-427) | `9:427` | 5 | normal |
| Notes / materials | §6.10 | `/projects/[id]/notes` | ⬜ `11.03` | — | 4 | TODO |
| Global search | §25.7 | overlay | ⬜ `11.04` | — | 4 | TODO |
| AI diff / accept | §23.7 | inline | ⬜ `11.06` | — | 5 | TODO |
| Import wizard | §25.8 | modal | ⬜ `11.07` | — | 6 | TODO |
| Settings | §6.1 | `/settings` | ⬜ `11.08` | — | 6 | TODO |
| Project settings | §4 | `/projects/[id]/settings` | ⬜ `11.09` | — | 6 | TODO |

### Responsive variants (DEC-008)

| Screen | Desktop | Compact | Mobile read-only |
|--------|---------|---------|------------------|
| Scene editor | ✅ `9:211` | ⬜ TODO | ⬜ TODO |
| Dashboard | ✅ `9:2` | ⬜ TODO | ⬜ TODO |

---

## Screen spec: Scene Editor (P0 critical)

**PRD §23** — главный экран. Figma: [10.07 Scene Editor](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-211) (`9:211`).

### Zones

| Zone | Width | Content | PRD |
|------|-------|---------|-----|
| Top bar | 100% | breadcrumb, scene title, status, save, words, focus, versions, AI | §23.3 |
| Left nav | 240–280px | tree, DnD, context menu, trash | §23.4 |
| Editor | flex, max ~65ch | TipTap, floating toolbar | §23.5 |
| Right panel | 300–360px | tabs: Scene / Characters / World / Links / Notes | §23.6 |

### Save indicator states

| State | Label (ru) | Visual |
|-------|------------|--------|
| saving | «Сохраняем…» | spinner |
| saved | «Сохранено» | muted check |
| local | «Сохранено на устройстве» | amber dot |
| conflict | «Конфликт» | destructive, action |
| error | «Ошибка — повторить» | destructive + retry |

### Editor center states (§23.5)

- [x] empty — [10.07b](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-2)
- [x] loading — [10.07c](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=14-69)
- [ ] local newer — auto-restore + toast
- [ ] read-only — reason shown
- [ ] conflict — side-by-side, both kept
- [ ] error — retry + local draft link

### Keyboard (§23.8)

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+S | Force sync |
| Ctrl/Cmd+Shift+F | Focus mode |
| Alt+↑/↓ | Prev/next scene |
| Ctrl/Cmd+K | Command palette |
| Escape | Close overlays |

---

## Screen spec: Dashboard (P0)

**PRD §25.1**

### Project card anatomy

```
┌─────────────────────────────────┐
│ [cover/placeholder]  Title      │
│                      genre      │
│                      word count │
│                      last scene │
│                      status     │
└─────────────────────────────────┘
```

**Code today:** title, genre, word count, node count — **missing:** cover, last scene, continue CTA on dashboard.

### Empty state copy direction

- Headline: ценность («Ваша студия для книги»)
- Primary: «Новый проект»
- Secondary: «Импортировать» (P1 — hide until Sprint 6)

---

## Accessibility checklist (PRD §8.4)

Применять к каждому P0/P1 frame:

- [ ] Contrast ≥ WCAG AA (4.5:1 body, 3:1 large)
- [ ] Focus ring visible on all interactives (`ring-ring`)
- [ ] Icon buttons have `aria-label`
- [ ] Status not color-only (icon + text)
- [ ] Modal focus trap + Escape
- [ ] Tree: keyboard nav, DnD alternative
- [ ] 200% zoom: editor usable at 1280px desktop

---

## Design → Dev workflow

```
1. Design creates/updates frame in Figma
2. Paste node-id into this doc (Screen inventory)
3. Dev calls get_design_context(fileKey, nodeId) before implementing
4. Reuse @/components/ui/* ; extend only for domain components
5. PRD § behavior wins if pixel vs logic conflict (PRD §8.1)
6. Update Component mapping when new code component lands
```

### Sprint 3 handoff minimum

Before Scene editor implementation:

1. ✅ Figma frame `10.07` — desktop normal + empty + loading
2. ⬜ Component instances: Tree item, Badge/status, Save indicator (top bar)
3. ⬜ Figma variables synced with `globals.css`
4. ⬜ Product sign-off DEC-011 partial acceptance

---

## Audit checklist (DEC-011)

| # | Task | Owner | Done |
|---|------|-------|------|
| 1 | Figma pages (3-page Starter limit) | Design | 🟡 3 pages; auth co-located |
| 2 | Define color/type/spacing variables in Figma | Design | 🟡 spec ready — [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) |
| 3 | Build §8.3 component set | Design | 🟡 11 components in UI Kit |
| 4 | Frame `10.07 Scene editor` + empty/loading | Design | ✅ |
| 5 | Frames P0 screens (core set) | Design | 🟡 10/14 |
| 6 | Frames P1 screens | Design | 🟡 3/9 |
| 7 | Export variables → sync `globals.css` | Design + Eng | 🟡 CSS + status tokens done; Figma pending |
| 8 | Fill node-id column in this doc | Design | ✅ |
| 9 | Code Connect for Button, Card, Tree item | Eng | ✅ 7 templates; publish blocked on Starter |
| 10 | Product sign-off DEC-011 | Product | ⬜ |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Initial handoff doc; Figma MCP audit — file appeared empty |
| 2026-08-04 | Figma sync: renamed frames, added Landing/Auth/World, Scene empty+loading; node-ids linked |
| 2026-08-04 | Code Connect: 7 parserless templates (+ tree item); parse OK |
| 2026-08-04 | Figma variables spec, JSON export, sync script; scene status tokens in CSS |

---

## Связанные документы

- [DECISION-LOG.md](./DECISION-LOG.md) — DEC-008, DEC-011
- [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)
- [PRD v1.0 §8, §23–25](./Манускрипт%20—%20Product%20Requirements%20Document%20(PRD)%20v1.0.md)
- [Figma — Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)
- [FIGMA-VARIABLES.md](./FIGMA-VARIABLES.md) — tokens spec + Figma sync script
- [CODE-CONNECT.md](./CODE-CONNECT.md) — Figma ↔ code mappings
