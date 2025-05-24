// pages/api/graphql.ts

import { createContext } from "../../../graphql/context";
import { schema } from "../../../graphql/schema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
const server = new ApolloServer({ schema });

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const context :any= createContext({ req, res });
    return context;
  },
});
