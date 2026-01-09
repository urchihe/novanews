# NovaNews 📰

NovaNews is a full‑stack news aggregation platform built with **Laravel (backend)** and a modern frontend. It is containerized with Docker Compose for easy local development and production deployment. The backend runs behind **Nginx** and is orchestrated with **Traefik** for production‑ready serving.

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

- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- Git

---

## ⚙️ Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/novanews.git
    cd novanews
    ```

2. **Create env environment file**
    ```bash
    make env
    ```

3. **Update .env with your API keys**  
   Add your credentials for the news sources:
    ```bash
    GUARDIAN_API_KEY=your_guardian_key_here
    NEWS_API_KEY=your_newsapi_key_here
    NYT_API_KEY=your_newyorktimes_key_here
    ```
   These keys are required for fetching articles from The Guardian, NewsAPI, and The New York Times.
   
   ⚠️ Note: Articles are fetched on app launch and updated hourly, so it is important to keep these keys set in the environment.
---

## 🐳 Running with Docker

1. **Build and start containers**
    ```bash
    make build
    make up
    ```

2. **Access the services**
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
  NovaNews uses Laravel scheduler for recurring tasks like fetching news. In production, you should run:
    ```bash
    * * * * * docker exec nova-api php artisan schedule:run >> /dev/null 2>&1
    ```
- **Authentication**  
  The backend uses Laravel Sanctum for API authentication.
- **Environment Variables**  
  Make sure `.env` contains correct database, Redis, and API credentials.
- **Troubleshooting**  
  - Check container logs: `make logs`
  - Rebuild images if dependencies fail: `make build-no-cache`
  - Ensure database and Redis are healthy before starting API and frontend.
