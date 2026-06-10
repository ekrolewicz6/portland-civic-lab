# Portland Civic Dashboard

Public dashboard, data publishing layer, and Portland Civic Lab shell.

Workspace path: `apps/civic-dashboard/`

See `ARCHITECTURE.md` for folder ownership and shared-data rules. Dashboard data
source inventory lives in `docs/data-source-inventory.md`.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4 + Recharts
- **Backend**: Next.js API routes (PostgreSQL-ready, mock data for development)
- **ETL Pipeline**: Python workers scheduled via cron (see `ingest/legacy/python/`)
- **Database**: PostgreSQL with PostGIS extension
- **Maps**: Mapbox GL JS
- **Hosting**: Vercel (frontend) + Railway/Fly.io (backend/DB/ETL)

## The Seven Questions

1. **Is Portland gaining or losing people?** — Water bureau activations, Census, IRS migration
2. **Is Portland gaining or losing businesses?** — BLT registrations, CivicApps, SOS filings
3. **Is downtown coming back?** — Placer.ai foot traffic, vacancy, CoStar
4. **Is Portland safe?** — PPB crime data, 911 response times, PDX Reporter
5. **What do Portlanders pay, and what do they get?** — FiSC local fiscal basket, tax scenarios, service return
6. **Is housing getting built?** — PP&D permits, Zillow rents, PHB pipeline
7. **Is the Portland Commons working?** — PCB registry metrics

## Ingestion

```bash
# TypeScript ingestion scripts
npm run fetch:external
npm run scrape:permits

# Legacy Python ETL workers
cd ingest/legacy/python
pip install -r requirements.txt
cp .env.example .env

# Run all workers once
python scheduler.py --run-now

# Run scheduler (cron-like)
python scheduler.py
```

## Database Setup

```bash
# Create database
createdb portland_dashboard

# Enable PostGIS
psql portland_dashboard -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run schema
psql portland_dashboard < ingest/legacy/python/schema.sql
```

## Deployment

### Vercel (Frontend)

```bash
vercel deploy
```

### Railway (Database + ETL)

See `ingest/legacy/python/` for worker configurations. Deploy as a background service.
