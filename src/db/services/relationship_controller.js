import { Posts } from "../schema/posts";
import { Relationships } from "../schema/relationship";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import APIResponseBuilder from "./response_builder";
import { RegisteredQueues } from "../../bull/queues";
import { TaskRegistry } from "../../bull/task_registry";
import BullMessageQueueService from "../../bull/bull_service";
import CachingTasks from "../../bull/tasks/set_relationship_count_memcached";
import MemcachedService from "../../memcached/memcached_service";

const APIResponse = new APIResponseBuilder();

const BullTasks = new BullMessageQueueService();

const Caching = new CachingTasks();

const Memcached = new MemcachedService();
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
    console.log(relation.id);
    await BullTasks.send_task(
      RegisteredQueues.Memcached_Queue,
      TaskRegistry.Set_Relationship_Count_Memcached,
      Caching.set_relationship_count_memcached,
      [
        {
          decoded_token: decoded_token,
        },
      ],
    );
    // console.log(existing);
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
    const memcached_connect = await Memcached.connect();
    let some_value = null;
    memcached_connect.get(decoded_token.friend_id, (err, data) => {
      some_value = data;
    });

    const existing = await Relationships.find({
      personA: decoded_token.friend_id,
    }).populate("personB", " -_id firstName email lastName");

    if (!some_value) {
      console.log("DB");
      some_value = existing.length;
    } else {
      console.log("MEM");
      some_value = some_value["people_i_follow_count"];
    }
    if (some_value === 0) {
      return APIResponse.relationship_response(
        "You are following 0 people.",
        {},
      );
    } else {
      const followers = existing.map((relationship) => relationship.personB);
      // memcached_connect.del(decoded_token.friend_id, (err, data) => {
      //   some_value = data;
      // });
      return APIResponse.relationship_response(
        `You are following ${some_value} people.`,
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
