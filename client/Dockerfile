# Stage 1: Build the Node app
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# Stage 2: Serve the app with a lightweight web server
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80