import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
import APIResponseBuilder from "./response_builder";
import { RegisteredQueues } from "../../bull/queues";
import { TaskRegistry } from "../../bull/task_registry";
import BullMessageQueueService from "../../bull/bull_service";
import CachingTasks from "../../bull/tasks/set_relationship_count_memcached";
import MemcachedService from "../../memcached/memcached_service";
import { Relationships } from "../../models/relationships";
import { Users } from "../../models/users";

const APIResponse = new APIResponseBuilder();

const BullTasks = new BullMessageQueueService();

const Caching = new CachingTasks();

const Memcached = new MemcachedService();
class RelationshipController {
  follow_someone = async (parent, { input }, context, info, decoded_token) => {
    // console.log(decoded_token);
    // check if self following, reject

    if (String(decoded_token.user_id) === String(input["now_following_id"])) {
      throw new GraphQLError("You cannot follow yourself.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const existing = await Relationships.findOne({
      where: {
        personA: decoded_token.user_id,
        personB: input["now_following_id"],
      },
    });
    if (existing) {
      throw new GraphQLError("You are already following this person.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const relationship = Relationships.build({
      personA: decoded_token.user_id,
      personB: input["now_following_id"],
    });

    const relation = await relationship.save();
    console.log(relation.id);
    // await BullTasks.send_task(
    //   RegisteredQueues.Memcached_Queue,
    //   TaskRegistry.Set_Relationship_Count_Memcached,
    //   Caching.set_relationship_count_memcached,
    //   [
    //     {
    //       decoded_token: decoded_token,
    //     },
    //   ],
    // );
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

    if (
      String(decoded_token["user_id"]) === String(input["now_following_id"])
    ) {
      throw new GraphQLError("You cannot unfollow yourself.", {
        extensions: {
          name: "ServiceException",
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const existing = await Relationships.findOne({
      where: {
        personA: decoded_token.user_id,
        personB: input["now_following_id"],
      },
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
    const existing = await Relationships.findAll({
      where: {
        personA: decoded_token.user_id,
      },

      include: [
        {
          model: Users,
          as: "personBData", // Alias for the nested user data related to personA
          foreignKey: "personB", // Specify the foreign key relationship
        },
      ],
      offset: (input["page"] - 1) * input["page_size"], // Calculate the offset based on the page number
      limit: input["page_size"],
    });
    const count = await Relationships.count({
      where: {
        personA: decoded_token.user_id,
      },
    });

    if (count === 0) {
      return APIResponse.relationship_response(
        "You are following 0 people.",
        {},
      );
    } else {
      const followers = existing.map(
        (relationship) => relationship["personBData"],
      );
      return APIResponse.relationship_response(
        `You are following ${count} people.`,
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
    const existing = await Relationships.findAll({
      where: {
        personB: decoded_token.user_id,
      },

      include: [
        {
          model: Users,
          as: "personAData", // Alias for the nested user data related to personA
          foreignKey: "personA", // Specify the foreign key relationship
        },
      ],
      offset: (input["page"] - 1) * input["page_size"], // Calculate the offset based on the page number
      limit: input["page_size"],
    });

    const count = await Relationships.count({
      where: {
        personB: decoded_token.user_id,
      },
    });
    if (count === 0) {
      return APIResponse.relationship_response(
        "You are being followed by 0 people.",
        {},
      );
    } else {
      const followers = existing.map(
        (relationship) => relationship["personAData"],
      );
      return APIResponse.relationship_response(
        `You are being followed by ${count} people.`,
        {},
        followers,
      );
    }
  };
}
export default RelationshipController;
