import ControllerServices from "../db/services/controller_services";
import AuthServices from "../db/services/auth/auth_services";
import { AuthenticationException } from "../Exceptions/custom_exceptions";
const Controller = new ControllerServices();

const auth = new AuthServices();
export const resolvers = {
  Query: {
    profile: async (parent, { input }, context, info) => {
      return await Controller.getOneUserByID(
        parent,
        auth.verifyToken(context.headers.authorization),
        context,
        info,
      );
    },

    regenerate_token: async (parent, { input }, context, info) => {
      return await Controller.regenerate_token(
        parent,
        auth.verifyToken(context.headers.authorization),
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
