FROM node:20-alpine AS builder

WORKDIR /app/client

COPY client/package.json client/yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY client/ ./
RUN yarn build


FROM python:3.10-alpine AS pydeps

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps \
    build-base \
    postgresql-dev \
    && apk add --no-cache libpq

COPY requirements.txt ./
RUN pip install --upgrade pip && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt


FROM python:3.10-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apk add --no-cache libpq

COPY requirements.txt ./
COPY --from=pydeps /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && rm -rf /wheels

COPY . .
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
