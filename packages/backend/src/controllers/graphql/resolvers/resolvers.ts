import { typeDefs } from '../defs/defs.js';

export const resolvers = {
  Query: {
    users: () => typeDefs,
  },
};