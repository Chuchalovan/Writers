# Схема базы данных

> **Источник реализации:** `apps/web/prisma/schema.prisma`  
> **Норматив PRD:** [PRD v1.0 §9](../prd/archive/PRD-v1.0.md)  
> **Scope:** [MVP-SCOPE-MATRIX.md](../roadmap/MVP-SCOPE-MATRIX.md), [DEC-012](../roadmap/DECISION-LOG.md#dec-012-writinggoal--dailystat)  
> **Обновлено:** 4 августа 2026

---

## ER-диаграмма (текущая реализация)

```
┌──────────┐       ┌──────────┐       ┌────────────────┐       ┌──────────────┐
│   User   │──1:N──│ Project  │──1:N──│ ManuscriptNode │──0:1──│ SceneContent │
└──────────┘       └──────────┘       │ (part/chapter/ │       └──────────────┘
     │                   │             │  scene)        │
     │                   ├──1:N── Character
     │                   ├──1:N── WorldArticle
     │                   ├──1:N── DailyStat      ← P2 (DEC-012)
     │                   └──1:N── WritingGoal    ← P2 (DEC-012)
     ├──1:N── UserApiKey                         ← P1 (Sprint 5)
     └──1:N── DailyStat / WritingGoal
```

**Не в Prisma (PRD §9, post-MVP или Sprint 4+):**  
`ProjectMember`, `SceneMetadata`, `Storyline`, `StoryBeat`, `TimelineEvent`, `EntityLink`, `Note`, `AIConversation`, `AIMessage`, `Version`.

---

## PRD §9 ↔ Prisma sync matrix

| PRD §9 | Prisma model | Sprint / Release | Статус | Заметки |
|--------|--------------|------------------|--------|---------|
| 9.1 User | `User` | 1 | 🟡 Partial | Better Auth: `name`, `image`, `emailVerified`; нет `timezone`, `deleted_at` |
| 9.2 Project | `Project` | 2 | 🟢 MVP | `subtitle`, `logline`, `synopsis`, `coverUrl`, `templateId`, `archivedAt` ✅ |
| 9.3 ProjectMember | — | Post-MVP | ⬜ | Архитектура PRD; UI collab не в MVP |
| 9.4 ManuscriptNode | `ManuscriptNode` | 2–3 | 🟢 MVP | `type`, `position`, `status`, `synopsis`, `deletedAt` ✅ |
| 9.5 SceneContent | `SceneContent` | 3 | 🟡 Partial | Нет `updated_by` (PRD §9.5) |
| 9.6 SceneMetadata | — | 4 | ⬜ | POV, location, goal/conflict/outcome — Sprint 4 / editor panel |
| 9.7 Character | `Character` | 4 | 🟡 Partial | Только `name`, `role`, `summary`, `imageUrl`; PRD поля — post-MVP или JSON |
| 9.8 WorldArticle | `WorldArticle` | 4 | 🟢 MVP | `type`, `contentJson`, `summary` ✅ |
| 9.9 Storyline | — | 4 (P1) | ⬜ | Plot board |
| 9.10 StoryBeat | — | 4 (P1) | ⬜ | Plot board |
| 9.11 TimelineEvent | — | 4 (P1) | ⬜ | Timeline screen |
| 9.12 EntityLink | — | 5+ | ⬜ | Generic links; FK для критичных связей в SceneMetadata |
| 9.13 Note | — | Post-MVP | ⬜ | Notes tab §23.6 |
| 9.14 AIConversation | — | 5 (P1) | ⬜ | AI panel |
| 9.15 Version | — | 3+ | ⬜ | Optimistic concurrency via `SceneContent.version` only |
| — | `UserApiKey` | 5 (P1) | 🟢 Schema | BYOK; не в PRD §9 явно |
| — | `DailyStat` | P2 | 🟡 Schema | [DEC-012](../roadmap/DECISION-LOG.md#dec-012-writinggoal--dailystat) |
| — | `WritingGoal` | P2 | 🟡 Schema | [DEC-012](../roadmap/DECISION-LOG.md#dec-012-writinggoal--dailystat) |

**Правило при расхождении:** для MVP реализация следует **Prisma + MVP-SCOPE-MATRIX**; PRD §9 — целевая полная модель.

---

## Модели (реализация)

### User

Better Auth managed. Таблица `user`.

| Поле | Тип | PRD §9.1 | Описание |
|------|-----|----------|----------|
| id | String | id | PK |
| email | String | email | Unique |
| name | String | display_name | |
| image | String? | avatar_url | |
| emailVerified | Boolean | — | Better Auth |
| locale | String | locale | default `ru` |
| createdAt | DateTime | created_at | |
| updatedAt | DateTime | updated_at | |

### Project

| Поле | Тип | PRD §9.2 | Описание |
|------|-----|----------|----------|
| id | String (cuid) | id | PK |
| userId | String | owner_id | FK → User |
| title | String | title | |
| subtitle | String? | subtitle | |
| description | String? | — | Legacy; synopsis предпочтительнее |
| logline | String? | logline | |
| synopsis | String? | synopsis | |
| genre | String? | genre | |
| coverUrl | String? | cover_url | |
| templateId | String? | template_id | P1 templates |
| targetWordCount | Int? | target_word_count | |
| totalWordCount | Int | — | Denormalized cache |
| status | ProjectStatus | status | draft / in_progress / completed / archived |
| archivedAt | DateTime? | archived_at | |
| createdAt / updatedAt | DateTime | created_at / updated_at | |

**Индексы:** `userId`, `(userId, status)`

### ManuscriptNode

Заменяет раннюю модель `Chapter`. Иерархия: part → chapter → scene.

| Поле | Тип | PRD §9.4 | Описание |
|------|-----|----------|----------|
| id | String (cuid) | id | PK |
| projectId | String | project_id | FK → Project |
| parentId | String? | parent_id | Self-ref; null = root |
| type | ManuscriptNodeType | type | part / chapter / scene |
| title | String | title | |
| position | Int | position | Sibling order |
| status | SceneStatus? | status | Только для scene |
| synopsis | String? | synopsis | |
| wordCount | Int | word_count | Cached |
| deletedAt | DateTime? | deleted_at | Soft delete |
| createdAt / updatedAt | DateTime | created_at / updated_at | |

**Индексы:** `projectId`, `(projectId, parentId, position)`, `(projectId, type)`

### SceneContent

Отдельно от дерева — частые автосохранения не блокируют reorder.

| Поле | Тип | PRD §9.5 | Описание |
|------|-----|----------|----------|
| sceneId | String | scene_id | PK, FK → ManuscriptNode (scene) |
| contentJson | Json | content_json | TipTap document |
| plainText | String? | plain_text | Search + AI |
| version | Int | — | Optimistic concurrency |
| updatedAt | DateTime | updated_at | |

**Gap:** `updated_by` — добавить при Sprint 3 (collab audit).

### Character

| Поле | Тип | PRD §9.7 | Описание |
|------|-----|----------|----------|
| id, projectId | String | id, project_id | |
| name | String | name | |
| role | String? | role | |
| summary | String? | summary | |
| imageUrl | String? | image_url | |
| deletedAt | DateTime? | — | Soft delete |

**Gap:** aliases, appearance, biography, arc fields — Sprint 4+ или JSON column.

### WorldArticle

| Поле | Тип | PRD §9.8 | Описание |
|------|-----|----------|----------|
| id, projectId | String | id, project_id | |
| type | WorldArticleType | type | location, organization, … |
| title | String | title | |
| summary | String? | summary | |
| contentJson | Json | content_json | |
| imageUrl | String? | image_url | |
| deletedAt | DateTime? | — | Soft delete |

### DailyStat (P2 — schema only)

| Поле | Тип | Описание |
|------|-----|----------|
| userId, projectId? | String | FK |
| date | Date | UTC date |
| wordsWritten | Int | Daily delta |

**Unique:** `(userId, projectId, date)`  
См. [DEC-012](../roadmap/DECISION-LOG.md#dec-012-writinggoal--dailystat).

### UserApiKey (P1 Sprint 5)

| Поле | Тип | Описание |
|------|-----|----------|
| userId | String | FK → User |
| provider | String | openai / anthropic / custom |
| encryptedKey | String | AES-256-GCM |
| keyHint | String | Last 4 chars for UI |
| model | String? | Preferred model |

**Unique:** `(userId, provider)`

### WritingGoal (P2 — schema only)

| Поле | Тип | Описание |
|------|-----|----------|
| type | GoalType | daily / project |
| targetWords | Int | |

---

## Enums

```prisma
ProjectStatus: draft | in_progress | completed | archived
ManuscriptNodeType: part | chapter | scene
SceneStatus: idea | planned | draft | revision | ready
WorldArticleType: location | organization | object | rule | culture | event | article
GoalType: daily | project
```

---

## Бизнес-правила

1. **Word count:** пересчитывается при сохранении сцены из `SceneContent.plainText` → `ManuscriptNode.wordCount`.
2. **Project.totalWordCount:** сумма `wordCount` всех scene-узлов проекта (или всех leaf nodes — уточнить при Sprint 3).
3. **DailyStat.wordsWritten:** инкремент на delta при сохранении — **P2**, не блокирует Alpha.
4. **Cascade delete:** User → Projects → ManuscriptNodes → SceneContent; soft delete предпочтительнее hard delete для nodes.
5. **position:** gaps допустимы после delete; reorder — отдельная операция (DnD Sprint 2).
6. **Scene invariant:** SceneContent существует только для `ManuscriptNode.type = scene`.
7. **Concurrency:** `SceneContent.version` инкрементируется при успешном save; conflict UI — Sprint 3.

---

## Planned migrations (backlog)

| Migration | Sprint | PRD |
|-----------|--------|-----|
| `SceneMetadata` table | 4 | §9.6, §23.6 |
| `Storyline`, `StoryBeat` | 4 | §9.9–9.10, plot board |
| `TimelineEvent` | 4 | §9.11 |
| `SceneContent.updatedBy` | 3 | §9.5 |
| `EntityLink` | 5+ | §9.12 |
| `Note` | Post-MVP | §9.13 |
| AI tables | 5 | §9.14 |
| `Version` / revision history | 3+ | §9.15, §24.3 |

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-08-04 | Sync with Prisma: ManuscriptNode, SceneContent, Character, WorldArticle; PRD §9 matrix; removed stale Chapter draft |
