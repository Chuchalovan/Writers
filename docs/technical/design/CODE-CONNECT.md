# Code Connect

> Figma file: [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System)  
> Handoff: [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)

Связь Figma-компонентов UI Kit с кодом в `apps/web`. Шаблоны — parserless `.figma.ts` (формат `figma.code`).

---

## Требования Figma

| Требование | Статус |
|------------|--------|
| Organization или Enterprise plan | ❌ сейчас Starter |
| Dev или Full seat | проверить у admin |
| Компоненты **опубликованы** в team library | ⬜ TODO |

Без Org/Enterprise `figma connect publish` и MCP Code Connect API недоступны. Локальные шаблоны уже готовы — останется publish после апгрейда.

---

## Мappings

| Figma component | node-id | Code | Template |
|-----------------|---------|------|----------|
| `Button/Primary` | `8:6` | `@/components/ui/button` | `src/figma/button-primary.figma.ts` |
| `Button/Secondary` | `8:8` | `@/components/ui/button` `variant="secondary"` | `src/figma/button-secondary.figma.ts` |
| `Button/Ghost` | `8:10` | `@/components/ui/button` `variant="ghost"` | `src/figma/button-ghost.figma.ts` |
| `Navigation Item/Active` | `8:13` | Sidebar `Link` (active) | `src/figma/navigation-item.figma.ts` |
| `Navigation Item/Default` | `8:16` | Sidebar `Link` (default) | `src/figma/navigation-item-default.figma.ts` |
| `Card/Scene` | `8:33` | `ProjectCard` pattern | `src/figma/project-card.figma.ts` |
| Tree item (Scene Editor) | `9:239` | `manuscript-tree.tsx` `TreeNode` | `src/figma/tree-item.figma.ts` |

### TODO (следующая итерация)

| Figma | Code target |
|-------|-------------|
| `Chip/*` | Badge component (ещё нет в коде) |
| `Panel/AI Review` | AI panel (Sprint 5) |
| Project card in `10.02` | `9:32` → `project-card.tsx` (screen instance) |
| `Card` (shadcn) | `@/components/ui/card` |

---

## Конфигурация

- **Config:** `apps/web/figma.config.json`
- **Include:** `src/**/*.figma.ts`
- **Path alias:** `@/*` → `src/*` (как в `tsconfig.json`)

---

## Команды

Из `apps/web`:

```bash
# Проверить шаблоны локально
npx figma connect parse

# Опубликовать в Figma (после Org plan + publish library)
npx figma connect publish

# Снять mappings
npx figma connect unpublish
```

Скрипты в `package.json`:

```bash
pnpm figma:connect:parse
pnpm figma:connect:publish   # после Org plan
pnpm figma:connect:unpublish
```

---

## Добавление нового mapping

1. Опубликовать компонент в Figma library
2. Взять `node-id` из URL (`8-6` → `8:6` в комментарии `// url=...`)
3. Вызвать `get_context_for_code_connect` (MCP) для property definitions
4. Создать `src/figma/<name>.figma.ts` по [Figma template docs](https://developers.figma.com/docs/code-connect/template-files/)
5. `npx figma connect parse` → `publish`
6. Обновить таблицу в этом файле и [DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md)

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Initial 6 mappings; `@figma/code-connect` installed; `figma connect parse` OK |
| 2026-08-04 | Added tree item mapping (`9:239` → `tree-item.figma.ts`) |
