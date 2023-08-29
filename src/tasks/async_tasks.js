import { Friends } from "../db/dbConnector";
import AuthServices from "../db/services/auth/auth_services";
const Auth = new AuthServices();

class AsyncTask {
  sample_task = async (args) => {
    for (let i = 0; i < 5000; i++) {
      const newFriend = new Friends({
        firstName: `Jai_${i}`,
        lastName: `Jai_${i}`,
        gender: `Jai_${i}`,
        language: `Jai_${i}`,
        age: 23,
        email: `jai_${i}_${Math.random()}@gmail.com`,
        contacts: [],
        password: "jaib",
      });

      const current_friend = await newFriend.save();
    }

    return true;
  };
}

export default AsyncTask;
