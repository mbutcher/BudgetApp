# ADR 003: Database Platform Agnosticism

## Status
Accepted

## Date
2026-03-09

## Supersedes
Partially supersedes the **Database** section of [ADR-001](./adr-001-tech-stack.md) (MariaDB as the sole database engine).

## Context

ADR-001 selected MariaDB 11 as the only supported database engine, explicitly ruling out SQLite as "not suitable for multi-user future or concurrent access." While that reasoning held at the time, two factors drove re-evaluation:

1. **Self-hosted deployment friction**: Requiring a separate MariaDB container raises the bar for new users on Unraid. Many hobbyist users do not want to manage an external database process for a single-household app.
2. **Existing infrastructure variety**: Some users already run PostgreSQL (or prefer it). Locking the app to MariaDB blocks adoption without technical justification — the ORM layer (Knex) abstracts the differences well.

BudgetApp's workload is moderate and single-server: at most a handful of concurrent users, tens of thousands of transactions. SQLite performs comfortably at this scale and supports concurrent *reads* (WAL mode). Write contention is not a concern for a household budget app.

## Decision

The database engine is now selected at runtime via the `DB_CLIENT` environment variable, which maps to the Knex `client` option:

| `DB_CLIENT` | Engine | Package |
|-------------|--------|---------|
| `sqlite3` | SQLite 3 (WAL mode) | `better-sqlite3` |
| `mysql2` | MariaDB 11 | `mysql2` |
| `pg` | PostgreSQL 16 | `pg` |

**SQLite 3 is the default** when `DB_CLIENT` is unset.

### Implementation Details

- `backend/src/database/dialectHelper.ts` — singleton that exposes dialect-specific helpers (e.g., `jsonArrayAgg`, `uuidFunction`, `booleanValue`) so repositories never contain raw SQL branching.
- All 13 raw SQL call sites were ported to use `dialectHelper` to eliminate dialect-specific SQL strings scattered through the codebase.
- 7 migrations were updated to remove MariaDB-only syntax (`ENUM` with `MODIFY`, `JSON_TABLE`, `JOIN`-`UPDATE`). Portable alternatives used throughout.
- JSON columns: all row mappers guard with `typeof value === 'string'` before calling `JSON.parse()` — SQLite returns raw strings; MariaDB/PostgreSQL return parsed objects.
- SQLite is opened in WAL journal mode for better concurrent read performance.

### Docker Compose Profiles

The development compose file (`docker/docker-compose.dev.yml`) uses Docker Compose profiles:

- **Default** (no profile): `backend` + `frontend` only — SQLite stored in a named volume.
- `--profile mariadb`: adds the `mariadb` service (port 3306); set `DB_CLIENT=mysql2` to use it.
- `--profile postgres`: adds the `postgres` service (port 5432); set `DB_CLIENT=pg` to use it.

Production (`docker/docker-compose.prod.yml`) follows the same pattern.

## Consequences

### Positive
- Zero-config deployment for new users (SQLite needs no extra container or credentials).
- Existing MariaDB or PostgreSQL users can point the app at their existing instance.
- Repository and service code is dialect-agnostic — switching databases requires only an env var change.

### Negative
- SQLite WAL does not support true concurrent *writes* (one writer at a time). For a household app this is acceptable; multi-instance deployments should use MariaDB or PostgreSQL.
- InnoDB transparent table-level encryption (the original reason for choosing MariaDB) is no longer leveraged by default. Field-level AES-256-GCM encryption in the application layer covers all sensitive columns regardless of the database engine.
- Three separate SQL dialects require continued care when writing raw queries or migrations — always use `dialectHelper` for anything dialect-sensitive.

### Risks
- **Migration incompatibilities**: New migrations must be authored and tested against all three engines. Any deviation (e.g., MariaDB-only `JSON_TABLE`) should be caught in CI.
- **SQLite file corruption on improper shutdown**: WAL mode reduces but does not eliminate this risk. Backups of the SQLite file should be taken regularly (covered in the deployment guide).

## References
- [Knex.js Documentation — Client Configuration](https://knexjs.org/guide/#configuration-options)
- [SQLite WAL Mode](https://www.sqlite.org/wal.html)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
