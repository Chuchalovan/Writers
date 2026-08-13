# Code Connect

> Figma file: [Manuscript — Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio)  
> File key: `DY4LOZnkponU6E1rmb34Fs`  
> Handoff: [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)

Связь Figma-компонентов UI Kit с кодом в `apps/web`. Шаблоны — parserless `.figma.ts` (формат `figma.code`).

Старые node-id файла `7vP03INYMrwQ3Q6qT7A2NT` недействительны для publish в Ink Studio.

---

## Требования Figma

| Требование | Статус |
|------------|--------|
| Organization или Enterprise plan | ❌ сейчас Starter |
| Dev или Full seat | проверить у admin |
| Компоненты **опубликованы** в team library | ⬜ TODO |

Без Org/Enterprise `figma connect publish` и MCP Code Connect API недоступны. Локальные шаблоны обновлены на новые URL — publish после апгрейда.

---

## Mappings

| Figma component | node-id | Code | Template |
|-----------------|---------|------|----------|
| `Button` / Primary | `2:72` | `@/components/ui/button` | `src/figma/button-primary.figma.ts` |
| `Button` / Ghost | `2:74` | `variant="ghost"` | `src/figma/button-ghost.figma.ts` |
| `Button` / Accent | `2:76` | `variant="secondary"` (временный аналог) | `src/figma/button-secondary.figma.ts` |
| `Button` / Destructive | `2:78` | `variant="destructive"` | ⬜ нет шаблона |
| `Nav Rail Item` / Active | `3:57` | Sidebar / будущий rail | `src/figma/navigation-item.figma.ts` |
| `Nav Rail Item` / Default | `3:52` | Sidebar / будущий rail | `src/figma/navigation-item-default.figma.ts` |
| `Input` | `3:2` | `@/components/ui/input` | ⬜ |
| `Status Chip` | `3:21` | нет в коде | ⬜ |

### Screen-embedded (нет component)

| Pattern | Где в Figma | Code | Template |
|---------|-------------|------|----------|
| Tree item | `E.01` Navigator `5:215` | `manuscript-tree.tsx` | `src/figma/tree-item.figma.ts` (stale, URL → editor) |
| Project card | `P.01` `4:53` | `project-card.tsx` | `src/figma/project-card.figma.ts` (stale, URL → dashboard) |

---

## Конфигурация

- **Config:** `apps/web/figma.config.json`
- **Include:** `src/**/*.figma.ts`
- **Path alias:** `@/*` → `src/*` (как в `tsconfig.json`)

---

## Команды

Из `apps/web`:

```bash
npx figma connect parse
npx figma connect publish     # после Org plan + publish library
npx figma connect unpublish
```

Скрипты в `package.json`:

```bash
pnpm figma:connect:parse
pnpm figma:connect:publish
pnpm figma:connect:unpublish
```

---

## Добавление нового mapping

1. Опубликовать компонент в Figma library (Ink Studio)
2. Взять `node-id` из URL (`2-72` → `2:72` в комментарии `// url=...`)
3. Вызвать `get_context_for_code_connect` (MCP) для property definitions
4. Создать `src/figma/<name>.figma.ts` по [Figma template docs](https://developers.figma.com/docs/code-connect/template-files/)
5. `npx figma connect parse` → `publish`
6. Обновить таблицу в этом файле и [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Initial 6 mappings на старый Design System |
| 2026-08-04 | Tree item mapping (`9:239`) |
| 2026-08-13 | URL/node-id переведены на Ink Studio; Accent ← бывший Secondary |
