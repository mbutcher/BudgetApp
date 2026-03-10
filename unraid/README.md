# Unraid Installation

Two installation methods are available. Both produce the same running container.

---

## Method 1 — Setup Script (recommended)

The simplest path. Run one script in an Unraid Terminal and follow the prompts.

```bash
git clone https://github.com/mbutcher/BudgetApp /mnt/user/repos/BudgetApp
cd /mnt/user/repos/BudgetApp
./scripts/setup/setup-prod.sh
```

The script asks for your domain, whether you are using Nginx Proxy Manager, your preferred port, and your database choice. It generates all security keys and starts the app automatically.

See [docs/deployment/deployment.md](../docs/deployment/deployment.md) for the full guide.

---

## Method 2 — Docker Compose Manager

For users who prefer to manage everything through the Unraid UI.

1. Install **Docker Compose Manager** from Community Applications.
2. Open Docker Compose Manager → **Add New Stack**.
3. Name the stack `BudgetApp` and paste the contents of [`docker-compose.yml`](docker-compose.yml) (this file).
4. In an Unraid Terminal, generate your security keys:
   ```bash
   cd /mnt/user/repos/BudgetApp
   ./scripts/setup/generate-keys.sh production
   ```
5. Open `secrets/production/` and copy the contents of each `.txt` file into the matching variable in the Docker Compose Manager editor:
   - `jwt_secret.txt` → `JWT_SECRET`
   - `encryption_key.txt` → `ENCRYPTION_KEY`
   - `password_pepper.txt` → `PASSWORD_PEPPER`
6. Fill in your domain in `APP_URL`, `CORS_ORIGIN`, `WEBAUTHN_ORIGIN`, and `WEBAUTHN_RP_ID`.
7. Click **Compose Up**.

> **Save your master secret.** Copy `secrets/production/master_secret.txt` to a password manager. It is the only way to recover your data if you move to a new server.

---

## Method 3 — Community Applications (coming soon)

A one-click Community Applications template will be available once a pre-built Docker image is published. The template file [`BudgetApp.xml`](BudgetApp.xml) is ready for submission.

---

## Nginx Proxy Manager setup

Once the container is running, add a Proxy Host in NPM:

| Field | Value |
|-------|-------|
| Domain Names | `budget.yourdomain.com` |
| Forward Host / IP | Your Unraid server IP |
| Forward Port | `13911` (or your chosen port) |
| Websockets Support | ✓ enabled |
| SSL | Request new certificate, Force SSL |

In the **Advanced** tab, paste:
```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Real-IP $remote_addr;
```
