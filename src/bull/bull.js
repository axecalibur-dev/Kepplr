// import Queue from "bull";
// import nodemailer from "nodemailer";
// import Utils from "../utils/utils";
// import HttpStatus from "http-status-codes";
// import RedisService from "../redis/redis_config";
//
// const Redis = new RedisService();
// const Util = new Utils();
//
// class ScheduledMail {
//   mail = () => {
//     console.log("Mail fired");
//     const sendMailQueue = new Queue("sendMail", {
//       redis: {
//         host: process.env.REDIS_URL_DEPLOYED,
//         port: 15104,
//         password: process.env.REDIS_PWD,
//       },
//     });
//
//     const data = {
//       email: "jaibhattwebdev@gmail.com",
//     };
//
//     const options = {
//       delay: 10000, // 1 min in ms
//       attempts: 1,
//     };
//
//     sendMailQueue.add(data, options);
//
//     sendMailQueue.process(async (job) => {
//       return await sendMail(job.data.email);
//     });
//     async function sendMail(email) {
//       const client = Redis.connect();
//       console.log("COnnectponOk");
//       await client.console.log("SET");
//     }
//   };
// }
//
// export default ScheduledMail;
// //
