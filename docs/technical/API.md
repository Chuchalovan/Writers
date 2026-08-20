# API

> **OpenAPI:** [openapi.yaml](./openapi.yaml) (целевой HTTP-контракт)  
> **Норматив контрактов:** [ТЗ §6.3–6.4](../tz/TZ.md#63-api-общие-правила), политики [§8](../tz/TZ.md#8-политики-и-инварианты)  
> **Факт кода:** `apps/web/src/actions/`, `apps/web/src/app/api/`  
> **Схемы:** `packages/shared/src/schemas/index.ts`  
> **Обновлено:** 13 августа 2026

Имена actions — логические. Реализация живёт в `lib/` и реэкспортируется из `actions/`.  
`Chapter` / `createChapter` **не норматив**. Норматив дерева = `ManuscriptNode`.

При расхождении **цель** = ТЗ; ниже — что уже есть и чего не хватает.

---

## Общие правила (норматив)

- CRUD-мутации: **Server Actions** + Zod из `@manuscript/shared`.
- Стриминг AI и скачивание файлов: **REST** `/api/v1/…`.
- Auth: session cookie (Better Auth). Нет сессии → `401 UNAUTHORIZED`.
- Авторизация: ресурс через `project.userId === session.userId`. Иначе `403 FORBIDDEN`.
- Валидация на границе. Ошибка → `400 VALIDATION_ERROR`.
- Id: `cuid`. Повторный delete уже soft-deleted узла — успех, не 500.
- Сообщения ошибок — `ru`/`en`, без стека и SQL.

Формат (REST и, где возможно, Actions):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{ "path": ["title"], "message": "Required" }]
  }
}
```

| Code | HTTP | Когда |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Нет сессии |
| `FORBIDDEN` | 403 | Чужой проект |
| `NOT_FOUND` | 404 | Нет сущности **в скоупе пользователя** |
| `VALIDATION_ERROR` | 400 | Zod / бизнес-правило |
| `CONFLICT` | 409 | `SceneContent.version` ≠ `baseVersion` |
| `EMAIL_NOT_VERIFIED` | 403 | AI / удаление аккаунта / смена email без confirm ([ТЗ §8.1](../tz/TZ.md#81-аутентификация-и-аккаунт)) |
| `EXPORT_FAILED` | 500 | Файл не собран; данные проекта целы |
| `AI_KEY_MISSING` | 400 | Нет platform-ключа / квота (P1) |
| `AI_PROVIDER_ERROR` | 502 | Внешний провайдер |
| `PAYLOAD_TOO_LARGE` | 413 | Импорт / файл сверх лимита |
| `RATE_LIMITED` | 429 | Логин / AI-квота |

**Факт:** actions бросают `Error` или возвращают `{ error: "invalid_title" }`. Единый `code` не внедрён.

---

## Матрица факт / цель

| Контракт | Gate | Факт | Файл |
|----------|------|------|------|
| Projects list/create/update/archive/delete | P0 | 🟡 нет duplicate, overview, includeArchived, query | `actions/projects.ts` |
| Manuscript nodes CRUD + soft delete | P0 | 🟡 нет reorder/move/restore/setStatus как отдельные actions; delete = soft | `actions/manuscript.ts` |
| `saveSceneContent` + `baseVersion` | P0 | ⬜ | Zod `UpdateSceneContentSchema` **без** `baseVersion` |
| Characters, relationships, world, scene links | P0 | ⬜ | — |
| `searchByTitle` | P0 | ⬜ | — |
| Export DOCX/TXT | P0 | ⬜ | — |
| Auth: login/register | P0 | 🟢 Better Auth | `app/api/auth/[...all]/route.ts` |
| Confirm / reset / delete account | P0→Beta | ⬜ | — |
| Plot / timeline / notes / FTS | P1 | ⬜ | — |
| Import | P1 | ⬜ | — |
| `POST /api/v1/ai/chat`, `/edit` | P1 | ⬜ | — |
| Stats / writing goals | P2 | не делать | старые черновики в этом файле сняты |
| BYOK `saveApiKey` | P2 | не блокер Beta | схема `SaveApiKeySchema` жива как P2 |

Устаревшие REST `POST /api/v1/ai/grammar|continue|ideas` — **не реализовывать**. Замена: chat + edit с явным контекстом.

---

## Server Actions — факт

Вызов из React. Сессия: `requireSession()`. Владелец: `assertProjectOwner` / `getNodeWithAuth`.

### Projects (`src/actions/projects.ts`)

| Action | Вход | Выход | Заметки |
|--------|------|-------|---------|
| `getProjectsAction` | — | `Project[]` (+ `_count.nodes`) | только `archivedAt: null`, `updatedAt desc` |
| `getProjectAction` | `projectId` | проект или throw | не overview (continue scene / next steps) |
| `createProjectAction` | `FormData.title` | `{ project }` \| `{ error: "invalid_title" }` | title 1…200 |
| `updateProjectAction` | `{ id, title?, … }` | `Project` | Zod `UpdateProjectSchema` |
| `archiveProjectAction` | `projectId` | void | `archivedAt` + status `archived` |
| `deleteProjectAction` | `projectId` | void | hard delete cascade |

**Цель (нет в коде):** `duplicateProject`, `listProjects({ query, includeArchived })`, `getProjectOverview`.

### Manuscript (`src/actions/manuscript.ts`)

| Action | Вход | Заметки |
|--------|------|---------|
| `getNodesAction` | `projectId` | дерево, `deletedAt: null` |
| `createNodeAction` | `{ projectId, type, parentId?, title? }` | default title из i18n |
| `createNodeFormAction` | `FormData` | то же для форм |
| `updateNodeAction` | `{ id, title?, status?, synopsis?, position? }` | нет смены `parentId` в Zod |
| `deleteNodeAction` | `nodeId`, `projectId` | soft `deletedAt`; дети **не** каскадятся — gap vs ТЗ |
| `startWritingAction` | `projectId` | создаёт scene (onboarding) |
| `startPlanningAction` | `projectId` | создаёт part |

**Цель (нет в коде):** `reorderNodes`, `moveNode`, `setSceneStatus`, `restoreNode`, каскадный soft-delete детей, `saveSceneContent`.

### Auth (факт REST, не Action)

| Метод | Назначение |
|-------|------------|
| `POST /api/auth/sign-up/email` | регистрация (Better Auth) |
| `POST /api/auth/sign-in/email` | вход |
| `POST /api/auth/sign-out` | выход |
| `GET /api/auth/get-session` | сессия |

Точные пути — по версии Better Auth; клиент: `src/lib/auth/client.ts`.

---

## Server Actions — цель (сводка ТЗ §6.4)

Полные правила — в ТЗ. Здесь — чеклист реализации.

### Рукопись

| Action | Вход | Правила |
|--------|------|---------|
| `createNode` | `{ projectId, type, parentId?, title? }` | part⊃chapter⊃scene; сцена без родителя допустима |
| `renameNode` | `{ id, title }` | 1…200 |
| `reorderNodes` | `{ projectId, parentId, orderedIds }` | все — дети одного родителя |
| `moveNode` | `{ id, newParentId, position }` | нельзя сделать предка потомком себя |
| `setSceneStatus` | `{ id, status }` | только `type=scene`; не блокирует редактирование |
| `softDeleteNode` | `{ id }` | дети вместе; подтверждение в UI |
| `restoreNode` | `{ id }` | корзина проекта |
| `saveSceneContent` | `{ sceneId, contentJson, plainText, baseVersion }` | [§8.3](../tz/TZ.md#83-редактор-и-сохранность-текста) |

### Знания (P0)

| Action | Правила |
|--------|---------|
| `createCharacter` / update / delete | обязательно `name` 1…200 |
| `upsertCharacterRelationship` | один проект; не сам с собой; каноническая пара + type уникальны |
| `createWorldArticle` | обязательно `title`; локация = `type: location` |
| `linkCharacterToScene` / `unlink` | не каскадит удаление героя на текст |
| `searchByTitle` | скоуп = текущий проект |

P1: plot method, beats, timeline, notes, FTS — те же правила владения.

---

## REST — цель

Базовый URL: `/api/v1/`. Сейчас **нет** ни одного v1 route.

### `POST /api/v1/ai/chat`

Чат с выбранным контекстом. P1. Timeout 30 с. Feature-flag выключаемый.

**Request:**

```json
{
  "projectId": "cuid",
  "message": "string",
  "level": 0,
  "contextEntityIds": [],
  "conversationId": "cuid | null"
}
```

`level`: 0–3 в MVP (4–5 = P2). Сервер **пересобирает** текст сущностей из БД; массиву id с клиента нельзя доверять как единственному содержимому.

**Response:** SSE

```
data: {"type":"chunk","content":"…"}
data: {"type":"done"}
data: {"type":"error","code":"AI_PROVIDER_ERROR"}
```

Без «Принять» в UI текст сцены не меняется ([ТЗ §8.5](../tz/TZ.md#85-ai)).

### `POST /api/v1/ai/edit`

Правка выделения. То же тело + `selectionPlainText` / диапазон. Ответ SSE, затем diff в UI (принять / фрагмент / отклонить).

### `GET /api/v1/export` (или POST + job id)

Alpha: DOCX или TXT; область = проект / часть / набор scene id. Пустой набор → валидация, файла нет.  
Ошибка генерации → `EXPORT_FAILED`, данные целы.  
ZIP `manuscript-export` v1 — P1, контракт в [ТЗ §8.4](../tz/TZ.md#84-экспорт-и-импорт).

Тяжёлый файл: синхронно до порога (p75 ≤ 10 с на ≤200 сцен); иначе job (BullMQ) — P1 по необходимости.

---

## Zod (факт)

В `packages/shared`:

| Schema | Статус vs ТЗ |
|--------|----------------|
| `CreateProjectSchema` / `UpdateProjectSchema` | 🟢 |
| `CreateManuscriptNodeSchema` / `UpdateManuscriptNodeSchema` | 🟡 нет `parentId` на update |
| `UpdateSceneContentSchema` | 🔴 нет `baseVersion`; `contentJson` optional |
| `CreateChapterSchema` / `UpdateChapterSchema` | deprecated, не использовать |
| `SaveApiKeySchema` | P2 |
| `AIGrammarSchema`, `AIContinueSchema`, `AIIdeasSchema`, `AIChatSchema` | 🔴 старый контракт; заменить на `{ projectId, level, contextEntityIds, message }` |

---

## AI provider (пакет)

`packages/ai`: интерфейс `complete` / `stream`. Фабрики `createOpenAIProvider` / `createCustomProvider` бросают `Not implemented`.

Промпты `grammarPrompt` / `continuePrompt` / `ideasPrompt` — наследие; целевой чат собирает контекст на сервере по level, не «исправь этот blob».

---

## Changelog

| Дата | Изменение |
|------|-----------|
| — | Черновик: Chapter CRUD, DailyStat, AI grammar/continue/ideas, BYOK settings |
| 2026-08-13 | Норматив ТЗ §6.3–6.4; факт actions; AI chat/edit; Chapter и stats сняты с MVP |
| 2026-08-13 | Добавлен [openapi.yaml](./openapi.yaml) OpenAPI 3.1 |
