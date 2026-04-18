# Stage 1: build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/ .
RUN yarn install && yarn build

# Stage 2: backend
FROM python:3.10-alpine
WORKDIR /app

COPY . .
COPY --from=frontend-build /app/dist ./dist

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
