import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { typeDefs } from "../../../graphql/schema";
import { resolver } from "@/graphql/resolver";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

const server = new ApolloServer({
  typeDefs,
  resolvers: resolver,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {

    const user = {
      id: "admin-fury",
      role: "MANAGER",
      country: "INDIA",
    };

    return { req, prisma, user };
  },
});

export { handler as GET, handler as POST };