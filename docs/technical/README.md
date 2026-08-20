# Technical — инженерные справочники

Живые снимки реализации. Норматив «как должно быть» — [ТЗ](../tz/TZ.md). Если код отстаёт, в файле помечается **факт / gap**, а не отменяется ТЗ.

## Документы раздела

| Файл | Что внутри | Норматив |
|------|------------|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Слои, пакеты, маршруты, интеграции | ТЗ §6.1, §7 |
| [API.md](./API.md) | Server Actions и REST: факт + целевые контракты | ТЗ §6.3–6.4, §8 |
| [openapi.yaml](./openapi.yaml) | OpenAPI 3.1 — целевой HTTP-контракт | ТЗ §6.3–6.4 |
| [DATABASE.md](./DATABASE.md) | Текущая схема Drizzle vs целевая модель | ТЗ §6.5 |
| [CI-CD.md](./CI-CD.md) | GitHub Actions, env, секреты, ops gap | ТЗ §7.1, §7.4, §9.4 |
| [design/](./design/) | Figma Ink Studio, токены, Code Connect | ТЗ §5, DEC-011 |

## Связанные разделы

- [ТЗ](../tz/TZ.md) — постановка  
- [PRD](../prd/PRD.md) — что и зачем  
- [Use Cases](../user-stories/use-cases.md) — сценарии  
- [MVP Scope Matrix](../roadmap/MVP-SCOPE-MATRIX.md) — P0/P1/P2  
- [Decision Log](../roadmap/DECISION-LOG.md)
