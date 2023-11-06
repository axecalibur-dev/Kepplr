import { Friends } from "../../db/schema/friendSchema";
import ProfilePictureController from "../../repository/media/profile_pictures/profile_picture_controller";
import { Posts } from "../../db/schema/posts";
import { Relationships } from "../../db/schema/relationship";
const ProfilePicture = new ProfilePictureController();
class SampleTasks {
  sample_db_population_task = async (args) => {
    for (let i = 0; i < parseInt(args[0]); i++) {
      console.log(i);
      const newFriend = new Friends({
        firstName: `Jai_${i}`,
        lastName: `Jai_${i}`,
        gender: `Jai_${i}`,
        language: `Jai_${i}`,
        age: 20 + i,
        email: `Jai_${i}_${Math.random()}`,
        contacts: `Jai_${i}`,
        password: `Jai_${i}`,
        profile_picture: await ProfilePicture.default_profile_picture(),
      });

      const current_friend = await newFriend.save();
      const currentFriend = await Friends.findOne({
        email: "jai@gmail.com",
      });
      console.log(currentFriend);
      const relation = new Relationships({
        personA: currentFriend.id,
        personB: current_friend.id,
      });

      await relation.save();

      const makePost = new Posts({
        post_string: "Sample Post",
        friend: current_friend.id,
      });
      await makePost.save();
    }
    return true;
  };
}

export default SampleTasks;
