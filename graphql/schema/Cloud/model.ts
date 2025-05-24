import { enumType, inputObjectType, objectType } from "nexus";
import * as np from "nexus-prisma";

export const CloudProvider = enumType(np.CloudProvider);


export const CloudIntegration = objectType({
  name: np.CloudIntegration.$name,
  definition(t) {
    t.field(np.CloudIntegration.id)
    t.field(np.CloudIntegration.userId)
    t.field(np.CloudIntegration.provider)
    t.field(np.CloudIntegration.awsId)
    t.field(np.CloudIntegration.gcpId)
    t.field(np.CloudIntegration.azureId)
    t.field(np.CloudIntegration.createdAt)
  }
})



export const AWSIntegrationInput=inputObjectType({
  name:"AWSIntegrationInput",
  definition(t){
    t.string("accessKeyId")
    t.string("secretAccessKey")
    t.string("region")
  }
})