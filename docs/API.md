# API

## Обзор

Manuscript использует **Server Actions** для CRUD-операций и **API Routes** для стриминга AI-ответов.

Базовый URL: `/api/v1/`

Аутентификация: session cookie (Better Auth).

---

## Server Actions

Server Actions вызываются напрямую из React-компонентов. Ниже — контракты (не REST endpoints).

### Projects

| Action | Вход | Выход | Описание |
|--------|------|-------|----------|
| `createProject` | `{ title, description?, genre? }` | `Project` | Создать проект |
| `updateProject` | `{ id, title?, description?, genre?, targetWordCount?, status? }` | `Project` | Обновить проект |
| `deleteProject` | `{ id }` | `void` | Удалить проект |
| `getProjects` | — | `Project[]` | Список проектов пользователя |
| `getProject` | `{ id }` | `Project & { chapters }` | Проект с главами |

### Chapters

| Action | Вход | Выход | Описание |
|--------|------|-------|----------|
| `createChapter` | `{ projectId, title? }` | `Chapter` | Создать главу |
| `updateChapter` | `{ id, title?, content?, sortOrder? }` | `Chapter` | Обновить главу |
| `deleteChapter` | `{ id }` | `void` | Удалить главу |
| `reorderChapters` | `{ projectId, chapterIds: string[] }` | `Chapter[]` | Изменить порядок |

### Stats

| Action | Вход | Выход | Описание |
|--------|------|-------|----------|
| `getDailyStats` | `{ projectId?, from, to }` | `DailyStat[]` | Статистика за период |
| `getProjectStats` | `{ projectId }` | `{ totalWords, chapterBreakdown, dailyStats }` | Сводка по проекту |
| `setWritingGoal` | `{ projectId?, type, targetWords }` | `WritingGoal` | Установить цель |

### Settings

| Action | Вход | Выход | Описание |
|--------|------|-------|----------|
| `updateProfile` | `{ name?, locale? }` | `User` | Обновить профиль |
| `saveApiKey` | `{ provider, apiKey, model? }` | `{ keyHint }` | Сохранить API-ключ |
| `deleteApiKey` | `{ provider }` | `void` | Удалить API-ключ |
| `getApiKeyStatus` | — | `{ provider, keyHint, model }[]` | Статус ключей (без самих ключей) |

---

## REST API Routes

### POST `/api/v1/ai/grammar`

Правка текста (грамматика, стиль).

**Request:**
```json
{
  "text": "string",
  "projectId": "string (optional, for context)",
  "locale": "ru | en"
}
```

**Response:** Server-Sent Events stream
```
data: {"type":"chunk","content":"Исправленный текст..."}
data: {"type":"done"}
```

---

### POST `/api/v1/ai/continue`

Продолжение текста.

**Request:**
```json
{
  "text": "string",
  "projectId": "string (optional)",
  "maxTokens": 500
}
```

**Response:** SSE stream

---

### POST `/api/v1/ai/ideas`

Генерация идей.

**Request:**
```json
{
  "type": "plot | character | conflict | general",
  "context": "string (optional)",
  "projectId": "string (optional)"
}
```

**Response:**
```json
{
  "ideas": [
    { "title": "string", "description": "string" }
  ]
}
```

---

### POST `/api/v1/ai/chat`

Чат-ассистент с контекстом проекта.

**Request:**
```json
{
  "message": "string",
  "projectId": "string",
  "history": [
    { "role": "user | assistant", "content": "string" }
  ]
}
```

**Response:** SSE stream

---

## Коды ошибок

| Code | HTTP | Описание |
|------|------|----------|
| `UNAUTHORIZED` | 401 | Не авторизован |
| `FORBIDDEN` | 403 | Нет доступа к ресурсу |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `VALIDATION_ERROR` | 400 | Ошибка валидации (Zod) |
| `AI_KEY_MISSING` | 400 | API-ключ не настроен |
| `AI_PROVIDER_ERROR` | 502 | Ошибка внешнего AI API |
| `RATE_LIMITED` | 429 | Превышен лимит запросов |

**Формат ошибки:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{ "path": ["title"], "message": "Required" }]
  }
}
```

---

## Валидация

Все входные данные валидируются через **Zod** schemas в `packages/shared`:

```typescript
// Пример
const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  genre: z.string().max(100).optional(),
});
```

---

## AI Provider Interface

```typescript
// packages/ai/src/types.ts

interface AIProvider {
  name: string;
  complete(params: CompleteParams): Promise<string>;
  stream(params: CompleteParams): AsyncIterable<string>;
}

interface CompleteParams {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}
```

Реализации:
- `OpenAIProvider` — OpenAI API (default)
- `CustomProvider` — любой OpenAI-compatible endpoint
