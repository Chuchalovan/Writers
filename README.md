# Манускрипт (Manuscript)

Рабочая среда для авторов художественной прозы: планирование книги, персонажи, мир, сюжет, части/главы/сцены, редактор и контекстный AI-помощник.

## Возможности (целевой MVP)

- **Рукопись** — части, главы и сцены с иерархией и статусами
- **Редактор** — rich-text с автосохранением, фокусом и историей версий
- **Контекст** — персонажи, локации, метаданные сцены рядом с текстом
- **Сюжет и мир** — доска, шаблоны, таймлайн, заметки
- **AI-помощник** — анализ и редактура с выбранным контекстом (автор остаётся главным)
- **Импорт / экспорт** — DOCX, TXT, Markdown, PDF
- **i18n** — русский и английский интерфейс
- **Авторизация** — email + пароль

## Стек

| Слой | Технология |
|------|------------|
| Frontend / Backend | Next.js 15 (App Router), TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| Редактор | TipTap |
| База данных | PostgreSQL |
| ORM | Drizzle |
| i18n | next-intl |
| Auth | Better Auth |
| AI | Контекстный ассистент с выбором scope |
| Monorepo | pnpm workspaces |

## Дизайн

Визуальный источник истины: [Manuscript — Ink Studio](https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio) (Figma). Handoff: [docs/technical/design/](./docs/technical/design/).

## Структура репозитория

```
manuscript/
├── apps/
│   └── web/              # Next.js приложение
├── packages/
│   ├── shared/           # Общие типы и утилиты
│   └── ai/               # AI-провайдеры и абстракции
├── docs/                 # Документация проекта
├── scripts/              # Скрипты настройки (setup-db.ps1)
└── package.json          # Root workspace
```

## Документация

Полный индекс: **[docs/README.md](./docs/README.md)**

| Раздел | Ссылка |
|--------|--------|
| **PRD** | [PRD v2.0](./docs/prd/PRD.md) · [указатель](./docs/prd/INDEX.md) · [v1.1 archive](./docs/prd/archive/PRD-v1.1-consolidated.md) · [v1.0 archive](./docs/prd/archive/PRD-v1.0.md) |
| **BRD** | [BRD v1.0](./docs/brd/BRD.md) · [методы сюжета](./docs/brd/plot-methods.md) |
| **ТЗ** | [Техническое задание](./docs/tz/TZ.md) |
| **Roadmap** | [Roadmap](./docs/roadmap/ROADMAP.md) · [Scope Matrix](./docs/roadmap/MVP-SCOPE-MATRIX.md) · [Decision Log](./docs/roadmap/DECISION-LOG.md) |
| **User Stories** | [Эпики и истории](./docs/user-stories/) |
| **Technical** | [Архитектура](./docs/technical/ARCHITECTURE.md) · [БД](./docs/technical/DATABASE.md) · [API](./docs/technical/API.md) · [CI/CD](./docs/technical/CI-CD.md) · [Design](./docs/technical/design/) |

## Быстрый старт

### 1. PostgreSQL

Установите PostgreSQL 17 для Windows: [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)

При установке запомните **пароль пользователя `postgres`**.

Создайте базу для проекта:

```powershell
.\scripts\setup-db.ps1 -PostgresPassword "ваш_пароль_postgres"
```

### 2. Приложение

```bash
# Установка зависимостей
npx pnpm@9.15.0 install

# Переменные окружения
# Файл apps/web/.env — скопируйте из .env.example и при необходимости поправьте DATABASE_URL

# Миграции БД
npx pnpm@9.15.0 db:migrate
# Если БД уже создавалась Prisma: один раз `npx pnpm@9.15.0 db:push`
# (схема совпадает, повторный CREATE не нужен) или пересоздайте базу.

# Запуск dev-сервера
npx pnpm@9.15.0 dev
```

Приложение будет доступно на `http://localhost:3000/ru` или `/en`.

> **Без Docker:** PostgreSQL ставится нативно на Windows. `docker-compose.yml` в репозитории опционален — для машин с Docker.

## Лицензия

Proprietary — все права защищены.
