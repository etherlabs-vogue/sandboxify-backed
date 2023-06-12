/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `LabType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LabType_title_key" ON "LabType"("title");
