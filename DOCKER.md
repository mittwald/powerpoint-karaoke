# Docker Deployment Guide

This guide explains how to run PowerPoint Karaoke using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/mittwald/powerpoint-karaoke.git
   cd powerpoint-karaoke
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   SESSION_SECRET=your_random_secret_string_here
   ```

4. **Start the application**:
   ```bash
   docker-compose up -d
   ```

5. **Access the application**:
   - Open your browser and navigate to: http://localhost:5000

## Available Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Application only
docker-compose logs -f app

# Database only
docker-compose logs -f db
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Stop and remove all data
```bash
docker-compose down -v
```

## Services

The docker-compose setup includes:

### Application (`app`)
- **Port**: 5000
- **Description**: The PowerPoint Karaoke web application
- **Depends on**: PostgreSQL database

### Database (`db`)
- **Port**: 5432
- **Image**: PostgreSQL 16 Alpine
- **Volume**: `postgres-data` for data persistence
- **Credentials**:
  - Username: `powerpoint`
  - Password: `powerpoint`
  - Database: `powerpoint_karaoke`

## Environment Variables

Configure these in your `.env` file:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `OPENAI_API_BASE_URL` | No | `https://llm.aihosting.mittwald.de/v1` | OpenAI API base URL |
| `OPENAI_MODEL` | No | `gpt-oss-120b` | OpenAI model to use |
| `UNSPLASH_ACCESS_KEY` | Yes | - | Your Unsplash API key |
| `SESSION_SECRET` | Yes | - | Random secret for sessions |
| `DATABASE_URL` | No | Auto-configured | PostgreSQL connection string |

## Production Deployment

For production deployments:

1. **Change default credentials**:
   - Edit `docker-compose.yml` to use strong database passwords
   - Generate a secure `SESSION_SECRET`

2. **Use environment variables**:
   ```bash
   # Example with environment variables
   OPENAI_API_KEY=xxx UNSPLASH_ACCESS_KEY=yyy docker-compose up -d
   ```

3. **Enable HTTPS**:
   - Use a reverse proxy (nginx, Traefik, Caddy)
   - Configure SSL certificates

4. **Backup database**:
   ```bash
   docker-compose exec db pg_dump -U powerpoint powerpoint_karaoke > backup.sql
   ```

5. **Restore database**:
   ```bash
   docker-compose exec -T db psql -U powerpoint powerpoint_karaoke < backup.sql
   ```

## Database Migrations

The application uses Drizzle ORM for database management. Schema changes are applied automatically on startup.

To manually run migrations:
```bash
docker-compose exec app npm run db:push
```

## Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs app

# Verify database is healthy
docker-compose ps
```

### Database connection issues
```bash
# Restart services
docker-compose restart

# Check database logs
docker-compose logs db
```

### Port already in use
If port 5000 or 5432 is already in use, edit `docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "3000:5000"  # Change external port
```

### Clear all data and restart
```bash
docker-compose down -v
docker-compose up -d
```

## Development

For development with live reload, use the native development setup instead:
```bash
npm install
npm run dev
```

Docker is recommended for production deployments and testing production builds.

## Health Checks

The application includes health checks:

- **App health**: http://localhost:5000/api/health
- **Database health**: Automatic via Docker health check

Monitor health status:
```bash
docker-compose ps
```

## Volumes

### postgres-data
Stores PostgreSQL database files for data persistence.

To backup the volume:
```bash
docker run --rm -v powerpoint-karaoke_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

## Network

Services communicate on a dedicated bridge network: `powerpoint-network`

## Support

For issues and questions:
- GitHub Issues: https://github.com/mittwald/powerpoint-karaoke/issues
- Documentation: See main README.md
