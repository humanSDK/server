-- CreateEnum
CREATE TYPE "CloudProvider" AS ENUM ('AWS', 'GCP', 'AZURE');

-- CreateTable
CREATE TABLE "CloudIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "CloudProvider" NOT NULL,
    "awsId" TEXT,
    "gcpId" TEXT,
    "azureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CloudIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AWSIntegration" (
    "id" TEXT NOT NULL,
    "accessKeyId" TEXT NOT NULL,
    "secretAccessKey" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "AWSIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GCPIntegration" (
    "id" TEXT NOT NULL,
    "serviceAccountJson" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "GCPIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AzureIntegration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,

    CONSTRAINT "AzureIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudIntegration_awsId_key" ON "CloudIntegration"("awsId");

-- CreateIndex
CREATE UNIQUE INDEX "CloudIntegration_gcpId_key" ON "CloudIntegration"("gcpId");

-- CreateIndex
CREATE UNIQUE INDEX "CloudIntegration_azureId_key" ON "CloudIntegration"("azureId");

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_awsId_fkey" FOREIGN KEY ("awsId") REFERENCES "AWSIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_gcpId_fkey" FOREIGN KEY ("gcpId") REFERENCES "GCPIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_azureId_fkey" FOREIGN KEY ("azureId") REFERENCES "AzureIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
