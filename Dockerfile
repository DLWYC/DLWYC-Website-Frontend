FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
# Vite reads VITE_* build-time variables from .env if present; when absent,
# the app defaults to same-origin /api (see src/lib/env.js). Do NOT COPY a
# .env that contains secrets into the image.
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
