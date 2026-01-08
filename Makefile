
# Makefile

# Default project name (can be overridden)
PROJECT ?= novanews

# Load ENV from .env file
ENV := $(shell grep '^ENV=' .env | cut -d '=' -f2)

COMPOSE_FILES := \
    -f containers/orchestrator.yml \
    -f containers/api.yml \
    -f containers/frontend.yml \
    -f containers/database.yml \
    -f containers/database_administration.yml \
    -f containers/redis.yml \


# Path to the .env file
ENV_FILE := --env-file .env

# Declare phony targets (always run, never treated as files)
.PHONY: up down clean logs build build-no-cache api frontend network

# Create the global traefik network if it doesn't exist
network:
	@docker network inspect traefik-network >/dev/null 2>&1 || \
		docker network create traefik-network

# Start the app stack
up: network
		docker compose $(ENV_FILE) $(COMPOSE_FILES) up -d --remove-orphans

# Stop and remove containers, but keep volumes and network
down:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) down

# Remove everything
clean:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) down -v

# View logs
logs:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) logs -f

# Rebuild images
build:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) build

# Build all services without cache
build-no-cache:
	docker compose $(COMPOSE_FILES) $(ENV_FILE) build --no-cache

# Open shell in api container
api:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) exec api bash

# Open shell in frontend container
frontend:
	docker compose $(ENV_FILE) $(COMPOSE_FILES) exec frontend sh

