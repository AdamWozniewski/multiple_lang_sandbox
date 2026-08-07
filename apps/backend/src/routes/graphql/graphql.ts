import type { Server } from "node:http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { config } from "@config";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { Link } from "@mongo/models/link";
import { UserRole } from "@mongo/models/roles";
import { User } from "@mongo/models/user";
import { DEVELOPMENT } from "@static/env";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import type { GraphQLSchema } from "graphql";
import { defaultFieldResolver } from "graphql";
import { useServer } from "graphql-ws/use/ws";
import jwt from "jsonwebtoken";
import { models } from "mongoose";
import { WebSocketServer } from "ws";
import { resolvers } from "./resolvers";
import { typeDefs } from "./type-defs";

export type ModelMap = Record<string, any>;
const isDev = config.env === DEVELOPMENT;

const applyAuthDirective = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const auth = getDirective(schema, fieldConfig, "auth")?.[0];
      if (!auth) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig;
      fieldConfig.resolve = async (src, args, ctx, info) => {
        const user = ctx.user;
        if (!user || !auth.roles.includes(user.role)) {
          throw new Error("Brak dostępu");
        }
        return resolve(src, args, ctx, info);
      };
      return fieldConfig;
    },
  });
};

export const setupGraphQL = async (app: Application, httpServer: Server) => {
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  schema = applyAuthDirective(schema);

  let wsCleanup: () => void;
  const server = new ApolloServer({
    schema,
    introspection: isDev,
    plugins: [
      isDev
        ? ApolloServerPluginLandingPageGraphQLPlayground()
        : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              wsCleanup?.();
            },
          };
        },
      },
    ],
  });
  await server.start();

  const createContext = async (params: {
    req?: any;
    connectionParams?: any;
  }) => {
    const base = { User, Link, UserRole };
    if (isDev) {
      return { ...base, user: { id: "dev-admin", role: "admin" } };
    }
    let token: string | null = null;
    if (params.req) {
      const authHeader = String(params.req.headers.authorization || "");
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    } else if (params.connectionParams?.token) {
      token = params.connectionParams.token;
    }
    if (token) {
      try {
        const payload = jwt.verify(token, config.jwtSecret) as {
          userId: string;
          role: string;
        };
        const user = await models.User.findById(payload.userId);
        return { ...base, user };
      } catch {
        return { ...base, user: null };
      }
    }
    return { ...base, user: null };
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    (req, _res, next) => {
      if (req.method === "GET") req.body = {};
      next();
    },
    express.json({ type: "*/*" }),
    expressMiddleware(server, { context: createContext }),
  );

  if (isDev) {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });
    const cleanup = useServer({ schema, context: createContext }, wsServer);
    wsCleanup = cleanup.dispose;
  }
};
