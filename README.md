# Plant Analysis Tool

Lightweight Express.js server that analyzes plant images using the Google Generative Language API and generates downloadable PDF reports.

**This repository contains only the application code. Do NOT commit credentials or service-account JSON files.**

## Prerequisites

- Node.js v18+ (or newer)
- A Google Generative Language credential: either a service-account JSON (recommended) or a short-lived OAuth access token for testing

## Install

1. Install dependencies:

```powershell
npm install
```

2. Copy the example environment file and populate values:

```powershell
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY or set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path
```

Recommended: set a service account JSON and export it as `GOOGLE_APPLICATION_CREDENTIALS` in PowerShell:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\keys\gen-ai-sa.json'
```

## Run

Start the server:

```powershell
npm start
# or: node app.js
```

Default port: `5000` (override via `PORT` in `.env`).

Open the web UI at:

```
http://localhost:5000
```

## Endpoints

- `POST /analyze` — multipart form upload with field name `image`. Returns JSON `{ result, image }`, where `image` is a base64 data URL and `result` is analysis text.
- `POST /download` — JSON body `{ result, image }`. Returns generated PDF file download.
- `GET /health` — returns whether the app can reach the Generative Language API and lists available models or the API error for diagnostics.

## Security notes

- Never commit `.env` or service account JSON files. Use `.env.example` as a template and store secrets in your environment or CI secret store.
- If secrets were accidentally committed, rotate credentials and remove them from git history using `git filter-repo` or the BFG Repo-Cleaner.

## Git & GitHub — Upload this project

1. Initialize the repository (if not already):

```powershell
cd "E:\Plant Scan"
git init
```

2. Create a safe `.gitignore` (this repo includes a sensible `.gitignore` that excludes `node_modules`, `.env`, `keys/`, `upload/`, and `reports/`).

3. Add and commit:

```powershell
git add .
git commit -m "Initial commit: Plant Analysis Tool"
```

4. Create a remote GitHub repository and push — two options:

- Option A (GitHub CLI `gh` installed):

```powershell
gh repo create your-username/plant-analysis-tool --public --source=. --remote=origin --push
```

- Option B (manual on github.com):

```powershell
git remote add origin https://github.com/your-username/plant-analysis-tool.git
git branch -M main
git push -u origin main
```

5. On GitHub: enable branch protection, create repository secrets for deployment, and do not store secrets in code.

## Troubleshooting

- If `/health` returns `API_KEY_SERVICE_BLOCKED` or `UNAUTHENTICATED`, use a service-account JSON and set `GOOGLE_APPLICATION_CREDENTIALS`, or run the included `tools/list_models.js` helper with your key file to verify available models.
- If you get `models/... not found` for `generateContent`, call `/health` or run the model-list helper to find supported model IDs and update `app.js` accordingly.

---

If you'd like, I can perform the `git init`, create the `.gitignore` file (already added), make the first commit, and push to a new repo if you give me the remote URL or let me create a public repo using your GitHub username. Would you like me to do that now?
