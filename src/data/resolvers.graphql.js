import AuthServices from "../db/services/auth/auth_services";
import ControllerServices from "../db/services/controller_services";
const Controller = new ControllerServices();

const auth = new AuthServices();
export const resolvers = {
  Query: {
    profile: async (parent, { input }, context, info) => {
      return await Controller.getOneUserByID(
        parent,
        auth.verifyToken(context.authorization),
        context,
        info,
      );
    },

    regenerate_token: async (parent, { input }, context, info) => {
      return await Controller.regenerate_token(
        parent,
        auth.verifyToken(context.authorization),
        context,
        info,
      );
    },
  },

  Mutation: {
    sign_up: async (parent, { input }) => {
      return await Controller.sign_up_user(parent, { input });
    },

    login: async (parent, { input }, context, info) => {
      return await Controller.login_user(parent, { input }, context, info);
    },

    reset_password: async (parent, { input }) => {
      return await auth.reset_password(parent, { input });
    },

    set_password: async (parent, { input }) => {
      return await auth.initiate_reset_password_service(parent, { input });
    },

    updateFriend: async (parent, { input }) => {
      return await Controller.update_user(parent, { input });
    },
  },
};
