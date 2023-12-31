import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import AuthServices from "./auth/auth_services";
const Auth = new AuthServices();
import APIResponseBuilder from "./response_builder";
import SlackService from "../../slack/slack_service";
const APIResponse = new APIResponseBuilder();
const Slack = new SlackService();

import { GraphQLError } from "graphql";
import ProfilePictureController from "../../repository/media/profile_pictures/profile_picture_controller";
import { RegisteredQueues } from "../../bull/queues";
import { TaskRegistry } from "../../bull/task_registry";
const ProfilePicture = new ProfilePictureController();

import BullMessageQueueService from "../../bull/bull_service";
const BullTasks = new BullMessageQueueService();

import MarketingTasks from "../../bull/tasks/send_welcome_email_task";
import MemcachedService from "../../memcached/memcached_service";
import { BlacklistedTokens } from "../schema/blacklistedTokens";
import jwt from "jsonwebtoken";
import { Users } from "../../models/users";
import { Op } from "sequelize";

const MarketingTask = new MarketingTasks();

const Memcached = new MemcachedService();

class ControllerServices {
  sign_up_user = async (parent, { input }) => {
    const current_user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: input.email },
          { username_handle: input.username_handle },
        ],
      },
    });
    if (!current_user) {
      const current_friend = await Users.create({
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        language: input.language,
        username_handle: input.username_handle,
        age: input.age,
        profile_picture: await ProfilePicture.default_profile_picture(),
        email: input.email,
        contacts: input.contacts,
        password: await Auth.hash_password(input.password),
      });

      // fire welcome email task
      await BullTasks.send_task(
        RegisteredQueues.Marketing_Queue,
        TaskRegistry.Send_Welcome_Email,
        MarketingTask.send_welcome_email_task,
        [
          {
            input_email: input.email,
            user_name: input.firstName,
          },
        ],
      );
      return APIResponse.auth_response("Sign Up Success", current_friend, {});
    }

    throw new GraphQLError(`User for these credentials already exists.`, {
      extensions: {
        name: "ServiceException",
        status: HttpStatus.BAD_REQUEST,
      },
    });
  };

  login_user = async (parent, { input }, context, info) => {
    const current_user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: input.identity },
          { username_handle: input.identity },
        ],
      },
    });

    if (!current_user) {
      throw new GraphQLError("User for this identity was not found.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (!(await bcrypt.compare(input.password, current_user.password))) {
      throw new GraphQLError("Invalid password provided.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    return APIResponse.auth_response("Login Success", current_user, {});
  };

  regenerate_token = async (parent, decoded_token, context, info) => {
    if (decoded_token.token_type === "Bearer/Access") {
      throw new GraphQLError(
        "Invalid token provided. Please provide refresh token.",
        {
          extensions: {
            name: "ServiceException",
            status: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
    const current_user = await Users.findOne({
      where: {
        id: decoded_token.user_id,
      },
    });
    if (!current_user) {
      throw new GraphQLError("User for this token was not found.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
    return APIResponse.auth_response("Tokens Refresh", current_user, {});
  };

  getOneUserByID = async (parent, decoded_token, context, info) => {
    try {
      const current_friends = await Users.findOne({
        where: {
          id: decoded_token.user_id,
        },
      });

      if (current_friends == null)
        return {
          message: "No data found",
          status: HttpStatus.NOT_FOUND,
          data: null,
          meta: {},
        };
      else {
        if (!current_friends.sharePrimaryContactEmail) {
          current_friends["email"] = null;
        }
        return {
          message: "Friend found",
          status: HttpStatus.OK,
          data: [current_friends],
          meta: {},
        };
      }
    } catch (err) {
      throw new GraphQLError("Something went wrong.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
  };
  logout = async (parent, encoded_token, context, info) => {
    try {
      const legitimate = jwt.verify(encoded_token, process.env.JWT_SECRET);
      const token = await BlacklistedTokens.findOne({
        token_string: encoded_token,
      });

      if (token == null) {
        const blacklisted = new BlacklistedTokens({
          token_string: encoded_token,
        });
        await blacklisted.save();
        return {
          message: "Logged out successfully.",
          status: HttpStatus.OK,
        };
      } else {
        return {
          message: "Logged out successfully.",
          status: HttpStatus.OK,
        };
      }
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new GraphQLError(
          "Sorry we could not verify your identity please login and try again.",
          {
            extensions: {
              name: "ServiceException",
              status: HttpStatus.NOT_FOUND,
            },
          },
        );
      }
      throw new GraphQLError("Something went wrong.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
  };
}
export default ControllerServices;
