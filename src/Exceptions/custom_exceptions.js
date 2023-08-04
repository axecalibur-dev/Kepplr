import HttpStatus from "http-status-codes";

class ServiceException extends Error {
  constructor(name, message, status) {
    super(message);

    this.name = name;
    this.message = message;
    this.statusCode = status || HttpStatus.BAD_REQUEST;
  }
}
export { ServiceException };
