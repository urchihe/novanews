# NovaNews 📰

NovaNews is a full‑stack news aggregation platform built with **Laravel (backend)** and **REACT(TypeScript)** frontend. It is containerized with Docker Compose for easy local development and production deployment. The backend runs behind **Nginx** and is orchestrated with **Traefik** for production‑ready serving.

---

## 🚀 Features

- **Backend (Laravel)** API service (`api.yml`)
- **Frontend** service (`frontend.yml`)
- **Database** service (`database.yml`)
- **Redis** for caching (`redis.yml`)
- **Database Administration** (Adminer/pgAdmin) (`database_administration.yml`)
- **Orchestrator** service (Traefik reverse proxy) (`orchestrator.yml`)
- **Nginx** bootstrap for serving Laravel in production (`nginx`) service inside api.yml

---

## 📦 Prerequisites

- [Make](https://www.gnu.org/software/make/?utm_source=copilot.com)
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- Git

---

## ⚙️ Installation

1. **Clone the repository**
    ```bash
    git clone git@github.com:urchihe/novanews.git
    cd novanews
    ```

2. **Create env environment file**
    ```bash
    make env
    ```

3. **Update .env with your API keys**  
   Add your credentials for the supported news sources in the root project’s .env file:
    ```bash
    GUARDIAN_API_KEY=your_guardian_key_here
    NEWS_API_KEY=your_newsapi_key_here
    NYT_API_KEY=your_newyorktimes_key_here
    ```
   These environment variables are required for fetching articles from The Guardian, NewsAPI, and The New York Times.

    ⚠️ Important: Articles are fetched automatically on app launch and refreshed hourly. Make sure these keys are set correctly in your .env file to avoid missing or empty article feeds.
---

## 🐳 Running with Docker

1. **Build and start containers**
```bash
    make build
    make up
  ```
2. **How to make news fetch manual only**
    To update manually run this:
 ```bash
    make news
  ```
3. **Access the services**
    - Frontend: [http://novanews.localhost](http://novanews.localhost)
    - Backend API (Laravel): [http://api.novanews.localhost](http://api.novanews.localhost)
    - Database Admin: [http://localhost:8080](http://localhost:8080)
    - Traefik Dashboard: [http://localhost:8080](http://localhost:8080)

---

## 🧰 Makefile Commands

| Command | Description |
|---------|-------------|
| `make build` | Build all Docker images |
| `make build-no-cache` | Build all Docker images without cache |
| `make up` | Start all services in detached mode |
| `make down` | Stop all containers but keep volumes |
| `make clean` | Stop containers and remove volumes |
| `make logs` | Tail logs of all containers |
| `make api` | Open shell in API container |
| `make frontend` | Open shell in Frontend container |

---

## 📝 Additional Notes

- **API Scheduler & Tasks**  
  NovaNews uses the Laravel scheduler for recurring tasks like fetching news articles. The scheduler is managed via Supervisor and Horizon inside the API Docker container, so you do not need to manually run cron jobs. All scheduled tasks, queues, and jobs are handled automatically by Docker in both local and production environments.
  
- **Authentication**  
  The backend uses Laravel Sanctum for API authentication.
- **Environment Variables**  
  Make sure `.env` contains correct database, Redis, and API credentials.
- **Troubleshooting**  
  - Check container logs: `make logs`
  - Rebuild images if dependencies fail: `make build-no-cache`
  - Ensure database and Redis are healthy before starting API and frontend.
