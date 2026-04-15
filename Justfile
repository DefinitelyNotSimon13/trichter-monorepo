set dotenv-load
set shell := ["bash", "-euo", "pipefail", "-c"]

default:
  @just --list

db-local file:
  psql "$DATABASE_URL_LOCAL" -v ON_ERROR_STOP=1 -f "{{file}}"

db-dev file:
  psql "$DATABASE_URL_DEV" -v ON_ERROR_STOP=1 -f "{{file}}"

db-prod file:
  psql "$DATABASE_URL_PROD" -v ON_ERROR_STOP=1 -f "{{file}}"

