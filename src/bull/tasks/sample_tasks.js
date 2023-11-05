import { Friends } from "../../db/schema/friendSchema";
import ProfilePictureController from "../../repository/media/profile_pictures/profile_picture_controller";
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
    }
    return true;
  };
}

export default SampleTasks;
