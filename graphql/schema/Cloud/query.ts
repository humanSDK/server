import { extendType, nonNull } from "nexus"

export const CloudQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getCloudIntegrations", {
      type: "CloudIntegration",
      resolve: async (_, __, ctx) => {
        const { user } = ctx
        if (!user) {
          throw new Error("Unauthorized")
        }

        const integrations = await ctx.prisma.cloudIntegration.findMany({
          where: {
            userId: user.id
          }
        })

        return integrations
      }
    })
  }
}) 