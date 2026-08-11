# Figma Variables — Manuscript Design System

> **Figma file:** [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)  
> **Page:** `00 Foundations`  
> **Code source:** `apps/web/src/app/globals.css`  
> **Token export:** `apps/web/design-tokens/manuscript-tokens.json`  
> **Handoff:** [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)

Синхронизация design tokens между кодом и Figma. MVP: **light mode** в продукте; dark — в variables для будущего.

---

## Статус

| Шаг | Статус | Комментарий |
|-----|--------|-------------|
| Token spec из `globals.css` | ✅ | JSON + таблицы ниже |
| Scene status tokens в CSS | ✅ | `--status-*` в `globals.css` |
| Figma collection `Manuscript / Color` | ⬜ | MCP rate limit — scripts ready |
| Figma collection `Manuscript / Radius` + Spacing | ⬜ | script ready |
| Foundations swatch frame | ⬜ | `figma-foundations-swatches.js` |
| Status tokens wired in code | ✅ | `manuscript-tree.tsx` → `text-status-*` |
| Figma text styles (Inter, Source Serif 4) | ⬜ | После variables |
| Re-bind UI Kit components to variables | ⬜ | После создания collections |

---

## Collections (целевая структура)

### 1. `Manuscript / Color`

**Modes:** `Light` (default) · `Dark`

| Figma variable | CSS | Light hex | Scope |
|----------------|-----|-----------|-------|
| `color/background` | `--background` | `#FBFAF9` | FRAME_FILL, SHAPE_FILL |
| `color/foreground` | `--foreground` | `#272320` | TEXT_FILL |
| `color/card` | `--card` | `#FFFFFF` | FRAME_FILL, SHAPE_FILL |
| `color/card/foreground` | `--card-foreground` | `#272320` | TEXT_FILL |
| `color/primary` | `--primary` | `#272320` | FRAME_FILL, SHAPE_FILL |
| `color/primary/foreground` | `--primary-foreground` | `#FBFAF9` | TEXT_FILL |
| `color/secondary` | `--secondary` | `#F2F0ED` | FRAME_FILL, SHAPE_FILL |
| `color/secondary/foreground` | `--secondary-foreground` | `#38322E` | TEXT_FILL |
| `color/muted` | `--muted` | `#EEEBE8` | FRAME_FILL, SHAPE_FILL |
| `color/muted/foreground` | `--muted-foreground` | `#7C746E` | TEXT_FILL |
| `color/accent` | `--accent` | `#7C5B46` | FRAME_FILL, SHAPE_FILL, TEXT_FILL |
| `color/accent/foreground` | `--accent-foreground` | `#FBFAF9` | TEXT_FILL |
| `color/destructive` | `--destructive` | `#DC2828` | FRAME_FILL, SHAPE_FILL |
| `color/destructive/foreground` | `--destructive-foreground` | `#FAFAFA` | TEXT_FILL |
| `color/border` | `--border` | `#E5E2DC` | STROKE_COLOR |
| `color/input` | `--input` | `#E5E2DC` | STROKE_COLOR |
| `color/ring` | `--ring` | `#7C5B46` | STROKE_COLOR |
| `color/sidebar/background` | `--sidebar-background` | `#F7F5F3` | FRAME_FILL |
| `color/sidebar/foreground` | `--sidebar-foreground` | `#272320` | TEXT_FILL |
| `color/sidebar/border` | `--sidebar-border` | `#E5E2DC` | STROKE_COLOR |
| `color/sidebar/accent` | `--sidebar-accent` | `#EEECE7` | FRAME_FILL |
| `color/status/idea` | `--status-idea` | `#7C746E` | TEXT_FILL |
| `color/status/planned` | `--status-planned` | `#B8957F` | TEXT_FILL |
| `color/status/draft` | `--status-draft` | `#7C5B46` | TEXT_FILL |
| `color/status/revision` | `--status-revision` | `#D97706` | TEXT_FILL |
| `color/status/ready` | `--status-ready` | `#16A34A` | TEXT_FILL |

**Code syntax (WEB):** `var(--background)`, `var(--accent)`, … — совпадает с именем CSS custom property.

Dark mode hex — см. `manuscript-tokens.json`.

### 2. `Manuscript / Radius`

**Modes:** single (default)

| Figma variable | CSS | Value | Scope |
|----------------|-----|-------|-------|
| `radius/base` | `--radius` | `6` | CORNER_RADIUS |
| `radius/md` | calc | `4` | CORNER_RADIUS |
| `radius/sm` | calc | `2` | CORNER_RADIUS |

### 3. `Manuscript / Spacing`

| Variable | Value | Scope |
|----------|-------|-------|
| `spacing/xs` | 4 | GAP, WIDTH_HEIGHT |
| `spacing/sm` | 8 | GAP, WIDTH_HEIGHT |
| `spacing/md` | 16 | GAP, WIDTH_HEIGHT |
| `spacing/lg` | 24 | GAP, WIDTH_HEIGHT |
| `spacing/xl` | 32 | GAP, WIDTH_HEIGHT |

### 4. Text styles (не variables)

| Style name | Font | Size | Weight | Usage |
|------------|------|------|--------|-------|
| `UI/Body/SM` | Inter | 14 | Regular | Nav, forms |
| `UI/Body/MD` | Inter | 16 | Regular | Body |
| `UI/Label/XS` | Inter | 12 | Medium | Buttons, chips |
| `Display/H1` | Source Serif 4 | 48 | Regular | Landing hero |
| `Display/H2` | Source Serif 4 | 32 | Regular | Project titles |
| `Mono/Status` | Inter (tabular) | 12 | Regular | Word count, timestamps |

---

## Автосинхронизация (Figma MCP)

**Порядок запуска** (когда MCP rate limit сброшен):

| # | Script | Результат |
|---|--------|-----------|
| 1 | `apps/web/scripts/figma-sync-color-variables.js` | Collection `Manuscript / Color`, 29 vars, Light/Dark |
| 2 | `apps/web/scripts/figma-sync-radius-spacing.js` | `Manuscript / Radius` + `Manuscript / Spacing` |
| 3 | `apps/web/scripts/figma-foundations-swatches.js` | Frame `Color — Light mode` на `00 Foundations` |

В Cursor: *«Run figma-sync-color-variables.js on file 7vP03INYMrwQ3Q6qT7A2NT»* — затем #2 и #3.

**Без MCP:** импорт subset через [Tokens Studio for Figma](https://tokens.studio/) → `design-tokens/figma-import-subset.json` (8 ключевых цветов; полный набор — только через скрипт #1).

---

## Ручной импорт в Figma

1. Открыть [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)
2. **Local variables** → Create collection `Manuscript / Color`
3. Rename default mode → `Light`, add mode `Dark`
4. Для каждой строки таблицы выше: Create variable (Color), paste hex, set WEB code syntax
5. На page `00 Foundations`: frame **Color swatches** — строка 24×24 swatch + label на `color/background` … `color/status/ready`
6. В UI Kit (`01 Components`): re-bind fills/strokes/text to variables (replace hardcoded `#272320` etc.)

---

## Scene status (PRD §6.4)

PRD: статус **не только цвет** — icon + label (§8.4).

| Status | Token | Icon | Chip in Figma |
|--------|-------|------|---------------|
| idea | `color/status/idea` | ○ | `Chip/Status` variant |
| planned | `color/status/planned` | ◐ | |
| draft | `color/status/draft` | ● | |
| revision | `color/status/revision` | ↻ | |
| ready | `color/status/ready` | ✓ | |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Radius/spacing scripts, swatches script, Tokens Studio subset, status colors in tree |
