import { Friends } from "../../db/schema/friendSchema";
import { Posts } from "../../db/schema/posts";

class SampleTasks {
  sample_db_population_task = async (args) => {
    for (let i = 0; i < parseInt(args[0]); i++) {
      console.log(i);
      const newFriend = new Posts({
        friend: "654521ae513c277e1d1384a6",
        post_string: `Ajays_Tweet_${i}`,
      });

      const current_friend = await newFriend.save();
    }
    return true;
  };
}

export default SampleTasks;
