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
    sign_up: (parent, { input }) => {
      return Controller.sign_up_user(parent, { input });
    },

    login: (parent, { input }, context, info) => {
      return Controller.login_user(parent, { input }, context, info);
    },

    reset_password: (parent, { input }) => {
      return auth.reset_password(parent, { input });
    },

    set_password: (parent, { input }) => {
      return auth.initiate_reset_password_service(parent, { input });
    },

    updateFriend: async (parent, { input }) => {
      return Controller.update_user(parent, { input });
    },
  },
};
