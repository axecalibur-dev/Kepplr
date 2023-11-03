import { Posts } from "../schema/posts";
import APIResponseBuilder from "./response_builder";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
const APIResponse = new APIResponseBuilder();

class TweetController {
  post_a_new_tweet = async (
    parent,
    { input },
    context,
    info,
    decoded_token,
  ) => {
    // console.log(decoded_token);
    const post = new Posts({
      post_string: input["tweet_string"],
      friend: decoded_token.friend_id,
    });

    const tweeted = await post.save();
    return APIResponse.tweet_response("Tweet posted success", {});
  };
  delete_tweet = async (parent, { input }, context, info, decoded_token) => {
    console.log(input);
    const deleted = await Posts.findOneAndDelete({
      _id: input["tweet_id"],
      friend: decoded_token.friend_id,
    });

    console.log(deleted);

    if (!deleted) {
      throw new GraphQLError(
        "No tweet found / you cannot perform this operation.",
        {
          extensions: {
            name: "ServiceException",
            status: HttpStatus.BAD_REQUEST,
          },
        },
      );
    } else {
      return APIResponse.tweet_response("Tweet deleted success", {});
    }
  };
  edit_tweet = async (parent, args, context, info) => {};
  like_tweet = async (parent, args, context, info) => {};
  retweet_tweet = async (parent, args, context, info) => {};
}

export default TweetController;
