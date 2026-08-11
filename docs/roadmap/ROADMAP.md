# Roadmap

> **PRD:** [PRD v2.0](../prd/PRD.md)  
> **Scope (P0/P1/P2 ↔ sprint ↔ release):** [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md)  
> **Open decisions:** [DECISION-LOG.md](./DECISION-LOG.md)

## Phase 0 — Подготовка ✅

- [x] PRD v1.0 / v2.0 и структура документации
- [x] Структура monorepo
- [x] Prisma schema (целевая модель v1.0)
- [x] CI/CD pipeline (GitHub Actions)
- [x] PostgreSQL — нативная установка Windows (`scripts/setup-db.ps1`)
- [x] Landing page (черновик, выравнивание под PRD v1.0)

---

## Phase 1 — Alpha (Этап 1 PRD)

### Sprint 1: Foundation ✅
- [x] Next.js 15 + Tailwind + shadcn/ui
- [x] PostgreSQL + Prisma
- [x] Better Auth (email/password)
- [x] i18n (next-intl, ru/en)
- [x] Базовый layout (sidebar, header)
- [x] Landing page

### Sprint 2: Projects & Manuscript structure
- [x] CRUD проектов (создание только по названию)
- [x] ManuscriptNode: части, главы, сцены (создание, удаление)
- [x] Навигатор рукописи (дерево, статусы)
- [ ] Drag-and-drop порядка
- [x] Onboarding: «Начать писать» / «Спланировать сюжет» / «Добавить материалы»
- [ ] Обзор проекта (продолжить, прогресс, следующий шаг) — частично

### Sprint 3: Scene editor
- [ ] TipTap редактор с базовым форматированием
- [ ] Трёхколоночный layout: навигатор | редактор | контекст
- [ ] Автосохранение + локальный буфер при потере сети
- [ ] Метаданные сцены (цель, конфликт, POV, локация)
- [ ] Режим фокуса, подсчёт слов
- [ ] История версий сцен

### Sprint 4: Knowledge base
- [ ] Персонажи (карточки, связи со сценами)
- [ ] Мир и локации
- [ ] Сюжетная доска + шаблоны
- [ ] Таймлайн (список событий)
- [ ] Заметки и материалы
- [ ] Глобальный поиск по проекту

### Sprint 5: AI assistant
- [ ] AI-чат с выбором контекста
- [ ] Анализ и редактура выделенного текста
- [ ] Принять / принять фрагмент / отклонить
- [ ] Настройки AI и политика приватности
- [ ] Прозрачность использованного контекста

### Sprint 6: Import, export & polish
- [ ] Импорт DOCX / TXT / Markdown
- [ ] Экспорт DOCX / PDF / TXT / Markdown / ZIP
- [ ] Восстановление пароля, профиль
- [ ] Error/loading/empty states
- [ ] Responsive (desktop-first, read-only mobile)
- [ ] Usability-тесты

---

## Phase 2 — MVP Beta (Этап 2 PRD)

- [ ] Платёжная инфраструктура
- [ ] Расширенный поиск и индексация
- [ ] Улучшенная надёжность синхронизации
- [ ] Продуктовая аналитика (без текста рукописи)

---

## Phase 3 — Public launch (Этап 3 PRD)

- [ ] Onboarding v2
- [ ] Справка и документация
- [ ] Тарифы
- [ ] OAuth (Google/Apple)

> Сюжетные шаблоны — Sprint 4 / MVP Beta (P1), см. [MVP-SCOPE-MATRIX.md](./MVP-SCOPE-MATRIX.md).

---

## Phase 4 — Post-MVP

- [ ] Real-time collaboration
- [ ] Редакторский кабинет
- [ ] Расширенный таймлайн
- [ ] Кастомные поля
- [ ] API и интеграции
- [ ] Мобильное приложение

---

## Приоритеты

```
Alpha (Phase 1)  ──────────────►  Closed alpha
     │
Beta (Phase 2)   ──────────────►  MVP beta
     │
Launch (Phase 3) ──────────────►  Public v1.0
     │
Phase 4          ──────────────►  v2.0+
```
