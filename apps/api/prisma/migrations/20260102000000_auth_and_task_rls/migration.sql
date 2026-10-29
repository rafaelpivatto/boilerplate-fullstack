CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

ALTER TABLE "Task" ADD COLUMN "ownerId" TEXT;
CREATE INDEX "Task_ownerId_idx" ON "Task"("ownerId");
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" FORCE ROW LEVEL SECURITY;

CREATE POLICY "task_select_policy" ON "Task"
  FOR SELECT USING (
    current_setting('app.bypass_rls', true) = 'true'
    OR "ownerId" = current_setting('app.user_id', true)
  );

CREATE POLICY "task_insert_policy" ON "Task"
  FOR INSERT WITH CHECK (
    current_setting('app.bypass_rls', true) = 'true'
    OR "ownerId" = current_setting('app.user_id', true)
  );

CREATE POLICY "task_update_policy" ON "Task"
  FOR UPDATE
  USING (
    current_setting('app.bypass_rls', true) = 'true'
    OR "ownerId" = current_setting('app.user_id', true)
  )
  WITH CHECK (
    current_setting('app.bypass_rls', true) = 'true'
    OR "ownerId" = current_setting('app.user_id', true)
  );

CREATE POLICY "task_delete_policy" ON "Task"
  FOR DELETE USING (
    current_setting('app.bypass_rls', true) = 'true'
    OR "ownerId" = current_setting('app.user_id', true)
  );
