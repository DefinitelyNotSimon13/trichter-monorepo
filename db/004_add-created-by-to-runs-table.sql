BEGIN;

ALTER TABLE runs
    ADD COLUMN "createdById" text;

ALTER TABLE runs
    ADD CONSTRAINT runs_created_by_fk
        FOREIGN KEY ("createdById")
        REFERENCES "user"(id)
        ON DELETE SET NULL;

UPDATE runs
SET "createdById" = "userId"
WHERE "createdById" IS NULL;

COMMIT;
