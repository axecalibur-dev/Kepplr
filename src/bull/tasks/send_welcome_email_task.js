import Utils from "../../utils/utils";
const utils = new Utils();

class MarketingTasks {
  send_welcome_email_task = async (args) => {
    const mail_fired = await utils.fire_welcome_mail(
      args[0]["input_email"],
      args[0]["user_name"],
    );

    if (mail_fired) {
      return true;
    } else {
      return false;
    }
  };
}

export default MarketingTasks;
