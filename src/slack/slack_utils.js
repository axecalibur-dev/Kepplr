import HttpStatus from "http-status-codes";

class SlackUtils {
  build_slack_message = (event_type, message, code) => {
    return (
      "Service Message\n" +
      `Event Type : ${event_type || "Event Undefined"}\n` +
      `Service Code ( API ) : ${code || HttpStatus.OK}\n` +
      `Message : ${message || "Message Undefined"}`
    );
  };
}

export default SlackUtils;
