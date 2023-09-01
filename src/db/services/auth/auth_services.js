import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Friends } from "../../dbConnector";
import HttpStatus from "http-status-codes";
import Utils from "../../../utils/utils";
import GlobalConstants from "../../../globals/constants/global_constants";
import { RegisteredQueues } from "../../../bull/queues";
import { TaskRegistry } from "../../../bull/task_registry";
import BullMessageQueueService from "../../../bull/bull_service";
import ServiceTasks from "../../../bull/tasks/send_password_recovery_task";
import { redisService } from "../../../redis/redis";

const utils = new Utils();
const BullTasks = new BullMessageQueueService();
const ServiceTask = new ServiceTasks();
class AuthServices {
  build_token = (user) => {
    const access_token = jwt.sign(
      {
        token_type: "Bearer/Access",
        email: user.email,
        friend_id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const refresh_token = jwt.sign(
      {
        token_type: "Refresh",
        email: user.email,
        friend_id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  };
  hash_password = async (password) => {
    return await bcrypt.hash(
      password,
      await bcrypt.genSalt(GlobalConstants.Bcrypt_Rounds),
    );
  };
  verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  reset_password = async (parent, { input }) => {
    const system_otp = await utils.generateRandomOTP();
    const user = await Friends.findOne({
      email: input.email,
    });

    if (!user) {
      console.log("No such user found.");
      return {
        message: "No such friend with provided email.",
        status: HttpStatus.NOT_FOUND,
        data: null,
        meta: {},
      };
    }

    const redis = await redisService();
    await redis.setEx(
      String(user.email),
      process.env.REDIS_DEFAULT_EXPIRATION,
      String(system_otp),
    );

    await BullTasks.send_task(
      RegisteredQueues.Service_Queue,
      TaskRegistry.Send_Password_Recovery_Mail,
      ServiceTask.send_password_recovery_mail_task,
      [
        {
          input_email: input.email,
          system_otp: system_otp,
        },
      ],
    );

    return {
      message: `A mail has been sent to ${input.email}`,
      status: HttpStatus.OK,
      data: null,
      meta: {},
    };
  };

  initiate_reset_password_service = async (parent, { input }) => {
    const redis = await redisService();
    const otp = await redis.get(String(input.email));
    if (!otp || otp !== input.password_request_otp) {
      return {
        message: "Invalid OTP. Please try again or resend OTP.",
        status: HttpStatus.BAD_REQUEST,
        data: null,
        meta: {},
      };
    }
    const auth = new AuthServices();
    if (input["new_password"] === input["reenter_password"]) {
      const user = await Friends.findOneAndUpdate(
        {
          email: input.email,
        },
        {
          password: await auth.hash_password(input["new_password"]),
        },
      );

      if (!user) {
        return {
          message: "Invalid credentials. Please try again.",
          status: HttpStatus.NOT_FOUND,
          data: null,
          meta: {},
        };
      } else {
        await redis.del(String(input.email));
        return {
          message: "Password Updated",
          status: HttpStatus.OK,
          data: null,
          meta: {
            email: user.email,
          },
        };
      }
    } else {
      return {
        message: "Passwords Do Not Match",
        status: HttpStatus.BAD_REQUEST,
        data: null,
        meta: {},
      };
    }
  };
}
export default AuthServices;
