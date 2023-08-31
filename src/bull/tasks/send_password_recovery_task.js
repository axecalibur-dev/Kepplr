import Utils from "../../utils/utils";
const utils = new Utils();
class ServiceTasks {
  send_password_recovery_mail_task = async (args) => {
    const mail_fired = await utils.fire_password_reset_mail(
      args[0]["input_email"],
      args[0]["system_otp"],
    );

    if (mail_fired) {
      return true;
    } else {
      return false;
    }
  };
}

export default ServiceTasks;
