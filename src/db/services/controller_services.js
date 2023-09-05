import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import AuthServices from "./auth/auth_services";
const Auth = new AuthServices();
import APIResponseBuilder from "./response_builder";
import SlackService from "../../slack/slack_service";
const APIResponse = new APIResponseBuilder();
const Slack = new SlackService();

import { GraphQLError } from "graphql";
import { Friends } from "../schema/friendSchema";

class ControllerServices {
  sign_up_user = async (parent, { input }) => {
    const current_user = await Friends.findOne({
      email: input.email,
    });

    if (!current_user) {
      const newFriend = new Friends({
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        language: input.language,
        age: input.age,
        email: input.email,
        contacts: input.contacts,
        password: await Auth.hash_password(input.password),
      });

      const current_friend = await newFriend.save();
      return APIResponse.auth_response("Sign Up Success", current_friend, {});
    }

    throw new GraphQLError("User for this email already exists.", {
      extensions: {
        name: "ServiceException",
        status: HttpStatus.BAD_REQUEST,
      },
    });
  };

  login_user = async (parent, { input }, context, info) => {
    const current_user = await Friends.findOne({
      email: input.email,
    });

    if (!current_user) {
      throw new GraphQLError("User for this email was not found.", {
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
    const current_user = await Friends.findById(decoded_token.friend_id);
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
  update_user = async (parent, { input }) => {
    try {
      const current_friend = await Friends.findByIdAndUpdate(
        { _id: input.id },
        {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          language: input.language,
          age: input.age,
          email: input.email,
          updated_at: Date.now,
          contacts: input.contacts,
        },

        { new: true },
      );

      if (!current_friend) {
        return {
          message: "No such friend with provided ID.",
          status: HttpStatus.NOT_FOUND,
          data: null,
          meta: {},
        };
      } else {
        return {
          message: "Friend Updated.",
          status: HttpStatus.OK,
          data: current_friend,
          meta: {},
        };
      }
    } catch (err) {
      return {
        message: `An exception occurred.`,
        status: HttpStatus.BAD_REQUEST,
        data: null,
        meta: {},
      };
    }
  };

  getOneUserByID = async (parent, decoded_token, context, info) => {
    try {
      const current_friends = await Friends.findById({
        _id: decoded_token.friend_id,
      });
      if (current_friends == null)
        return {
          message: "No data found",
          status: HttpStatus.NOT_FOUND,
          data: null,
          meta: {},
        };
      else {
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
}
export default ControllerServices;
