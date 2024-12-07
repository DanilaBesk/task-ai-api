#!/bin/sh

echo "Waiting for the database to be ready..."
until nc -z "${POSTGRES_HOST}" "${POSTGRES_PORT}"; do
  sleep 1
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec "$@"
