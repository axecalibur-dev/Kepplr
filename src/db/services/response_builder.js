import HttpStatus from "http-status-codes";
import AuthServices from "./auth/auth_services";
const Auth = new AuthServices();
class APIResponseBuilder {
  auth_response = async (message, current_friend, meta) => {
    return {
      message: message || "Success",
      refresh_token: await Auth.build_token(current_friend).refresh_token,
      access_token: await Auth.build_token(current_friend).access_token,
      status: HttpStatus.OK,
      data: [current_friend],
      meta: meta,
    };
  };
}

export default APIResponseBuilder;
