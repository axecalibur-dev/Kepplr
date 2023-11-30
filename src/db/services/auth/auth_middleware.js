import { BlacklistedTokens } from "../../schema/blacklistedTokens";
import { GraphQLError } from "graphql/index";

const HttpStatus = require("http-status-codes");

class AuthMiddleware {
  auth = (req, res, next) => {
    next();
    return true;
  };

  checkBlacklisted = async (context) => {
    const blacklisted = await BlacklistedTokens.findOne({
      token_string: context.authorization,
    });

    if (blacklisted) {
      throw new GraphQLError(
        "We could not verify your identify please login again.",
        {
          extensions: {
            name: "ServiceException",
            status: HttpStatus.BAD_REQUEST,
          },
        },
      );
    } else {
      return true;
    }
  };
}

export default AuthMiddleware;
