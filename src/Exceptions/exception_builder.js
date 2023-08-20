import HttpStatus from "http-status-codes";

class ExceptionResponseBuilder {
  throw_error_as_response = (error) => {
    return {
      name: error.extensions["name"] || "UnknownException",
      message: error.message || "An exception has occurred.",
      status: error.extensions["status"] || HttpStatus.BAD_REQUEST,
      data: error.extensions["data"] || {},
      meta: error.extensions["meta"] || {},
    };
  };
}

export default ExceptionResponseBuilder;
