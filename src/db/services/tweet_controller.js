import APIResponseBuilder from "./response_builder";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import { ObjectId } from "mongodb";
import { Posts } from "../../models/posts";
import { PostActions } from "../../models/postActions";
import { Op } from "sequelize";
import PostActionsConstants from "../../globals/constants/post_actions_constants";
const APIResponse = new APIResponseBuilder();

class TweetController {
  post_a_new_tweet = async (
    parent,
    { input },
    context,
    info,
    decoded_token,
  ) => {
    if (input["tweet_string"].length > 200) {
      throw new GraphQLError("Post cannot be more than 200 characters.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const post = PostActions.build({
      post_string: input["tweet_string"],
      user: decoded_token.user_id,
    });

    const tweeted = await post.save();
    return APIResponse.tweet_response("Tweet posted success", {});
  };
  delete_tweet = async (parent, { input }, context, info, decoded_token) => {
    console.log(input);
    const deleted = await Posts.findOne({
      where: {
        id: input["tweet_id"],
        user: decoded_token.user_id,
      },
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
      await deleted.destroy();
      return APIResponse.tweet_response("Tweet deleted success", {});
    }
  };
  // like_tweet = async (parent, { input }, context, info, decoded_token) => {
  //   const whetherPerformedAction = await PostActions.findOne({
  //     where: {
  //       post: input["tweet_id"],
  //       user: decoded_token.user_id,
  //       action: {
  //         [Op.in]: [
  //           PostActionsConstants.LIKED_TWEET,
  //           PostActionsConstants.DISLIKED_TWEET,
  //         ],
  //       },
  //     },
  //   });
  //
  //   // console.log("ACTION");
  //   // console.log(whetherPerformedAction);
  //   // console.log("ACTION");
  //   // return 0;
  //   if (whetherPerformedAction) {
  //     return APIResponse.favourite_response(
  //       "You have already performed action on this post.",
  //       HttpStatus.OK,
  //       0,
  //     );
  //   }
  //
  //   const post = await Posts.findOne({
  //     where: {
  //       id: input["tweet_id"],
  //     },
  //   });
  //
  //   post.likes = po;
  //
  //   if (!post) {
  //     return APIResponse.favourite_response(
  //       "No posts found.",
  //       HttpStatus.NOT_FOUND,
  //       0,
  //     );
  //   } else {
  //     const performAction = PostActions.build({
  //       post: input.tweet_id,
  //       friend: decoded_token.user_id,
  //       action: "LIKED_POST",
  //     });
  //
  //     const performedAction = await performAction.save();
  //
  //     return APIResponse.favourite_response(
  //       "Liked Post OK",
  //       HttpStatus.OK,
  //       post.likes,
  //     );
  //   }
  // };
  // dislike_tweet = async (parent, { input }, context, info, decoded_token) => {
  //   const whetherPerformedAction = await PostActions.findOne({
  //     where: {
  //       post: input["tweet_id"],
  //       user: decoded_token.user_id,
  //       action: {
  //         [Op.in]: [
  //           PostActionsConstants.LIKED_TWEET,
  //           PostActionsConstants.DISLIKED_TWEET,
  //         ],
  //       },
  //     },
  //   });
  //
  //   if (whetherPerformedAction) {
  //     return APIResponse.favourite_response(
  //       "You have already performed action on this post.",
  //       HttpStatus.OK,
  //       0,
  //     );
  //   }
  //   const post = await Posts.increment("dislikes", {
  //     by: 1,
  //     where: {
  //       id: input.tweet_id,
  //     },
  //   });
  //
  //   if (!post) {
  //     return APIResponse.favourite_response(
  //       "No posts found.",
  //       HttpStatus.NOT_FOUND,
  //       0,
  //     );
  //   } else {
  //     const performAction = PostActions.build({
  //       post: input.tweet_id,
  //       user: decoded_token.user_id,
  //       action: "DISLIKED_POST",
  //     });
  //
  //     const performedAction = await performAction.save();
  //     return APIResponse.favourite_response(
  //       "Disliked Post OK",
  //       HttpStatus.OK,
  //       post.dislikes,
  //     );
  //   }
  // };
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
    const post = await Posts.findOne({
      where: {
        id: input.tweet_id,
        user: decoded_token.user_id,
      },
    });

    if (!post) {
      return APIResponse.tweet_response("You cannot perform this action.", {});
    }

    post.update({
      post_string: input["post_string"],
    });
    return APIResponse.tweet_response("Post update success", post);
  };
}

export default TweetController;
