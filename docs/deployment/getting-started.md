# Getting Started with BudgetApp Development

> **v0.1** — This guide covers setting up a local development environment.

This guide will help you set up your development environment and start contributing to the BudgetApp project.

## Prerequisites

### Required Software
- **Docker Desktop** (4.x or later) - [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js** (20.x or later) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** - We recommend [VS Code](https://code.visualstudio.com/)

### Optional But Recommended
- **Postman** or **Insomnia** - For API testing
- **DBeaver** or **TablePlus** - For database management
- **Redis Insight** - For Redis debugging

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB free space
- **OS**: macOS, Linux, or Windows with WSL2

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BudgetApp
```

### 2. Generate Development Secrets

The application requires encryption keys and secrets. Generate them with:

```bash
./scripts/setup/generate-keys.sh development
```

This creates:
- Database passwords
- JWT signing secrets
- Encryption master keys
- Password pepper
- All necessary environment files

**Important**: These secrets are git-ignored and never committed to version control.

### 3. Initialize Development Environment

Run the initialization script:

```bash
./scripts/setup/init-dev.sh
```

This will:
- Verify prerequisites are installed
- Create development `.env` files
- Start Docker containers
- Wait for database to be ready
- Run database migrations
- Seed initial data (categories, sample users)

### 4. Verify Installation

Check that all services are running:

```bash
docker compose -f docker/docker-compose.dev.yml ps
```

You should see (default SQLite configuration):
- `budget_backend_dev` (running)
- `budget_frontend_dev` (running)

Optional database containers are started via Docker Compose profiles (see [Database Management](#database-management)).

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs (Swagger UI)

## Development Workflow

### Starting the Development Environment

```bash
# Start default services (backend + frontend, SQLite)
docker compose -f docker/docker-compose.dev.yml up -d

# Start with MariaDB instead of SQLite
docker compose -f docker/docker-compose.dev.yml --profile mariadb up -d
# (also set DB_CLIENT=mysql2 in secrets/development/.env)

# Start with PostgreSQL instead of SQLite
docker compose -f docker/docker-compose.dev.yml --profile postgres up -d
# (also set DB_CLIENT=pg in secrets/development/.env)

# View logs
docker compose -f docker/docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker/docker-compose.dev.yml logs -f backend
```

### Stopping the Development Environment

```bash
# Stop all containers
docker compose -f docker/docker-compose.dev.yml down

# Stop and remove volumes (fresh start)
docker compose -f docker/docker-compose.dev.yml down -v
```

### Hot Reload

Both frontend and backend support hot reload:

- **Backend**: Uses nodemon to watch for TypeScript file changes
- **Frontend**: Uses Vite HMR for instant updates

Simply edit files and changes will automatically reload.

### Running Backend Locally (Outside Docker)

For faster iteration, you can run the backend directly:

```bash
cd backend
npm install
npm run dev
```

Make sure to update the database host in your local `.env`:
```env
DB_HOST=localhost
```

### Running Frontend Locally (Outside Docker)

```bash
cd frontend
npm install
npm run dev
```

## Database Management

The default development configuration uses **SQLite** (zero-config). Optionally switch to MariaDB or PostgreSQL via Docker Compose profiles (see [Development Workflow](#development-workflow)).

### Accessing the Database

**SQLite (default):**
```bash
# Open SQLite shell inside the backend container
docker exec -it budget_backend_dev npx knex --knexfile src/database/knexfile.ts sqlite3 /app/data/budget.db
# Or copy the file out and open with DB Browser for SQLite
docker cp budget_backend_dev:/app/data/budget.db ./budget.db
```

**MariaDB (--profile mariadb):**
```bash
docker exec -it budget_mariadb_dev mysql -u budget_user -p budget_app
```

**PostgreSQL (--profile postgres):**
```bash
docker exec -it budget_postgres_dev psql -U budget_user -d budget_app
```

### Running Migrations

```bash
# Run all pending migrations
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate

# Rollback last migration
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate:rollback

# Create new migration
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate:make <migration_name>
```

### Seeding Data

```bash
# Run all seeds
docker compose -f docker/docker-compose.dev.yml exec backend npm run seed

# Reset database and re-seed
./scripts/dev/reset-db.sh
```

### Viewing Database

**SQLite**: Use [DB Browser for SQLite](https://sqlitebrowser.org/) — copy `budget.db` out of the container (see above).

**MariaDB/PostgreSQL**: Use a GUI client like DBeaver or TablePlus:
- MariaDB — Host: `localhost`, Port: `3306`, DB: `budget_app`, User: `budget_user`
- PostgreSQL — Host: `localhost`, Port: `5432`, DB: `budget_app`, User: `budget_user`

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- TransferLinkingService.test.ts

# Run in watch mode
npm test -- --watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

### E2E Tests

```bash
# Run E2E tests (requires services running)
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test
npm run test:e2e -- tests/auth.spec.ts
```

## Code Quality

### Linting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint

# Auto-fix
cd backend && npm run lint:fix
```

### Type Checking

```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

### Formatting

We use Prettier for code formatting:

```bash
# Check formatting
npm run format:check

# Auto-format
npm run format
```

## Debugging

### Backend Debugging

The backend runs with debugger enabled on port 9229.

**VS Code Launch Configuration**:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Backend",
  "port": 9229,
  "restart": true,
  "skipFiles": ["<node_internals>/**"]
}
```

Set breakpoints in VS Code and attach the debugger.

### Frontend Debugging

Use browser DevTools:
- React DevTools extension
- Redux DevTools (for state inspection)
- Network tab for API calls

### Database Debugging

**SQLite**: Knex query logging is enabled in development mode — check the backend container logs.

**MariaDB**: Enable query logging in the MariaDB console:
```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- View logs
SELECT * FROM mysql.general_log ORDER BY event_time DESC LIMIT 100;
```

**PostgreSQL**: Enable logging via `postgresql.conf` (`log_statement = 'all'`) or use the `pg_stat_statements` extension.

## Common Development Tasks

### Adding a New API Endpoint

1. Define route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service logic in `backend/src/services/`
4. Create repository method if needed
5. Add validation schema in `backend/src/validators/`
6. Update OpenAPI spec in `docs/api/paths/`
7. Write tests
8. Update documentation

### Adding a New Frontend Component

1. Create component in appropriate feature directory
2. Add to component export
3. Create Storybook story (if reusable)
4. Write tests
5. Update documentation

### Creating a Database Migration

```bash
cd backend
npm run migrate:make create_table_name

# Edit the migration file in backend/src/database/migrations/
# Run migration
npm run migrate
```

### Adding Encryption to a Field

1. Update model to mark field as encrypted
2. Add field to `ENCRYPTED_FIELDS` in `backend/src/config/encryption.ts`
3. Update repository to use encryption service
4. Create migration to encrypt existing data
5. Test encryption/decryption

### Understanding Nginx Configuration

The project uses **two separate Nginx configurations** for different purposes:

#### 1. Reverse Proxy (`docker/nginx/nginx.conf`)
- **Used in**: Production only (`docker-compose.prod.yml`)
- **Purpose**: Main entry point with SSL termination and routing
- **Responsibilities**:
  - SSL/TLS termination
  - HTTP to HTTPS redirect
  - Route `/api/v1/*` to backend container
  - Route `/*` to frontend container
  - Rate limiting and security headers
- **When to edit**: Adding API routes, changing SSL settings, adjusting rate limits

See [docker/nginx/README.md](../../docker/nginx/README.md) for detailed documentation.

#### 2. Frontend Server (`frontend/nginx.conf`)
- **Used in**: Production frontend container
- **Purpose**: Serve pre-built React static files
- **Responsibilities**:
  - Serve static assets
  - SPA routing (all routes → index.html)
  - Gzip compression
- **When to edit**: Changing cache headers, adding new static file routes

#### Development vs Production

| Aspect | Development | Production |
|--------|------------|------------|
| Entry Point | Vite dev server (`:3000`) | Nginx reverse proxy (`:443`) |
| Backend Access | Direct (`:3001`) | Via reverse proxy |
| SSL | Not used | Required |
| Frontend Serving | Vite HMR | Nginx static files |

For more details, see the [Nginx Configuration Guide](../../docker/nginx/README.md).

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Docker Container Won't Start

```bash
# Check logs
docker compose -f docker/docker-compose.dev.yml logs <service_name>

# Rebuild containers
docker compose -f docker/docker-compose.dev.yml up -d --build --force-recreate

# Clean Docker system
docker system prune -a
```

### Database Connection Errors

1. Verify the correct database container is running (`docker ps`) — MariaDB and PostgreSQL require their profile to be active.
2. Check `DB_CLIENT` and connection credentials in `secrets/development/.env`.
3. Verify network connectivity: `docker network ls`
4. Check database container logs:
   ```bash
   docker compose -f docker/docker-compose.dev.yml logs mariadb   # MariaDB
   docker compose -f docker/docker-compose.dev.yml logs postgres  # PostgreSQL
   ```
5. For SQLite issues, verify the `backend_data` named volume exists: `docker volume ls | grep sqlite`

### Migration Errors

```bash
# Check current migration version
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate:status

# Rollback and retry
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate:rollback
docker compose -f docker/docker-compose.dev.yml exec backend npm run migrate
```

### Node Module Issues

```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install

# Clear npm cache
npm cache clean --force
```

## Next Steps

- Review [Architecture Decisions](../developer/architecture-decisions/) — key technical decision records
- Explore [Database Schema](../developer/database-schema.md) — full schema reference

## Getting Help

- **Documentation**: Check `docs/` directory
- **API Reference**: http://localhost:3001/api-docs (Swagger UI, requires running backend)
- **Issues**: Create an issue on GitHub

## Development Tips

1. **Use TypeScript strictly**: Enable `strict` mode, avoid `any`
2. **Write tests first**: TDD for complex business logic
3. **Keep commits atomic**: One logical change per commit
4. **Update docs**: Documentation is code - keep it current
5. **Security first**: Never commit secrets, always encrypt sensitive data
6. **Review before PR**: Self-review your changes before requesting review

Happy coding! 🚀
