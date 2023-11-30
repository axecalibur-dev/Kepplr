import { Posts } from "../schema/posts";
import APIResponseBuilder from "./response_builder";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import { ObjectId } from "mongodb";
import { PostActions } from "../schema/postActionSchema";
const APIResponse = new APIResponseBuilder();

class TweetController {
  post_a_new_tweet = async (
    parent,
    { input },
    context,
    info,
    decoded_token,
  ) => {
    if (input.tweet_string.length > 200) {
      throw new GraphQLError("Post cannot be more than 200 characters.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
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
  like_tweet = async (parent, { input }, context, info, decoded_token) => {
    const whetherPerformedAction = await PostActions.findOne({
      post: input.tweet_id,
      friend: decoded_token.friend_id,
      action: {
        $in: ["LIKED_POST", "DISLIKED_POST"],
      },
    });

    if (whetherPerformedAction) {
      return APIResponse.favourite_response(
        "You have already performed action on this post.",
        HttpStatus.OK,
        0,
      );
    }

    const post = await Posts.findOneAndUpdate(
      {
        _id: new ObjectId(input.tweet_id),
      },
      {
        $inc: {
          likes: 1,
        },
      },
      {
        new: true,
      },
    ).select("-_id likes");

    if (!post) {
      return APIResponse.favourite_response(
        "No posts found.",
        HttpStatus.NOT_FOUND,
        0,
      );
    } else {
      const performAction = new PostActions({
        post: input.tweet_id,
        friend: decoded_token.friend_id,
        action: "LIKED_POST",
      });

      const performedAction = await performAction.save();

      return APIResponse.favourite_response(
        "Liked Post OK",
        HttpStatus.OK,
        post.likes,
      );
    }
  };
  dislike_tweet = async (parent, { input }, context, info, decoded_token) => {
    const whetherPerformedAction = await PostActions.findOne({
      post: input.tweet_id,
      friend: decoded_token.friend_id,
      action: {
        $in: ["LIKED_POST", "DISLIKED_POST"],
      },
    });

    if (whetherPerformedAction) {
      return APIResponse.favourite_response(
        "You have already performed action on this post.",
        HttpStatus.OK,
        0,
      );
    }
    const post = await Posts.findOneAndUpdate(
      {
        _id: new ObjectId(input.tweet_id),
      },
      {
        $inc: {
          dislikes: 1,
        },
      },
      {
        new: true,
      },
    ).select("-_id dislikes");

    if (!post) {
      return APIResponse.favourite_response(
        "No posts found.",
        HttpStatus.NOT_FOUND,
        0,
      );
    } else {
      const performAction = new PostActions({
        post: input.tweet_id,
        friend: decoded_token.friend_id,
        action: "DISLIKED_POST",
      });

      const performedAction = await performAction.save();
      return APIResponse.favourite_response(
        "Disliked Post OK",
        HttpStatus.OK,
        post.dislikes,
      );
    }
  };
  retweet_tweet = async (parent, args, context, info) => {};
  edit_tweet = async (parent, { input }, context, info, decoded_token) => {
    if (input.post_string.length > 200) {
      throw new GraphQLError("Post cannot be more than 200 characters.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const post = await Posts.findOneAndUpdate(
      {
        _id: new ObjectId(input.tweet_id),
        friend: new ObjectId(decoded_token.friend_id),
      },
      {
        $set: {
          post_string: input.post_string,
        },
      },
      {
        new: true,
      },
    );

    if (!post) {
      return APIResponse.tweet_response("You cannot perform this action.", {});
    }

    return APIResponse.tweet_response("Post update success", post);
  };
}

export default TweetController;
