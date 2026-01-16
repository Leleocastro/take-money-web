-- AlterTable
ALTER TABLE "User" ADD COLUMN "email" TEXT;

ALTER TABLE "User" ADD COLUMN "loginCode" TEXT;

ALTER TABLE "User" ADD COLUMN "loginCodeExpires" TIMESTAMP(3);

ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

-- Backfill placeholder emails for existing registros
UPDATE "User"
SET
    "email" = CONCAT(
        'placeholder+',
        "id",
        '@example.com'
    )
WHERE
    "email" IS NULL;

-- Enforce constraints
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");