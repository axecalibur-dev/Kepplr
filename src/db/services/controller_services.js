import { Friends } from "../dbConnector.js";
import HttpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { ServiceException } from "../../Exceptions/custom_exceptions.js";
import AuthServices from "./auth/auth_services.js";
const Auth = new AuthServices();
import APIResponseBuilder from "./response_builder.js";
import SlackService from "../../slack/slack_service.js";
const APIResponse = new APIResponseBuilder();
const Slack = new SlackService();

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

    throw new ServiceException(
      "Sign Up Failed.",
      "User with this email already exists.",
      HttpStatus.BAD_REQUEST,
    );
  };

  login_user = async (parent, { input }, context, info) => {
    const current_user = await Friends.findOne({
      email: input.email,
    });

    if (!current_user) {
      throw new ServiceException(
        "Login Failed.",
        "User with this email was not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(input.password, current_user.password))) {
      throw new ServiceException(
        "Login Failed.",
        "Invalid Password.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return APIResponse.auth_response("Login Success", current_user, {});
  };

  regenerate_token = async (parent, decoded_token, context, info) => {
    if (decoded_token.token_type === "Bearer/Access") {
      throw new ServiceException(
        "Token Service Failed.",
        "Invalid Token type passed. Please provide Refresh Token.",
        HttpStatus.BAD_REQUEST,
      );
    }
    const current_user = await Friends.findById(decoded_token.friend_id);
    if (!current_user) {
      throw new ServiceException(
        "Token Service Failed.",
        "User for this token was not found.",
        HttpStatus.NOT_FOUND,
      );
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
      return {
        message: `An exception occurred.`,
        status: HttpStatus.BAD_REQUEST,
        data: null,
        meta: {},
      };
    }
  };
}
export default ControllerServices;
