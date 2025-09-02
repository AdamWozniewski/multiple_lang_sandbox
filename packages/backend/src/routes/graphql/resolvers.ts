import { PubSub } from "graphql-subscriptions";
import { User } from "@mongo/models/user.js";
import { RoleService } from "@services/Role-Services.js";

const pubSub = new PubSub();
const roleService = new RoleService();

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, ctx: any) => {
      return await User.findById(id);
    },
    users: async (_parent, _args, _ctx) => {
      try {
        return await User.find();
      } catch (err) {
        console.error("Błąd przy pobieraniu users:", err);
        throw new Error("Nie udało się pobrać listy użytkowników");
      }
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      try {
        const roles = await roleService.getDefaultUserRole();
        const user = await User.create({ ...args, roles });
        await pubSub.publish("USER_CREATED", { userCreated: user });
        return await user.save();
      } catch (error: any) {
        if (error.name === "ValidationError") {
          throw new Error("Błąd walidacji danych");
        }
        if (error.code === 11000) {
          throw new Error("Email już istnieje");
        }
        throw new Error("Nie udało się utworzyć użytkownika");
      }
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(["USER_CREATED"]),
    },
  },
};
