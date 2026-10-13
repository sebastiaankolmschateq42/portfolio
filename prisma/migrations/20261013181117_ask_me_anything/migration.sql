-- DropTable
DROP TABLE "guestbook_messages";

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "answer" VARCHAR(2000),
    "answered_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_created_at_idx" ON "questions"("created_at");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

