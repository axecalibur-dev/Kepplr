import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import { getGraphQLRateLimiter } from "graphql-rate-limit";
const rateLimiter = getGraphQLRateLimiter({ identifyContext: (ctx) => ctx.id });
import { rateLimit } from "express-rate-limit";

export const rate_limit_requests = async (
  parent,
  args,
  context,
  info,
  req_threshold,
  for_seconds,
) => {
  const errorMessage = await rateLimiter(
    { parent, args, context, info },
    { max: req_threshold, window: `${for_seconds}s` },
  );

  if (errorMessage)
    throw new GraphQLError(
      "Too many requests for otp made. Please try again later.",
      {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.TOO_MANY_REQUESTS,
        },
      },
    );
};

export const express_limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many request send for this resource. Please try again after few minutes.",
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
});
