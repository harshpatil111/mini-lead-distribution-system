# Mini Lead Distribution System

A Django REST Framework backend system for intelligent lead allocation.

## Features

- Customer Lead Intake API
- Duplicate Lead Protection
- Automatic Provider Allocation
- Fair Round-Robin Distribution
- Provider Quota Tracking
- Provider Dashboard API
- Django Admin Management

## Tech Stack

- Python
- Django
- Django REST Framework
- SQLite / PostgreSQL
- REST API

## Setup

Clone repository:

```bash
git clone <repo-url>
cd mini-lead-system/backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Run server:

```bash
python manage.py runserver
```

## API Endpoints

### Create Lead

POST

```text
/api/request-service/
```

Sample:

```json
{
    "customer_name":"Harshal",
    "phone":"9999999999",
    "city":"Mumbai",
    "service":1,
    "description":"Need service"
}
```

---

### Dashboard

GET

```text
/api/dashboard/
```

Returns:

- Provider quota
- Leads received
- Assigned leads

## Allocation Logic

- Service-specific mandatory providers
- Fair round-robin allocation
- Exactly 3 providers per lead
- Persistent allocation state
- Quota-aware distribution