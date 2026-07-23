-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "starter_code" TEXT NOT NULL,
    "solution_code" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_results" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "submitted_code" TEXT NOT NULL,
    "is_success" BOOLEAN NOT NULL DEFAULT false,
    "pdf_url" VARCHAR(255),
    "error_log" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_history" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" INTEGER,
    "session_id" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "exercise_results_user_id_idx" ON "exercise_results"("user_id");

-- CreateIndex
CREATE INDEX "exercise_results_exercise_id_idx" ON "exercise_results"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_lesson_id_key" ON "user_progress"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "ai_chat_history_user_id_idx" ON "ai_chat_history"("user_id");

-- CreateIndex
CREATE INDEX "ai_chat_history_session_id_idx" ON "ai_chat_history"("session_id");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_history" ADD CONSTRAINT "ai_chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_history" ADD CONSTRAINT "ai_chat_history_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
