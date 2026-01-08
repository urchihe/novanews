# ---------- Base Stage ----------
FROM node:22-alpine AS base

WORKDIR /usr/app

# Enable Yarn globally
RUN corepack enable && corepack prepare yarn@stable --activate

# Set build mode
ARG MODE=production
ENV MODE=$MODE
ENV CI=true

# Copy dependency files first (cache-friendly)
COPY package.json yarn.lock ./

# Install dependencies (node_modules style)
RUN yarn install --immutable

# Copy full source
COPY . .

# Load environment file if present
RUN if [ -f ".env.$MODE" ]; then cp ".env.$MODE" .env; fi

# ---------- Build Stage ----------
FROM base AS build
RUN yarn build

# ---------- Development Stage ----------
FROM node:22-alpine AS dev

WORKDIR /usr/app
ENV NODE_ENV=development
ENV CI=true

# Enable Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy dependency files
COPY package.json yarn.lock .yarnrc.yml ./

# Copy dev environment file
ARG MODE=development
RUN if [ -f ".env.$MODE" ]; then cp ".env.$MODE" .env; fi

# Install dependencies
RUN yarn install

# Copy full source code for hot reload
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server
CMD sh -c "yarn install && yarn dev"

# ---------- Production (Nginx) ----------
FROM nginx:stable-alpine AS prod

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts
COPY --from=build /usr/app/dist /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
