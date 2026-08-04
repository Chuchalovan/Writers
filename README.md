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
| ORM | Prisma |
| i18n | next-intl |
| Auth | Better Auth |
| AI | Контекстный ассистент с выбором scope |
| Monorepo | pnpm workspaces |

## Дизайн

Визуальный источник истины: [Manuscript Design System](https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System) (Figma)

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

- **[PRD — Manuscript](./docs/PRD%20-%20Manuscript.md)** — единый продуктовый документ (v1.1)
- [PRD v1.0 — исходная спецификация](./docs/Манускрипт%20—%20Product%20Requirements%20Document%20(PRD)%20v1.0.md)
- [PRD — указатель](./docs/PRD.md)
- [MVP Scope Matrix](./docs/MVP-SCOPE-MATRIX.md)
- [Decision Log](./docs/DECISION-LOG.md)
- [Design Handoff](./docs/DESIGN-HANDOFF.md)
- [Архитектура](./docs/ARCHITECTURE.md)
- [Схема базы данных](./docs/DATABASE.md)
- [API](./docs/API.md)
- [Roadmap](./docs/ROADMAP.md)
- [CI/CD](./docs/CI-CD.md)

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

# Запуск dev-сервера
npx pnpm@9.15.0 dev
```

Приложение будет доступно на `http://localhost:3000/ru` или `/en`.

> **Без Docker:** PostgreSQL ставится нативно на Windows. `docker-compose.yml` в репозитории опционален — для машин с Docker.

## Лицензия

Proprietary — все права защищены.
