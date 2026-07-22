-- CreateTable
CREATE TABLE "SavedAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedAddress_userId_idx" ON "SavedAddress"("userId");

-- AddForeignKey
ALTER TABLE "SavedAddress" ADD CONSTRAINT "SavedAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: migrate each user's existing single defaultAddress into the new
-- table as their default. Empty shadow DB makes this a no-op during diffing.
INSERT INTO "SavedAddress" ("id", "userId", "address", "isDefault", "createdAt")
SELECT gen_random_uuid()::text, "id", "defaultAddress", true, CURRENT_TIMESTAMP
FROM "User"
WHERE "defaultAddress" IS NOT NULL AND length(trim("defaultAddress")) > 0;
