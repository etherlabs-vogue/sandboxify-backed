/*
  Warnings:

  - You are about to drop the column `status` on the `Deployment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namespaceName" TEXT NOT NULL,
    "app" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL
);
INSERT INTO "new_Deployment" ("accessKey", "app", "id", "namespaceName", "secretKey") SELECT "accessKey", "app", "id", "namespaceName", "secretKey" FROM "Deployment";
DROP TABLE "Deployment";
ALTER TABLE "new_Deployment" RENAME TO "Deployment";
CREATE UNIQUE INDEX "Deployment_namespaceName_key" ON "Deployment"("namespaceName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
