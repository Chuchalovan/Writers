# Схема базы данных

## ER-диаграмма (MVP)

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │──1:N──│ Project  │──1:N──│ Chapter  │
└──────────┘       └──────────┘       └──────────┘
     │                                        │
     │                                        │
     │ 1:N                              triggers
     ▼                                        ▼
┌──────────┐                          ┌──────────┐
│UserApiKey│                          │DailyStat │
└──────────┘                          └──────────┘
     ▲
     │ scoped to User + Project (optional)
```

---

## Модели

### User

Пользователь системы. Управляется через Better Auth.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| email | String | Unique |
| name | String? | Отображаемое имя |
| locale | String | `ru` \| `en`, default `ru` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Project

Произведение / рукопись.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| userId | String | FK → User |
| title | String | Название |
| description | String? | Описание / синопсис |
| genre | String? | Жанр |
| targetWordCount | Int? | Целевое кол-во слов |
| totalWordCount | Int | Текущее кол-во слов (denormalized) |
| status | Enum | `draft` \| `in_progress` \| `completed` \| `archived` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Индексы:** `userId`, `(userId, status)`

### Chapter

Глава произведения.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| projectId | String | FK → Project |
| title | String | Название главы |
| content | JSON | TipTap document JSON |
| plainText | String? | Plain text (для поиска и AI) |
| wordCount | Int | Кол-во слов |
| sortOrder | Int | Порядок в проекте |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Индексы:** `projectId`, `(projectId, sortOrder)`

### DailyStat

Ежедневная статистика написания.

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| userId | String | FK → User |
| projectId | String? | FK → Project (null = общая статистика) |
| date | Date | Дата (UTC) |
| wordsWritten | Int | Слов написано за день |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Unique:** `(userId, projectId, date)`
**Индексы:** `(userId, date)`, `(projectId, date)`

### UserApiKey

Зашифрованный API-ключ пользователя (BYOK).

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| userId | String | FK → User |
| provider | String | `openai` \| `anthropic` \| `custom` |
| encryptedKey | String | AES-256-GCM encrypted |
| keyHint | String | Последние 4 символа для UI |
| model | String? | Предпочитаемая модель |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Unique:** `(userId, provider)`

### WritingGoal

Цель по написанию (опционально для MVP).

| Поле | Тип | Описание |
|------|-----|----------|
| id | String (cuid) | PK |
| userId | String | FK → User |
| projectId | String? | FK → Project |
| type | Enum | `daily` \| `project` |
| targetWords | Int | Целевое кол-во слов |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Prisma Schema (черновик)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProjectStatus {
  draft
  in_progress
  completed
  archived
}

enum GoalType {
  daily
  project
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  locale    String   @default("ru")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects   Project[]
  dailyStats DailyStat[]
  apiKeys    UserApiKey[]
  goals      WritingGoal[]
}

model Project {
  id              String        @id @default(cuid())
  userId          String
  title           String
  description     String?
  genre           String?
  targetWordCount Int?
  totalWordCount  Int           @default(0)
  status          ProjectStatus @default(draft)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  chapters Chapter[]
  stats    DailyStat[]
  goals    WritingGoal[]

  @@index([userId])
  @@index([userId, status])
}

model Chapter {
  id        String   @id @default(cuid())
  projectId String
  title     String
  content   Json     @default("{}")
  plainText String?
  wordCount Int      @default(0)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([projectId, sortOrder])
}

model DailyStat {
  id           String   @id @default(cuid())
  userId       String
  projectId    String?
  date         DateTime @db.Date
  wordsWritten Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId, date])
  @@index([userId, date])
  @@index([projectId, date])
}

model UserApiKey {
  id           String   @id @default(cuid())
  userId       String
  provider     String
  encryptedKey String
  keyHint      String
  model        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider])
}

model WritingGoal {
  id          String   @id @default(cuid())
  userId      String
  projectId   String?
  type        GoalType
  targetWords Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

---

## Бизнес-правила

1. **Word count:** пересчитывается при сохранении главы из `plainText`
2. **Project.totalWordCount:** сумма `Chapter.wordCount` всех глав проекта
3. **DailyStat.wordsWritten:** инкрементируется на delta при каждом сохранении
4. **Cascade delete:** удаление User → Projects → Chapters → Stats
5. **sortOrder:** при удалении главы порядок остальных не пересчитывается автоматически (gap допустим, reorder — отдельная операция)
