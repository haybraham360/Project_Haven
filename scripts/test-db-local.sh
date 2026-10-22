#!/usr/bin/env bash
# Runs the database access-policy tests against a throwaway LOCAL PostgreSQL
# database (no Supabase project needed). Recreates the database each run.
set -euo pipefail

DB_NAME="${HAVEN_LOCAL_TEST_DB:-haven_policy_test}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

dropdb --if-exists "$DB_NAME"
createdb "$DB_NAME"
psql -v ON_ERROR_STOP=1 -q -d "$DB_NAME" \
  -f "$ROOT/supabase/tests/local-auth-shim.sql" \
  -f "$ROOT"/supabase/migrations/*.sql

TEST_DATABASE_URL="postgresql:///$DB_NAME" pnpm exec vitest run --config "$ROOT/vitest.db.config.mts"
