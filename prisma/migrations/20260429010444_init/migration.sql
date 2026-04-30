-- CreateTable
CREATE TABLE "ConversionHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalFormat" TEXT NOT NULL,
    "outputFormat" TEXT NOT NULL,
    "originalSize" INTEGER NOT NULL,
    "outputSize" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");
