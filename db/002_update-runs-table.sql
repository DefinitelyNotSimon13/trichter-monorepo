BEGIN;

-- Update columns to match backend better

ALTER TABLE runs
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN last_modified_at TIMESTAMPTZ;

UPDATE runs
SET last_modified_at = created_at
WHERE last_modified_at IS NULL;

ALTER TABLE runs
    ALTER COLUMN version DROP DEFAULT;

-- Switch to camelCase to match betterAuth tables

ALTER TABLE runs RENAME COLUMN user_id TO "userId";
ALTER TABLE runs RENAME COLUMN created_at TO "createdAt";
ALTER TABLE runs RENAME COLUMN last_modified_at TO "lastModifiedAt";

-- Make image nullable
ALTER TABLE runs
    ALTER COLUMN image DROP NOT NULL;

-- Convert createdAt from timestamp to timestamptz
-- Existing values are interpreted as Europe/Berlin local time.
ALTER TABLE runs
    ALTER COLUMN "createdAt" TYPE timestamptz
    USING "createdAt" AT TIME ZONE 'Europe/Berlin';

-- Ensure lastModifiedAt is timestamptz
ALTER TABLE runs
    ALTER COLUMN "lastModifiedAt" TYPE timestamptz
    USING "lastModifiedAt";

-- Add normalized numeric columns
ALTER TABLE runs
    ADD COLUMN rate double precision,
    ADD COLUMN volume double precision,
    ADD COLUMN duration double precision;

-- Backfill normalized columns from JSONB
UPDATE runs
SET
    rate = (data ->> 'rate')::double precision,
    volume = (data ->> 'volume')::double precision,
    duration = (data ->> 'duration')::double precision;

-- Enforce NOT NULL on normalized columns
ALTER TABLE runs
    ALTER COLUMN rate SET NOT NULL,
    ALTER COLUMN volume SET NOT NULL,
    ALTER COLUMN duration SET NOT NULL;

-- Backfill and enforce timestamp defaults / constraints
UPDATE runs
SET "lastModifiedAt" = COALESCE("lastModifiedDate", "createdAt");

ALTER TABLE runs
    ALTER COLUMN "createdAt" SET DEFAULT now(),
    ALTER COLUMN "lastModifiedAt" SET DEFAULT now(),
    ALTER COLUMN "lastModifiedAt" SET NOT NULL;

-- Drop old JSONB column
ALTER TABLE runs
    DROP COLUMN data;

-- Trigger function for automatic lastModifiedAt updates
CREATE OR REPLACE FUNCTION set_runs_last_modified_at()
RETURNS trigger AS
$$
BEGIN
    NEW."lastModifiedAt" := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace trigger if it already exists
DROP TRIGGER IF EXISTS runs_set_last_modified_at ON runs;

CREATE TRIGGER runs_set_last_modified_at
BEFORE UPDATE ON runs
FOR EACH ROW
EXECUTE FUNCTION set_runs_last_modified_at();

-- Add Indexes 

-- all runs sorted by newest first
CREATE INDEX IF NOT EXISTS runs_createdAt_desc_idx
    ON runs ("createdAt" DESC);

-- all runs sorted by rate
CREATE INDEX IF NOT EXISTS runs_rate_desc_idx
    ON runs (rate DESC);

-- runs by user, usually newest first
CREATE INDEX IF NOT EXISTS runs_userId_createdAt_desc_idx
    ON runs ("userId", "createdAt" DESC);

-- runs by user sorted by rate
CREATE INDEX IF NOT EXISTS runs_userId_rate_desc_idx
    ON runs ("userId", rate DESC);

COMMIT;
