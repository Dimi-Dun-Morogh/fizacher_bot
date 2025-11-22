import Db from "./db/index.js";

const db = new Db();

db.getChatMembers(2).then((d) => console.log(d));

// db.addExercise(
//   123,
//   {
//     id: 4,
//     tg_username: "вв444tester",
//     tg_nickname: "вв444Edest Userer",
//   },
//   "pull_ups",
//   1
// );


// db.createOrUpdateChat(1,{
//     chat_name:"Test Chat EDITED",
// }).then((res)=>console.log("Chat created/updated:",res));