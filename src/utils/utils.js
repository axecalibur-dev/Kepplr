import crypto from "crypto";
import nodemailer from "nodemailer";
import { Friends } from "../db/dbConnector";
class Utils {
  format_error_message = (error_message) => {
    return error_message.replace(/Path/g, "Value").replace(/`/g, "");
  };

  fire_password_reset_mail = async (email_address, otp) => {
    const transporter = await nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.SERVICE_EMAIl,
        pass: process.env.SERVICE_EMAIl_PWD,
      },
    });

    const template = `<!DOCTYPE html>
          <html lang="">
          <head>
            <title>Kepplr | Password Reset Email</title>
          </head>
          <body>
            <h1>Need help with your password ?</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            <p><strong>${otp}</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Thank you,</p>
            <p>Kepplr</p>
          </body>
          </html>
        `;

    const mailOptions = {
      from: process.env.SERVICE_EMAIl,
      to: email_address,
      subject: "Keeper Password Assistance",
      html: template,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true; // Email sent successfully
    } catch (error) {
      console.error("Error sending email:", error);
      return false; // Failed to send email
    }
  };

  generateRandomOTP = () => {
    const min = 100000; // Minimum 6-digit number (100000)
    const max = 999999; // Maximum 6-digit number (999999)

    const range = max - min + 1;
    const randomBytes = crypto.randomBytes(4); // 4 bytes to cover the range up to 65536

    return min + Math.floor((randomBytes.readUInt32BE() / 0xffffffff) * range);
  };

  db_cleaning_service = async () => {
    console.log("Kabadiwala service running.");
    const users = await Friends.deleteMany({});
    console.log("Kabadiwala service ended.");
    console.log(
      `Cleaned Items : ${users["deletedCount"]} : From Model : Friends`,
    );
  };
}
export default Utils;
