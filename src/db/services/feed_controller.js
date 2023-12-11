import APIResponseBuilder from "./response_builder";
const APIResponse = new APIResponseBuilder();

class FeedController {
  // get_home_feed = async (parent, { input }, context, info, decoded_token) => {
  //   if (input["feed_type"] === "PUBLIC") {
  //     const feed = await Posts.find({})
  //       .populate("friend", "firstName profile_picture lastName")
  //       .sort("-created_at")
  //       .skip((input.page - 1) * input["page_size"]) // Skip documents for previous pages
  //       .limit(input["page_size"]); // Limit the number of documents for the current page
  //
  //     return APIResponse.feed_response("Feed generated.", {}, feed);
  //   } else if (input["feed_type"] === "SPECIFIC") {
  //     const feed = await Relationships.aggregate([
  //       {
  //         $match: {
  //           personA: new ObjectId(decoded_token.friend_id),
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "posts",
  //           localField: "personB",
  //           foreignField: "friend",
  //           as: "tweet_data",
  //         },
  //       },
  //       { $unwind: "$tweet_data" },
  //
  //       {
  //         $lookup: {
  //           from: "friends",
  //           localField: "tweet_data.friend",
  //           foreignField: "_id",
  //           as: "friend_data",
  //         },
  //       },
  //       { $unwind: "$friend_data" },
  //       {
  //         $project: {
  //           _id: String("$tweet_data._id"),
  //           created_at: String("$tweet_data.created_at"),
  //           updated_at: String("$tweet_data.updated_at"),
  //           friend: {
  //             _id: String("$friend_data._id"),
  //             firstName: "$friend_data.firstName",
  //             lastName: "$friend_data.lastName",
  //             profile_picture: "$friend_data.profile_picture",
  //           },
  //           post_string: "$tweet_data.post_string",
  //           likes: "$tweet_data.likes",
  //           retweets: "$tweet_data.retweets",
  //           isReplyTweet: "$tweet_data.isReplyTweet",
  //         },
  //       },
  //     ])
  //       .sort("-created_at")
  //       .skip((input.page - 1) * input["page_size"]) // Skip documents for previous pages
  //       .limit(input["page_size"]); // Limit the number of documents for the current page
  //
  //     return APIResponse.feed_response("Feed generated.", {}, feed);
  //   }
  // };
}
export default FeedController;
