import HttpStatus from "http-status-codes";
import AuthServices from "./auth/auth_services";
const Auth = new AuthServices();
class APIResponseBuilder {
  auth_response = (message, current_friend, meta) => {
    //
    return {
      message: message || "Success",
      refresh_token: Auth.build_token(current_friend).refresh_token,
      access_token: Auth.build_token(current_friend).access_token,
      status: HttpStatus.OK,
      data: [current_friend],
      meta: meta,
    };
  };

  // company_response = async (message, meta) => {
  //   return {
  //     message: message || "Success",
  //     status: HttpStatus.OK,
  //     data: [current_company],
  //     meta: meta,
  //   };
  // };

  relationship_response = (message, meta, data) => {
    // console.log("data");
    // console.log(data);
    // console.log("data");
    return {
      message: message || "Success",
      status: HttpStatus.OK,
      meta: meta || {},
      data: data || [],
    };
  };

  tweet_response = (message, meta) => {
    return {
      message: message || "Success",
      status: HttpStatus.OK,
      meta: meta || {},
    };
  };

  favourite_response = (message, status, count) => {
    return {
      message: message || "Success",
      status: status || HttpStatus.OK,
      count: count,
    };
  };

  feed_response = (message, meta, data) => {
    // console.log("data");
    // console.log(data);
    // console.log("data");
    return {
      message: message || "Success",
      status: HttpStatus.OK,
      meta: meta || {},
      data: data || [],
    };
  };
}

export default APIResponseBuilder;
