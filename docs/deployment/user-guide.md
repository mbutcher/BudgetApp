# BudgetApp — User Deployment Guide

This guide walks you through installing BudgetApp on your home server and getting your household set up. No coding experience required.

---

## What You Need

- A home server running **Unraid 6.12+** (or any Linux host with Docker Engine 24+)
- **Git** installed on the server
- A **domain name or local hostname** you can point at your server (e.g., `budget.lan` or `budget.yourdomain.com`)
- An SSL certificate (free via Let's Encrypt, or self-signed for LAN-only use)

> If you're on Unraid, the Community Applications plugin makes this straightforward. Docker and Git are available as Unraid community apps.

---

## Step 1 — Clone the Repository

On your server, clone BudgetApp to a location that persists across reboots. On Unraid, `/mnt/user/repos/` is a good choice:

```bash
git clone <repository-url> /mnt/user/repos/BudgetApp
cd /mnt/user/repos/BudgetApp
```

---

## Step 2 — Generate Secrets

BudgetApp uses strong randomly-generated secrets for database passwords, encryption keys, and JWT signing. Run this once:

```bash
./scripts/setup/generate-keys.sh production
```

This creates all required secret files in `secrets/production/`. **Back these up immediately** to an encrypted location outside your server (e.g., a password manager or encrypted USB drive). If you lose the encryption key, all your financial data becomes unreadable.

---

## Step 3 — Configure the Application

Copy the example configuration file:

```bash
cp secrets/.env.example secrets/production/.env
```

Open `secrets/production/.env` and set the values marked below.

### Required settings

| Setting | What to put |
|---------|------------|
| `APP_URL` | The full URL you'll access the app at, e.g. `https://budget.yourdomain.com` |
| `CORS_ORIGIN` | Same as `APP_URL` (no trailing slash) |
| `WEBAUTHN_RP_ID` | Just the domain, e.g. `budget.yourdomain.com` or `budget.lan` |
| `WEBAUTHN_ORIGIN` | Same as `APP_URL` |
| `WEBAUTHN_RP_NAME` | A display name for passkey prompts, e.g. `Budget App` |

### Database options

BudgetApp supports three database backends. Choose one:

#### Option A — SQLite (default, recommended for most users)

No database server required. BudgetApp stores everything in a single file on your server. This is the easiest option and works well for households.

Leave `DB_CLIENT` unset (or set it to `sqlite3`). The database file will be stored at `/app/data/budget.db` inside the container, which maps to `/mnt/user/appdata/budget-app/data/` on your server.

```env
# DB_CLIENT=sqlite3      ← this is the default; line can be omitted
# DB_PATH=/app/data/budget.db
```

#### Option B — MariaDB (external)

If you already run MariaDB on your Unraid server and prefer to keep your data there:

1. Create a database and user in MariaDB:
   ```sql
   CREATE DATABASE IF NOT EXISTS budget_app
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'budget_user'@'%' IDENTIFIED BY 'choose_a_strong_password';
   GRANT ALL PRIVILEGES ON budget_app.* TO 'budget_user'@'%';
   FLUSH PRIVILEGES;
   ```
2. Write the password to the secret file:
   ```bash
   printf '%s' 'choose_a_strong_password' > secrets/production/db_password.txt
   chmod 600 secrets/production/db_password.txt
   ```
3. In `secrets/production/.env`, set:
   ```env
   DB_CLIENT=mysql2
   DB_HOST=<your-mariadb-host-or-ip>
   DB_PORT=3306
   DB_NAME=budget_app
   DB_USER=budget_user
   ```

#### Option C — PostgreSQL (external)

If you prefer PostgreSQL, the setup is the same as MariaDB above but with a different client and port:

1. Create a database and user in PostgreSQL:
   ```sql
   CREATE DATABASE budget_app;
   CREATE USER budget_user WITH PASSWORD 'choose_a_strong_password';
   GRANT ALL PRIVILEGES ON DATABASE budget_app TO budget_user;
   ```
2. Write the password to the secret file (same as MariaDB step 2 above).
3. In `secrets/production/.env`, set:
   ```env
   DB_CLIENT=pg
   DB_HOST=<your-postgres-host-or-ip>
   DB_PORT=5432
   DB_NAME=budget_app
   DB_USER=budget_user
   ```

---

## Step 4 — Set Up Data Directories

Create the directories where BudgetApp will store its data:

```bash
mkdir -p /mnt/user/appdata/budget-app/data       # SQLite database file (default)
mkdir -p /mnt/user/appdata/budget-app/logs
mkdir -p /mnt/user/appdata/budget-app/uploads
mkdir -p /mnt/user/appdata/budget-app/ssl
```

> If you chose MariaDB or PostgreSQL (Options B/C above), the `/mnt/user/appdata/budget-app/data` directory is not used by BudgetApp, but it won't hurt to create it.

---

## Step 5 — SSL Certificate

Place your SSL certificate and private key in `/mnt/user/appdata/budget-app/ssl/`:

```
ssl/
  cert.pem    ← Full chain certificate (server cert + intermediates)
  key.pem     ← Private key
```

### Option A — Nginx Proxy Manager (recommended for Unraid)

If you already use **Nginx Proxy Manager**, you can skip placing certificates manually:

1. Remove the `nginx` service from `docker/docker-compose.prod.yml` (or leave it and configure NPM to proxy to port 443).
2. In NPM, create a Proxy Host pointing to `budget_backend:3001` (API) and `budget_frontend:80` (frontend).
3. Use NPM's built-in Let's Encrypt integration for automatic certificate provisioning and renewal.

### Option B — Self-Signed (LAN only)

For local network access only, generate a self-signed certificate:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout /mnt/user/appdata/budget-app/ssl/key.pem \
  -out /mnt/user/appdata/budget-app/ssl/cert.pem \
  -subj "/CN=budget.lan"
```

Your browser will show a security warning — you can add a permanent exception for your LAN hostname.

---

## Step 6 — Start BudgetApp

From the repository directory:

```bash
docker compose -f docker/docker-compose.prod.yml up -d --build
```

This builds and starts BudgetApp. The first run takes a few minutes. Check that everything is healthy:

```bash
docker compose -f docker/docker-compose.prod.yml ps
```

You should see the `budget_app` container with `Up (healthy)` status. The backend automatically runs database migrations on first start — check the logs if anything looks wrong:

```bash
docker logs budget_app | tail -30
```

---

## Step 7 — First Login

Open `https://your-domain` in a browser. You'll see the registration page.

> **Registration is only available once.** After the first user registers and creates a household, the registration page is locked. Additional users are added through the Household settings inside the app.

1. Create your account with a strong password.
2. Optionally set up **TOTP 2FA** or a **passkey** immediately (Settings → Security).
3. Create your **household** — this is the shared space for all members' accounts and data.

---

## Step 8 — Set Up Your Finances

Once logged in:

1. **Add your accounts** (Accounts page) — bank accounts, credit cards, loans, mortgages. Use actual current balances.
2. **Set up categories** — a default hierarchy is pre-loaded; customize as needed.
3. **Add budget lines** (Budget page) — define your recurring income (paycheck) and expenses (rent, utilities, subscriptions). Mark your main income line as the **pay period anchor** — this drives the pay-period view throughout the app.
4. **Connect SimpleFIN** (optional, Settings → Integrations) — automated import from your bank. You'll need a [SimpleFIN Bridge](https://bridge.simplefin.org/) account (free tier available).
5. **Enter transactions** — manually, or review/accept SimpleFIN imports via the Imports page.

---

## Keeping Up to Date

When a new version of BudgetApp is available:

```bash
cd /mnt/user/repos/BudgetApp
git pull
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

The backend automatically applies any new database migrations on startup before accepting traffic.

---

## Backups

Backing up BudgetApp means backing up two things:

### 1. Your Secrets (most critical)

The files in `secrets/production/` — especially `encryption_key.txt` — are required to read your data. Back these up to **encrypted storage outside your server**. A password manager works well.

### 2. Your Database

How you back up the database depends on which backend you chose.

#### SQLite (default)

The database is a single file at `/mnt/user/appdata/budget-app/data/budget.db`. Back it up with Unraid's built-in **CA Backup / Restore** plugin, or copy it manually:

```bash
cp /mnt/user/appdata/budget-app/data/budget.db \
   /mnt/user/backups/budget_$(date +%Y%m%d).db
```

> Stop the app first for a clean copy, or use the SQLite online-backup API (the app does not do this automatically today).

#### MariaDB (external)

Add this to Unraid's **User Scripts** plugin to run nightly:

```bash
docker exec <your-mariadb-container> \
  sh -c 'mysqldump -u budget_user -p"your_db_password" \
    --single-transaction budget_app' \
  | gzip > /mnt/user/backups/budget_$(date +%Y%m%d).sql.gz
```

#### PostgreSQL (external)

```bash
docker exec <your-postgres-container> \
  pg_dump -U budget_user budget_app \
  | gzip > /mnt/user/backups/budget_$(date +%Y%m%d).sql.gz
```

Keep at least 7 days of backups for whichever method you use.

---

## Troubleshooting

### App won't load

```bash
docker logs budget_app | tail -50
```

### Container unhealthy / not starting

```bash
docker logs budget_app | tail -50
```

Common causes:
- **Missing secret files** — verify all `secrets/production/*.txt` files exist.
- **SQLite permission error** — verify `/mnt/user/appdata/budget-app/data/` exists and is writable by Docker.
- **Cannot connect to external database** — if using MariaDB or PostgreSQL, verify the host, port, and credentials in `secrets/production/.env`, and that the database server is running and reachable from the Docker container.
- **Migration failure** — look for SQL errors in the log.

### CORS or passkey errors

Verify that `APP_URL`, `CORS_ORIGIN`, `WEBAUTHN_ORIGIN`, and `WEBAUTHN_RP_ID` in `secrets/production/.env` all match the hostname you're actually using to access the app.

### Database access (advanced)

**SQLite** — open the database file directly from the host:

```bash
sqlite3 /mnt/user/appdata/budget-app/data/budget.db
```

**MariaDB** — connect via your MariaDB container:

```bash
docker exec -it <your-mariadb-container> \
  mysql -u budget_user -p budget_app
```

**PostgreSQL** — connect via your PostgreSQL container:

```bash
docker exec -it <your-postgres-container> \
  psql -U budget_user -d budget_app
```

---

## Adding Household Members

After initial setup, additional users are added by the household owner through the app — not through a separate registration page (which is locked after first use).

1. Go to **Settings → Household**.
2. Click **Add Member** and set their display name and password.
3. They log in with those credentials and can be given access to specific accounts via **Share** on each account card.

---

## Further Reading

- [Production Deployment Reference](deployment.md) — full technical reference for all deployment options, SSL variants, backup/restore commands, and advanced troubleshooting
- [Secrets Management](../../secrets/README.md) — key rotation, permissions, and secret file details
