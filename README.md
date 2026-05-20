# Mini Lead Distribution System

This repo contains:

- `backend/`: Django REST API (lead creation, allocation, dashboard, webhook tools)
- `frontend/`: Next.js app (Request Service, Dashboard with polling, Test Tools)

## Run backend

```powershell
cd .\backend
.\venv\Scripts\activate
python manage.py runserver
```

Backend base URL: `http://127.0.0.1:8000`

## Run frontend

```powershell
cd .\frontend
npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:3000`

### Frontend env

The frontend reads the Django URL from:

- `frontend/.env.local`:
  - `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`

## Main pages

- `/request-service`: submits `POST /api/request-service/`
- `/dashboard`: polls `GET /api/dashboard/` every 3 seconds
- `/test-tools`:
  - quota reset webhook: `POST /api/webhook/quota-reset/`
  - idempotency test (same `event_id`)
  - generate 10 leads concurrently

