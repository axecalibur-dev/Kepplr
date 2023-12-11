import AuthServices from "../db/services/auth/auth_services";
import ControllerServices from "../db/services/controller_services";
const Controller = new ControllerServices();

import RelationshipControllers from "../db/services/relationship_controller";
import HomeControllers from "../db/services/feed_controller";
import TweetControllers from "../db/services/tweet_controller";
const TweetController = new TweetControllers();
const RelationshipController = new RelationshipControllers();
const HomeController = new HomeControllers();
import { getGraphQLRateLimiter } from "graphql-rate-limit";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import { rate_limit_requests } from "./rate_limit";
import { BlacklistedTokens } from "../db/schema/blacklistedTokens";
import AuthMiddleware from "../db/services/auth/auth_middleware";
const rateLimiter = getGraphQLRateLimiter({ identifyContext: (ctx) => ctx.id });

const auth = new AuthServices();
const authMiddleware = new AuthMiddleware();
export const resolvers = {
  Query: {
    profile: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await Controller.getOneUserByID(
        parent,
        await auth.verifyToken(context.authorization),
        context,
        info,
      );
    },

    log_out: async (parent, args, context, info) => {
      return await Controller.logout(
        parent,
        String(context.authorization),
        context,
        info,
      );
    },

    regenerate_token: async (parent, args, context, info) => {
      return await Controller.regenerate_token(
        parent,
        await auth.verifyToken(context.authorization),
        context,
        info,
      );
    },

    people_i_follow: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await RelationshipController.people_i_follow(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    people_who_follow_me: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await RelationshipController.people_who_follow_me(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
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

    // tweet specific routes

    post_tweet: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await TweetController.post_a_new_tweet(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    edit_tweet: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await TweetController.edit_tweet(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },
    like_tweet: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await TweetController.like_tweet(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    dislike_tweet: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await TweetController.dislike_tweet(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    delete_tweet: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await TweetController.delete_tweet(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    // relationship specific routes

    // follow_someone

    follow_someone: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await RelationshipController.follow_someone(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },
    // unfollow someone

    unfollow_someone: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await RelationshipController.unfollow_someone(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },

    // my followers
    // people i follow

    // feed specific routes
    home: async (parent, args, context, info) => {
      await authMiddleware.checkBlacklisted(context);
      return await HomeController.get_home_feed(
        parent,
        args,
        context,
        info,
        await auth.verifyToken(context.authorization),
      );
    },
  },
};
