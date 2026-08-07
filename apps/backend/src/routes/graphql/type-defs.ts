import { gql } from "graphql-tag";

export const typeDefs = gql`
  directive @auth(roles: [String!]) on FIELD_DEFINITION

  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    fullName: String
    activate: Boolean
  }

  type Query {
    user(id: ID!): User @auth(roles: ["admin", "user"])
    users: [User!]! @auth(roles: ["admin"])
  }

  type Mutation {
    createUser(email: String!, password: String!): User
  }

  type Subscription {
    userCreated: User
  }
`;
