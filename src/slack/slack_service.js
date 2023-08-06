import pkg from "@slack/bolt";
const { App } = pkg;
import SlackUtils from "./slack_utils.js";
const SlackUtility = new SlackUtils();
class SlackService {
  send_to_slack = async (event_type, message, code) => {
    const slackApp = new App({
      token: process.env.SLACK_BOTH_OAUTH_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    });

    await slackApp.client.chat
      .postMessage({
        channel: process.env.SLACK_CHANNEL_ID, // Replace with your Slack channel ID
        text: SlackUtility.build_slack_message(event_type, message, code),
      })
      .then(() => {
        console.log("Message sent to Slack!");
      })
      .catch((error) => {
        console.error("Error sending message to Slack:", error);
      });
  };
}

export default SlackService;
