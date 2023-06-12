/*
  Warnings:

  - Added the required column `type` to the `LabType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_LabType" ("description", "id", "title") SELECT "description", "id", "title" FROM "LabType";
DROP TABLE "LabType";
ALTER TABLE "new_LabType" RENAME TO "LabType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
