export const typeDefs = `#graphql
  type User {
    firstName: String
    email: String
  }

  type Query {
    users: [User]
  }
`;