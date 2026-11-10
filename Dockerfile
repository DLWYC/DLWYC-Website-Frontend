FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN pnpm ci --legacy-peer-deps


COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]