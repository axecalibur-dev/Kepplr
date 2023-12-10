import AuthServices from "../db/services/auth/auth_services";
import { Users } from "../models/users";
import { Relationships } from "../models/relationships";
const Auth = new AuthServices();

class ScriptingService {
  build = async (request) => {
    // const person1 = "ajay@kepplr.xyz"
    // const person2 = "rohit@kepplr.xyz"
    // const person3 = "american@kepplr.xyz"

    const superuser = "jaibhattwebdev@gmail.com";

    // superuser will follow person1 person2 but not person3
    // so when feed params are specific and logged in as superuser the person should only see the tweets made by person1 and person2 but not person3
    // when public should see all 3
    // we'll sign up 1 2 and 3 and set up a relationship b/w superuser and personN such as superuser(personA) follow personB ( personN ) and punch one tweet for each

    let persons = request.body["emails"];
    // persons.push(person1)
    // persons.push(person2)
    // persons.push(person3)

    const currentFriend = await Users.findOne({
      where: {
        email: superuser,
      },
    });

    // return
    for (let i = 0; i < persons.length; i++) {
      const newFriend = Users.build({
        firstName: persons[i].slice(0, 4),
        lastName: `Sharma`,
        gender: `Others`,
        language: `Chinese`,
        username_handle: `Jai____>${
          Math.floor(Math.random() * 9999981) + 20
        }_____${Math.floor(Math.random() * 9999981) + 20}_____${
          Math.floor(Math.random() * 9999981) + 20
        }`,
        age: 20 + i,
        isPrivateAccount: false,
        email: `${persons[i]}@gmail.com`,
        password: await Auth.hash_password("password"),
        profile_picture: "noimagee212",
      });

      const current_friend = await newFriend.save();

      if (persons[i] !== "american@kepplr.xyz") {
        const relation = Relationships.build({
          personA: currentFriend.id,
          personB: current_friend.id,
        });
        await relation.save();
      }

      // const relation2 = new Relationships({
      //     personA: current_friend.id,
      //     personB: currentFriend.id,
      // });
      //
      // await relation2.save();

      // const makePost = new Posts({
      //   post_string: "Sample Post",
      //   friend: current_friend.id,
      // });
      // await makePost.save();

      // Migration to Postgres
    }
  };
}

export default ScriptingService;
