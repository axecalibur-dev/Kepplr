const HttpStatus = require("http-status-codes");

class AuthMiddleware {
  auth = (req, res, next) => {
    next();
    return true;
  };
}

export default AuthMiddleware;
