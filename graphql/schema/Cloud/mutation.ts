import { arg, extendType, nonNull, stringArg } from "nexus";
import { encryptData } from "@/lib/encryption";

export const CloudMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createCloudIntegration", {
            type: "CloudIntegration",
            args: {
                provider:nonNull(arg({type:'CloudProvider'})),
                aws:arg({type:"AWSIntegrationInput"})
            },
            resolve:async(_,{provider,aws},ctx)=>{
                const {user} = ctx
                if(!user){
                    throw new Error("Unauthorized")
                }
                let integrationRequestBody:Record<string,string>={};

                if(provider === 'AWS'&& aws){
                    if(!aws.accessKeyId || !aws.secretAccessKey || !aws.region){
                        throw new Error("AWS credentials are required")
                    }
                    const awsIntegration = await ctx.prisma.aWSIntegration.create({
                        data:{
                         accessKeyId:encryptData(aws.accessKeyId),
                         secretAccessKey:encryptData(aws.secretAccessKey),
                         region:aws.region
                        }
                    })
                    integrationRequestBody.awsId=awsIntegration.id
                }
                if(!integrationRequestBody.awsId && !integrationRequestBody.gcpId && !integrationRequestBody.azureId){
                    throw new Error("At least one cloud provider integration is required")
                }
                const cloudIntegration = await ctx.prisma.cloudIntegration.create({
                    data:{
                        provider,
                        userId:user.id,
                        ...integrationRequestBody
                    }
                })
                return cloudIntegration
            }
        })
    }
})