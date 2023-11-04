import { Posts } from "../schema/posts";
import { Relationships } from "../schema/relationship";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import APIResponseBuilder from "./response_builder";
const APIResponse = new APIResponseBuilder();
class RelationshipController {
  follow_someone = async (parent, { input }, context, info, decoded_token) => {
    // console.log(decoded_token);
    // check if self following, reject

    if (String(decoded_token.friend_id) === String(input["now_following_id"])) {
      throw new GraphQLError("You cannot follow yourself.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const existing = await Relationships.findOne({
      personA: decoded_token.friend_id,
      personB: input["now_following_id"],
    });
    if (existing) {
      throw new GraphQLError("You are already following this person.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const relationship = new Relationships({
      personA: decoded_token.friend_id,
      personB: input["now_following_id"],
    });

    const relation = await relationship.save();
    return APIResponse.relationship_response(
      "You are now following this person",
      {},
      [],
    );
  };
  unfollow_someone = async (
    parent,
    { input },
    context,
    info,
    decoded_token,
  ) => {
    // console.log(decoded_token);
    // check if self following, reject

    if (String(decoded_token.friend_id) === String(input["now_following_id"])) {
      throw new GraphQLError("You cannot unfollow yourself.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const existing = await Relationships.findOneAndDelete({
      personA: decoded_token.friend_id,
      personB: input["now_following_id"],
    });

    if (existing) {
      return APIResponse.relationship_response(
        "You have unfollowed this person",
        {},
        [],
      );
    } else {
      throw new GraphQLError("You are not following this person.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  };

  people_i_follow = async (parent, { input }, context, info, decoded_token) => {
    console.log(decoded_token);
    // check if self following, reject

    const existing = await Relationships.find({
      personA: decoded_token.friend_id,
    }).populate("personB", " -_id firstName email lastName");

    console.log(existing);
    if (existing.length === 0) {
      return APIResponse.relationship_response(
        "You are following 0 people.",
        {},
      );
    } else {
      const followers = existing.map((relationship) => relationship.personB);
      // console.log(followers);
      return APIResponse.relationship_response(
        `You are following ${existing.length} people.`,
        {},
        followers,
      );
    }
  };

  people_who_follow_me = async (
    parent,
    { input },
    context,
    info,
    decoded_token,
  ) => {
    // console.log(decoded_token);
    // check if self following, reject

    const existing = await Relationships.find({
      personB: decoded_token.friend_id,
    }).populate("personA", " -_id firstName email lastName");

    console.log(existing);
    if (existing.length === 0) {
      return APIResponse.relationship_response("0 people follow you..", {});
    } else {
      const followers = existing.map((relationship) => relationship.personB);
      // console.log(followers);
      return APIResponse.relationship_response(
        `You are being followed by ${existing.length} people.`,
        {},
        followers,
      );
    }
  };
}
export default RelationshipController;
