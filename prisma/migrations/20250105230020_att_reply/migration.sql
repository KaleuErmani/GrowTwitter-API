/*
  Warnings:

  - Added the required column `conteudo` to the `replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "conteudo" VARCHAR(500) NOT NULL,
ADD COLUMN     "tipo" "tipoPost" NOT NULL;
