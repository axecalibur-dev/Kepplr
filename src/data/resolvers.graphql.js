import AuthServices from "../db/services/auth/auth_services";
import ControllerServices from "../db/services/controller_services";
const Controller = new ControllerServices();
import { getGraphQLRateLimiter } from "graphql-rate-limit";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import { rate_limit_requests } from "./rate_limit";
const rateLimiter = getGraphQLRateLimiter({ identifyContext: (ctx) => ctx.id });

const auth = new AuthServices();
export const resolvers = {
  Query: {
    profile: async (parent, args, context, info) => {
      return await Controller.getOneUserByID(
        parent,
        auth.verifyToken(context.authorization),
        context,
        info,
      );
    },

    regenerate_token: async (parent, args, context, info) => {
      return await Controller.regenerate_token(
        parent,
        auth.verifyToken(context.authorization),
        context,
        info,
      );
    },
  },

  Mutation: {
    sign_up: async (parent, args, context, info) => {
      // await rate_limit_requests(parent, args, context, info);
      return await Controller.sign_up_user(parent, args);
    },

    login: async (parent, args, context, info) => {
      return await Controller.login_user(parent, args, context, info);
    },

    reset_password: async (parent, args, context, info) => {
      await rate_limit_requests(
        parent,
        args,
        context,
        info,
        process.env.REQUESTS_THRESHOLD,
        process.env.FOR_SECONDS,
      );
      return await auth.reset_password(parent, args);
    },

    set_password: async (parent, args) => {
      return await auth.initiate_reset_password_service(parent, args);
    },

    updateFriend: async (parent, args) => {
      return await Controller.update_user(parent, args);
    },
  },
};
