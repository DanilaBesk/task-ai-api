# API для управления пользователями и AI генерации текста

## Описание

Этот API предоставляет конечные точки для управления пользователями, выполнения операций с пользователями, таких как получение информации о пользователе, изменение кредитов и удаление пользователей. API поддерживает аутентификацию с использованием JWT (JSON Web Token) и контроль доступа на основе ролей для различных действий пользователей.

API предназначен для администраторов и клиентов, с управлением доступом в зависимости от ролей, что гарантирует, что только авторизованные пользователи могут выполнять определенные операции, например, изменение кредитов или удаление пользователя.

## Роуты API

### 1. Аутентификация и авторизация (Auth)

- POST `/api/auth/registration`: Регистрация нового пользователя.
- POST `/api/auth/login`: Вход существующего пользователя.
- POST `/api/auth/logout`: Выход из системы (требуется аутентификация).
- POST `/api/auth/refresh-tokens`: Обновление токенов доступа.

---

### 2. Пользователь (User)

- GET `/api/user/info`: Получить информацию о текущем пользователе (требуется аутентификация).
- POST `/api/user/adjust-credits`: Обновить кредиты пользователя (только для администратора).
- POST `/api/user/delete`: Удалить пользователя (требуется аутентификация).

---

### 3. Искусственный интеллект (AI)

- POST `/api/ai/generate`: Генерация текста с использованием искусственного интеллекта (требуется аутентификация).

---

## Запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/DanilaBesk/task-ai-api.git
cd task-ai-api
```

### 2. Установка зависимостей

```bash
npm install

```

### 3. Создание .env файла

В корневой директории проекта создайте файл .env и определите необходимые переменные окружения. Пример находится в .env.example файле.

```txt
APP_PORT=5000

// Базовый администратор для приложения
APP_BASE_ADMIN_EMAIL='admin@example.com'
APP_BASE_ADMIN_PASSWORD='password123'

APP_JWT_ACCESS_SECRET=''
APP_JWT_REFRESH_SECRET=''

OPENAI_API_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3YjEyMWFlLWUwZDYtNDliMi1iNjlmLTBkNzE3ODkzYjgzOSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3Mjc2OTA0MTgsImV4cCI6MjA0MzI2NjQxOH0.0_rVXKNuSCBP4MO6hBnTXAE0kE1h52xpwDSGPaR4vGM'

POSTGRES_PORT=5432
POSTGRES_USER='user'
POSTGRES_PASSWORD='password123'
POSTGRES_DB='ai-actions'
POSTGRES_HOST='postgres'

DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

### 4. Запуск проекта

Для запуска проекта используйте Docker Compose. Это автоматически создаст и запустит 2 контейнера: один `postgres` с базой данных и второй `main` с проектом. При сборке контейнера `main` запустится скрипт `docker-wait-postgres.sh`, который будет ждать, пока запустится база данных, чтобы выполнить миграции и запустить приложение.

Запустите команду:

```bash
docker compose up --build
```

После выполнения этой команды проект будет доступен на порту, указанном в .env файле (APP_PORT), например `http://localhost:5000`

## Документация API

Документация OpenAPI/Swagger доступна после запуска проекта по маршруту: '/api-docs'
