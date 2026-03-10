# BudgetApp — User Guide

This guide walks you through installing BudgetApp on your home server and getting your household set up. No coding experience required.

---

## What You Need

- A home server running **Unraid 6.12+** (or any Linux host with Docker Engine 24+)
- **Git** installed on the server
- A **domain name or local hostname** you can point at your server (e.g., `budget.lan` or `budget.yourdomain.com`)

> **SSL:** Passkeys and push notifications require HTTPS. Nginx Proxy Manager (free, available in Community Applications) handles SSL automatically — recommended.

---

## Installation

Three methods are available. All produce the same running container.

---

### Method 1 — Setup Script (recommended)

The simplest path. One script asks a few questions and handles everything.

**1. Clone the repository:**

```bash
git clone https://github.com/mbutcher/BudgetApp /mnt/user/repos/BudgetApp
cd /mnt/user/repos/BudgetApp
```

**2. Run the setup script:**

```bash
./scripts/setup/setup-prod.sh
```

The script will ask for:
- Your domain name (e.g. `budget.yourdomain.com`)
- Whether you are using Nginx Proxy Manager
- The host port BudgetApp should listen on (default `13911`)
- Your database choice and credentials (if using MariaDB or PostgreSQL)

It then generates your security keys, creates the necessary folders, and starts the app.

> **Optional:** Pass answers directly to skip prompts:
> ```bash
> ./scripts/setup/setup-prod.sh --domain budget.yourdomain.com --port 13911
> ```

Skip ahead to [**Save Your Master Secret**](#save-your-master-secret).

---

### Method 2 — Docker Compose Manager (Unraid)

For users who prefer to manage everything through the Unraid UI.

1. Install **Docker Compose Manager** from Community Applications.
2. Open Docker Compose Manager → **Add New Stack**. Name it `BudgetApp` and paste the contents of [`unraid/docker-compose.yml`](../../unraid/docker-compose.yml).
3. In an Unraid Terminal, generate your security keys:
   ```bash
   git clone https://github.com/mbutcher/BudgetApp /mnt/user/repos/BudgetApp
   cd /mnt/user/repos/BudgetApp
   ./scripts/setup/generate-keys.sh production
   ```
4. Open `secrets/production/` and copy the contents of each `.txt` file into the matching variable in the Docker Compose Manager editor:
   - `jwt_secret.txt` → `JWT_SECRET`
   - `encryption_key.txt` → `ENCRYPTION_KEY`
   - `password_pepper.txt` → `PASSWORD_PEPPER`
5. Fill in your domain in `APP_URL`, `CORS_ORIGIN`, `WEBAUTHN_ORIGIN`, and `WEBAUTHN_RP_ID`.
6. Click **Compose Up**.

> **Save your master secret.** Copy `secrets/production/master_secret.txt` to a password manager. It is the only way to recover your data if you move to a new server.

---

### Method 3 — Community Applications (coming soon)

A one-click template will be available in Community Applications once a pre-built Docker image is published. The template is ready; check the GitHub repository for availability.

---

## Save Your Master Secret

The first time you open BudgetApp in a browser, you will see a screen asking you to save your **Master Secret**.

**This is the single most important step.** Your Master Secret is a long string of letters and numbers that protects all of your data. If you ever need to move BudgetApp to a new server, this is what you'll need to restore it.

1. Click **Copy** to copy the Master Secret to your clipboard.
2. Paste it into a password manager (1Password, Bitwarden, etc.) or write it down and store it somewhere safe — **off the server**.
3. Check the confirmation box and click **Continue** to proceed to account creation.

Once you dismiss this screen, the secret will never be shown again.

---

## Set Up Nginx Proxy Manager

If you want HTTPS and/or access from outside your home network, configure a Proxy Host in Nginx Proxy Manager:

1. Open NPM → **Proxy Hosts → Add Proxy Host**.
2. Fill in the **Details** tab:
   - **Domain Names:** `budget.yourdomain.com`
   - **Forward Hostname / IP:** the IP address of your Unraid server
   - **Forward Port:** `13911` (or whichever port you chose)
   - Turn on **Websockets Support**
3. On the **SSL** tab → **Request a new SSL Certificate** → turn on **Force SSL**.
4. On the **Advanced** tab, paste:
   ```nginx
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   proxy_set_header X-Real-IP $remote_addr;
   ```
5. Click **Save**.

BudgetApp is now accessible at `https://budget.yourdomain.com`.

---

## First Login

Open the app in a browser. You'll see the registration page.

> **Registration is only available once.** After the first user registers, the registration page is locked. Additional users are added through Household settings inside the app.

1. Create your account with a strong password.
2. Set up **TOTP 2FA** or a **passkey** immediately (Settings → Security) — recommended.
3. Create your **household** — the shared space for all members' accounts and data.

---

## Set Up Your Finances

Once logged in:

1. **Add your accounts** (Accounts page) — bank accounts, credit cards, loans, mortgages. Use actual current balances.
2. **Set up categories** — a default hierarchy is pre-loaded; customize as needed.
3. **Add budget lines** (Budget page) — define your recurring income and expenses. Mark your main income line as the **pay period anchor** — this drives the pay-period view throughout the app.
4. **Connect SimpleFIN** (optional, Settings → Integrations) — automated import from your bank. Requires a [SimpleFIN Bridge](https://bridge.simplefin.org/) account (free tier available).
5. **Enter transactions** — manually, or review/accept SimpleFIN imports via the Imports page.

---

## Adding Household Members

After initial setup, additional users are added by the household owner through the app — not through the registration page (which is locked after first use).

1. Go to **Settings → Household**.
2. Click **Add Member** and set their display name and password.
3. They log in with those credentials and can be given access to specific accounts via **Share** on each account card.

---

## Keeping Up to Date

```bash
cd /mnt/user/repos/BudgetApp
git pull
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Database updates are applied automatically when the app starts back up.

---

## Backups

Back up two things regularly.

### 1. Your Master Secret (most critical)

Copy `secrets/production/master_secret.txt` to **encrypted storage outside your server** (password manager, encrypted USB drive). Without it you cannot recover your data after a hardware failure.

### 2. Your Database

**SQLite (default):** The database is a single file. Back it up with the **CA Backup / Restore** plugin, or copy it manually:

```bash
cp /mnt/user/appdata/budget-app/data/budget.db \
   /mnt/user/backups/budget_$(date +%Y%m%d).db
```

**MariaDB:** Add a nightly User Scripts entry:

```bash
docker exec <your-mariadb-container> \
  sh -c 'mysqldump -u budget_user -p"your_db_password" \
    --single-transaction budget_app' \
  | gzip > /mnt/user/backups/budget_$(date +%Y%m%d).sql.gz
```

**PostgreSQL:** Similarly:

```bash
docker exec <your-postgres-container> \
  pg_dump -U budget_user budget_app \
  | gzip > /mnt/user/backups/budget_$(date +%Y%m%d).sql.gz
```

Keep at least 7 days of backups.

---

## Troubleshooting

### The app won't start

```bash
docker compose -f docker/docker-compose.prod.yml logs
```

Common causes:

- **Missing secret files** — run `./scripts/setup/setup-prod.sh` again from the repo folder.
- **SQLite permission error** — verify `/mnt/user/appdata/budget-app/data/` exists and is writable.
- **Can't connect to external database** — verify the host, port, and credentials in `secrets/production/.env`. Make sure the database container is running and the `budget_app` database exists.
- **Port already in use** — edit `APP_PORT` in `docker/.env` to a free port, then restart. Or re-run `./scripts/setup/setup-prod.sh --port <new-port>`.

### Passkey or WebAuthn errors

Verify that your domain in Nginx Proxy Manager exactly matches what you entered during setup. Mismatched hostnames break passkeys.

### Check whether the app is running

```bash
docker compose -f docker/docker-compose.prod.yml ps
```

The `budget_app` container should show **Up (healthy)**.

---

## Further Reading

- [Installation Guide](deployment.md) — full technical reference: all deployment options, backup/restore commands, disaster recovery, advanced troubleshooting
- [Unraid-specific notes](../../unraid/README.md) — Community Applications template, Docker Compose Manager details, NPM setup
