-- AlterTable
ALTER TABLE "File" ADD COLUMN     "folderId" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("folderId") ON DELETE SET NULL ON UPDATE CASCADE;
