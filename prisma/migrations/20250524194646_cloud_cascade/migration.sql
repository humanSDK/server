-- DropForeignKey
ALTER TABLE "CloudIntegration" DROP CONSTRAINT "CloudIntegration_awsId_fkey";

-- DropForeignKey
ALTER TABLE "CloudIntegration" DROP CONSTRAINT "CloudIntegration_azureId_fkey";

-- DropForeignKey
ALTER TABLE "CloudIntegration" DROP CONSTRAINT "CloudIntegration_gcpId_fkey";

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_awsId_fkey" FOREIGN KEY ("awsId") REFERENCES "AWSIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_gcpId_fkey" FOREIGN KEY ("gcpId") REFERENCES "GCPIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudIntegration" ADD CONSTRAINT "CloudIntegration_azureId_fkey" FOREIGN KEY ("azureId") REFERENCES "AzureIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
