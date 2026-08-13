# Figma Variables — Manuscript Ink Studio

> **Figma file:** [Manuscript — Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio)  
> **File key:** `DY4LOZnkponU6E1rmb34Fs`  
> **Page:** `00 Foundations` (`2:2`)  
> **Handoff:** [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)  
> **Code (пока отстаёт):** `apps/web/src/app/globals.css`  
> **Token dump:** `apps/web/design-tokens/ink-studio-tokens.json`

Variables **уже созданы в Figma**. Этот документ описывает факт файла, не план импорта.

Старый файл `7vP03INYMrwQ3Q6qT7A2NT` и скрипты `figma-sync-*.js` под его коллекции `Manuscript / Color` — **не запускать** на Ink Studio.

---

## Статус

| Шаг | Статус | Комментарий |
|-----|--------|-------------|
| Collections в Figma | ✅ | Primitives, Color (Light/Dark), Spacing, Radius, Typeface |
| Semantic Color aliases | ✅ | chrome / sheet / accent / status |
| Text styles | ✅ | 11 styles, Geist / Instrument Serif / Newsreader / Geist Mono |
| Foundations swatch frame | ✅ | page `00 Foundations` |
| `globals.css` sync | 🔴 | код на старой HSL-палитре Inter / Source Serif 4 |
| Re-bind components | ✅ | UI Kit на `01 Components` связан с variables |
| Dark product mode | 🟡 | Dark aliases есть; MVP — Light. Sheet остаётся бумажным и в Dark |

---

## Collections (факт Figma)

### 1. `Primitives` — raw palette

**Modes:** `Value`

| Variable | Hex |
|----------|-----|
| `ink/950` | `#0C0F12` |
| `ink/800` | `#1A1F24` |
| `ink/700` | `#252B32` |
| `ink/600` | `#3A424A` |
| `ink/400` | `#6B747C` |
| `ink/200` | `#C5C0B5` |
| `paper/0` | `#FAF7F0` |
| `paper/50` | `#F4EFE4` |
| `paper/100` | `#EBE4D4` |
| `teal/700` | `#245753` |
| `teal/600` | `#2F6F6A` |
| `teal/400` | `#4A9A93` |
| `rust/500` | `#C45C26` |
| `sage/600` | `#3D7A4A` |
| `danger/500` | `#C23B2E` |
| `white` | `#FFFFFF` |
| `black` | `#000000` |

### 2. `Color` — semantic

**Modes:** `Light` (default) · `Dark`  
Все значения — alias на Primitives.

| Variable | Light | Dark | Scope | Роль |
|----------|-------|------|-------|------|
| `color/bg/app` | paper/0 `#FAF7F0` | ink/950 | FRAME_FILL | страница вне chrome |
| `color/bg/chrome` | ink/950 `#0C0F12` | ink/950 | FRAME_FILL | rail, navigator, inspector |
| `color/bg/sheet` | paper/50 `#F4EFE4` | paper/50 | FRAME_FILL, SHAPE_FILL | лист рукописи (бумага в обоих режимах) |
| `color/bg/surface` | white | ink/800 | FRAME_FILL, SHAPE_FILL | карточки, диалоги |
| `color/bg/muted` | paper/100 | ink/700 | FRAME_FILL, SHAPE_FILL | вторичные поверхности |
| `color/bg/inverse` | ink/950 | paper/50 | FRAME_FILL | инверсия |
| `color/text/primary` | ink/950 | paper/50 | TEXT_FILL | основной текст на бумаге |
| `color/text/secondary` | ink/600 | ink/200 | TEXT_FILL | вторичный |
| `color/text/muted` | ink/400 | ink/400 | TEXT_FILL | подписи, meta |
| `color/text/on-chrome` | paper/50 | paper/50 | TEXT_FILL | текст на тёмном chrome |
| `color/text/accent` | teal/700 | teal/400 | TEXT_FILL | ссылки |
| `color/text/inverse` | paper/50 | ink/950 | TEXT_FILL | на accent/inverse |
| `color/border/subtle` | paper/100 | ink/700 | STROKE_COLOR | слабая граница |
| `color/border/default` | ink/200 | ink/600 | STROKE_COLOR | граница контролов |
| `color/accent` | teal/600 `#2F6F6A` | teal/400 | FRAME_FILL, SHAPE_FILL, STROKE | CTA |
| `color/accent/fg` | white | ink/950 | TEXT_FILL | текст на accent |
| `color/danger` | danger/500 `#C23B2E` | danger/500 | FRAME_FILL, SHAPE_FILL, TEXT | ошибки, удаление |
| `color/status/idea` | ink/400 | ink/400 | SHAPE_FILL, TEXT_FILL | статус сцены |
| `color/status/planned` | ink/600 | ink/200 | SHAPE_FILL, TEXT_FILL | |
| `color/status/draft` | teal/600 | teal/400 | SHAPE_FILL, TEXT_FILL | |
| `color/status/revision` | rust/500 | rust/500 | SHAPE_FILL, TEXT_FILL | |
| `color/status/ready` | sage/600 | sage/600 | SHAPE_FILL, TEXT_FILL | |

### 3. `Spacing`

Scope: `WIDTH_HEIGHT`, `GAP`.

| Variable | Value |
|----------|-------|
| `spacing/2` | 2 |
| `spacing/4` | 4 |
| `spacing/8` | 8 |
| `spacing/12` | 12 |
| `spacing/16` | 16 |
| `spacing/24` | 24 |
| `spacing/32` | 32 |
| `spacing/48` | 48 |
| `spacing/64` | 64 |

### 4. `Radius`

Scope: `CORNER_RADIUS`.

| Variable | Value |
|----------|-------|
| `radius/sm` | 4 |
| `radius/md` | 8 |
| `radius/lg` | 16 |
| `radius/xl` | 24 |
| `radius/full` | 999 |

### 5. `Typeface`

Scope: `FONT_FAMILY`.

| Variable | Value |
|----------|-------|
| `family/sans` | Geist |
| `family/serif` | Instrument Serif |
| `family/prose` | Newsreader |
| `family/mono` | Geist Mono |

---

## Text styles

| Style | Font | Size / LH | Usage |
|-------|------|-----------|-------|
| `Display/Hero` | Instrument Serif Regular | 56 / 64 | лендинг |
| `Display/Title` | Instrument Serif Regular | 32 / 40 | название проекта, сцены |
| `Display/H2` | Instrument Serif Regular | 24 / 32 | секции |
| `Prose/Lead` | Newsreader Regular | 20 / 32 | лид |
| `Prose/Body` | Newsreader Regular | 18 / 32 | текст сцены |
| `UI/Body/MD` | Geist Regular | 16 / 24 | UI body |
| `UI/Body` | Geist Regular | 14 / 20 | nav, формы |
| `UI/Button` | Geist Medium | 14 / 20 | кнопки |
| `UI/Label` | Geist Medium | 12 / 16 | chips, labels |
| `UI/Caption` | Geist Regular | 12 / 16 | подписи |
| `Mono/Meta` | Geist Mono Regular | 11 / 16 | sync, words, timestamps |

---

## Mapping → код (целевой)

Пока `globals.css` не синхронизирован. Целевые CSS custom properties:

| Figma | CSS (план) | Сегодня в коде |
|-------|------------|----------------|
| `color/bg/app` | `--background` | `#fbfaf9` (близко к paper/0) |
| `color/bg/chrome` | `--sidebar-background` | светлый `#F7F5F3` — **сломать** |
| `color/bg/sheet` | `--editor-sheet` | нет |
| `color/text/primary` | `--foreground` | `#272320` |
| `color/accent` | `--accent` | brown `#7C5B46` — **сломать** |
| `family/sans` | `--font-sans` | Inter — **сломать** |
| `family/serif` | `--font-serif` | Source Serif 4 — **сломать** |
| `family/prose` | `--font-prose` | нет |
| `family/mono` | `--font-mono` | system mono |

Не подгонять Ink Studio под старый CSS. При реализации — код следует Figma.

---

## Scene status

PRD: статус **не только цвет** — icon + label. Компонент: `Status Chip` (`3:21`).

| Status | Token | Chip variant |
|--------|-------|--------------|
| idea | `color/status/idea` | `Status=idea` `3:6` |
| planned | `color/status/planned` | `Status=planned` `3:9` |
| draft | `color/status/draft` | `Status=draft` `3:12` |
| revision | `color/status/revision` | `Status=revision` `3:15` |
| ready | `color/status/ready` | `Status=ready` `3:18` |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Spec под старый file `7vP03INYMrwQ3Q6qT7A2NT` (скрипты импорта) |
| 2026-08-13 | SoT → Ink Studio: факт collections, aliases, type ramp; код помечен как отстающий |
