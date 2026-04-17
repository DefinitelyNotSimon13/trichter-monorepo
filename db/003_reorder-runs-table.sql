BEGIN;

ALTER TABLE runs RENAME TO runs_old;

CREATE TABLE runs
(
    id                 uuid primary key default gen_random_uuid(),
    "userId"           text references "user" on delete cascade,

    rate               double precision not null,
    volume             double precision not null,
    duration           double precision not null,

    image              text null,

    "createdDate"      timestamptz not null default now(),
    "lastModifiedDate" timestamptz not null default now(),

    version            bigint not null
);

INSERT INTO runs (
    id, "userId",
    rate, volume, duration,
    image,
    "createdDate", "lastModifiedDate",
    version
)
SELECT
    id, "userId",
    rate, volume, duration,
    image,
    "createdDate", "lastModifiedDate",
    version
FROM runs_old;


CREATE TRIGGER runs_set_last_modified_at
BEFORE UPDATE ON runs
FOR EACH ROW
EXECUTE FUNCTION set_runs_last_modified_at();

-- drop old table
DROP TABLE runs_old;

CREATE INDEX runs_createdDate_desc_idx
    ON runs ("createdDate" DESC);

CREATE INDEX runs_rate_desc_idx
    ON runs (rate DESC);

CREATE INDEX runs_userId_createdDate_desc_idx
    ON runs ("userId", "createdDate" DESC);

CREATE INDEX runs_userId_rate_desc_idx
    ON runs ("userId", rate DESC);

COMMIT;
