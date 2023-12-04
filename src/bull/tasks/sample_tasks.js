import { Friends } from "../../db/schema/friendSchema";
import ProfilePictureController from "../../repository/media/profile_pictures/profile_picture_controller";
import { Posts } from "../../db/schema/posts";
import { Relationships } from "../../db/schema/relationship";
import { RegisteredQueues } from "../queues";
import { TaskRegistry } from "../task_registry";
import BullMessageQueueService from "../bull_service";
import CachingTasks from "./set_relationship_count_memcached";
import AuthServices from "../../db/services/auth/auth_services";
import MemcachedService from "../../memcached/memcached_service";
const ProfilePicture = new ProfilePictureController();

const Memcached = new MemcachedService();

const BullTasks = new BullMessageQueueService();
const Caching = new CachingTasks();
const Auth = new AuthServices();
class SampleTasks {
  sample_db_population_task = async (args) => {
    // const decoded_token = Auth.build_token(current_friend).refresh_token;
    const currentFriend = await Friends.findOne({
      email: "jaibhattwebdev@gmail.com",
    });
    const memcached_connect = await Memcached.connect();
    for (let i = 0; i < parseInt(args[0]); i++) {
      console.log(i);
      const newFriend = new Friends({
        firstName: `Jai_${i}`,
        lastName: `Jai_${i}`,
        gender: `Others`,
        language: `Jai_${i}`,
        age: 20 + i,
        isPrivateAccount: true,
        email: `Jai_${i}_${Math.random()}`,
        contacts: `Jai_${i}`,
        password: `Jai_${i}`,
        profile_picture: "noimagee2",
        username_handle: `Jai____>${
          Math.floor(Math.random() * 9999981) + 20
        }_____${Math.floor(Math.random() * 9999981) + 20}_____${
          Math.floor(Math.random() * 9999981) + 20
        }`,
      });

      const current_friend = await newFriend.save();
      const relation = new Relationships({
        personA: currentFriend.id,
        personB: current_friend.id,
      });
      await relation.save();
      const relation2 = new Relationships({
        personA: current_friend.id,
        personB: currentFriend.id,
      });

      await relation2.save();

      const makePost = new Posts({
        post_string: "Sample Post",
        friend: current_friend.id,
      });
      await makePost.save();
    }
    const people_i_follow = await Relationships.find({
      personA: currentFriend.id,
    });

    // const people_who_follow_me = await Relationships.find({
    //   personB: currentFriend.id,
    // });

    const people_i_follow_count = people_i_follow.length;
    // const people_who_follow_me_count = people_who_follow_me.length;

    const user_id = currentFriend.id;
    const relationshipCount = {
      people_i_follow_count: people_i_follow_count,
      people_who_follow_me_count: 0,
    };
    memcached_connect.set(user_id, relationshipCount, 0, (err) => {});
    return true;
  };
}

export default SampleTasks;
