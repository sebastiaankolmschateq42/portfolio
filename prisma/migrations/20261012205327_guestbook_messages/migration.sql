-- CreateTable
CREATE TABLE "guestbook_messages" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guestbook_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guestbook_messages_is_approved_created_at_idx" ON "guestbook_messages"("is_approved", "created_at");
