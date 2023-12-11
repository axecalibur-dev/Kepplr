import Utils from "../../utils/utils";
import MemcachedService from "../../memcached/memcached_service";
import relationship_controller from "../../db/services/relationship_controller";
const utils = new Utils();

const Memcached = new MemcachedService();
class CachingTasks {
  set_relationship_count_memcached = async (args) => {
    // args = args[0];
    // // console.log(args);
    // const people_i_follow = await Relationships.find({
    //   personA: args["decoded_token"].friend_id,
    // });
    //
    // const people_who_follow_me = await Relationships.find({
    //   personB: args["decoded_token"].friend_id,
    // });
    //
    // const people_i_follow_count = people_i_follow.length;
    // // console.log("people_i_follow_count");
    // // console.log(people_i_follow_count);
    // const people_who_follow_me_count = people_who_follow_me.length;
    //
    // const user_id = args["decoded_token"].friend_id;
    // const relationshipCount = {
    //   people_i_follow_count: people_i_follow_count,
    //   people_who_follow_me_count: people_who_follow_me_count,
    // };
    // const memcached_connect = await Memcached.connect();
    //
    // memcached_connect.set(user_id, relationshipCount, 0, (err) => {});
    //
    // return true;
  };
}

export default CachingTasks;
