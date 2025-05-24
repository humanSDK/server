import { makeSchema } from "nexus"
import { join } from "path"
import * as Utils from "../utils"
import * as User from "./User"

export const schema = makeSchema({
  types: [ 
    ...Object.values(Utils),
    ...Object.values(User)
 ],
  outputs: {
    schema: join(process.cwd(), "graphql/generated/schema.graphql"),
    typegen: join(process.cwd(), "graphql/generated/nexus-typegen.ts"),
  },
  contextType: {
    module: join(process.cwd(), "graphql", "context.ts"),
    export: "Context",
  },
})
