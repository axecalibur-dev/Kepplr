import { Friends } from "../../db/dbConnector";

class SampleTasks {
  sample_db_population_task = async (args) => {
    for (let i = 0; i < parseInt(args[0]); i++) {
      const newFriend = new Friends({
        firstName: `Jai_${i}`,
        lastName: `Jai_${i}`,
        gender: `Jai_${i}`,
        language: `Jai_${i}`,
        age: `Jai_${i}`,
        email: `Jai_${i}_${Math.random()}`,
        contacts: `Jai_${i}`,
        password: `Jai_${i}`,
      });

      const current_friend = await newFriend.save();
    }
    return true;
  };
}

export default SampleTasks;
