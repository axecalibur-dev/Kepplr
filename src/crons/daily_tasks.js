import cron from "node-cron";
import Utils from "../utils/utils";
import SlackService from "../slack/slack_service";
import HttpStatus from "http-status-codes";
const utils = new Utils();

const Slack = new SlackService();
export const cronJob_Night = cron.schedule(
  process.env.CRON_SCHEDULE,
  () => {
    utils.kabadiwala().then((result) =>
      Slack.send_to_slack(
        "CRON_SERVICE 🔁",
        `CRON SERVICE > OK ✅`,
        HttpStatus.OK,
      ).catch((err) => {
        console.log(`Cleaning Failed ${err}`);
      }),
    );
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // IST timezone
  },
);
