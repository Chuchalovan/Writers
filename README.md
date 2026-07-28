# Manuscript

Веб-приложение для писателей: редактор, структура произведения, статистика и AI-помощник.

## Возможности (MVP)

- **Редактор** — rich-text редактор для написания текста
- **Структура** — проекты и главы с иерархией
- **Статистика** — подсчёт слов, прогресс, цели
- **AI-помощник** — правка, дописывание, идеи, чат по проекту (BYOK)
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
| AI | Абстракция провайдеров, BYOK |
| Monorepo | pnpm workspaces |

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

- [PRD — требования к продукту](./docs/PRD.md)
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
