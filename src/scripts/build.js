import { Friends } from "../db/schema/friendSchema";
import { Relationships } from "../db/schema/relationship";
import { Posts } from "../db/schema/posts";

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

    const currentFriend = await Friends.findOne({
      email: superuser,
    });

    // return
    for (let i = 0; i < persons.length; i++) {
      const newFriend = new Friends({
        firstName: persons[i].slice(0, 4),
        lastName: `Sharma`,
        gender: `Others`,
        language: `Chinese`,
        username_handle: `Jai_iop}`,
        age: 20 + i,
        isPrivateAccount: false,
        email: persons[i],
        contacts: `Jai_${i}`,
        password: `Jai_${i}`,
        profile_picture: "noimagee2",
      });

      const current_friend = await newFriend.save();

      if (persons[i] !== "american@kepplr.xyz") {
        const relation = new Relationships({
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

      const makePost = new Posts({
        post_string: "Sample Post",
        friend: current_friend.id,
      });
      await makePost.save();
    }
  };
}

export default ScriptingService;
