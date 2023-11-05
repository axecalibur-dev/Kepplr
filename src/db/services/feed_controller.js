import { Posts } from "../schema/posts";
import { Relationships } from "../schema/relationship";
import APIResponseBuilder from "./response_builder";
const APIResponse = new APIResponseBuilder();

class FeedController {
  get_home_feed = async (parent, { input }, context, info, decoded_token) => {
    if (input["feed_type"] == "PUBLIC") {
      const feed = await Posts.find({})
        .populate("friend", "firstName lastName")
        .sort("-created_at");
      return APIResponse.feed_response("Feed generated.", {}, feed);
    } else if (input["feed_type"] == "SPECIFIC") {
      // const aggregationPipeline = [
      //   {
      //     $match: {
      //       personA: decoded_token.friend_id, // Find relationships where the user is following
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$personA",
      //       followedUsers: { $push: "$personB" }, // Store followed user IDs in an array
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "Posts",
      //       localField: "followedUsers",
      //       foreignField: "Friend",
      //       as: "followedPosts",
      //     },
      //   },
      //   {
      //     $unwind: "$followedPosts",
      //   },
      // ];
      // const result = await Relationships.aggregate(aggregationPipeline);
      // console.log(result);
      //
      // return APIResponse.feed_response("Feed generated.", {}, result);
      const feed = await Posts.find({})
        .populate("friend", "firstName lastName")
        .sort("-created_at");
      return APIResponse.feed_response("Feed generated.", {}, feed);
    }
  };
}
export default FeedController;
