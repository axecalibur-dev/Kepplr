import crypto from "crypto";
import nodemailer from "nodemailer";
import { redisService } from "../redis/redis";
class Utils {
  format_error_message = (error_message) => {
    return error_message.replace(/Path/g, "Value").replace(/`/g, "");
  };

  fire_password_reset_mail = async (email_address, otp, user_name) => {
    const transporter = await nodemailer.createTransport({
      host: "smtppro.zoho.in",
      auth: {
        user: process.env.SERVICE_EMAIl,
        pass: process.env.SERVICE_EMAIl_PWD,
      },
    });

    const template = `<!DOCTYPE html>
         <html lang="">
          <head>
            <title>Kepplr | Password Reset Email </title>
          </head>
          <body>
            <h1>Kepplr Assistance | Need help with your password ?</h1>
            <p>Hello ${user_name}</p>
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            <p>Please note this OTP is valid only for the next 5 minutes.</p>
            <p><strong>${otp}</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
<br>
            <p>Thank you,</p>
            <p>Kepplr</p>
          </body>
          </html>
        `;

    const mailOptions = {
      from: process.env.SERVICE_EMAIl,
      to: email_address,
      subject: "Kepplr Password Assistance",
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

  fire_welcome_mail = async (email_address, user_name) => {
    const transporter = await nodemailer.createTransport({
      host: "smtppro.zoho.in",
      auth: {
        user: process.env.SERVICE_EMAIl,
        pass: process.env.SERVICE_EMAIl_PWD,
      },
    });

    const template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Kepplr</title>
  <style>
    /* Inline CSS for better email client compatibility */
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      text-align: center;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
    }

    p {
      font-size: 16px;
      color: #555;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Kepplr, ${user_name} </h1>
    <p>Thank you for joining Kepplr. We are excited to have you on board!</p>
    <p>Explore the app and start enjoying the features we have to offer.</p>
    <a class="button" href="https://www.kepplr.xyz/"> Get Started </a>
  </div>
</body>
</html>

        `;

    const mailOptions = {
      from: process.env.SERVICE_EMAIl,
      to: email_address,
      subject: "Welcome to Kepplr ! ",
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

  generate_system_job_id = (queue_name, job_name) => {
    const timestamp = new Date().toISOString();
    return `${queue_name}_${job_name}_${timestamp}`;
  };

  set_relationship_count = async (decoded_token) => {
    const redis = await redisService();
    await redis.setEx(
      String(user.email),
      process.env.REDIS_DEFAULT_EXPIRATION,
      String(system_otp),
    );
  };

  send_system_wide_report_via_mail = async (email_address, secureURL) => {
    const transporter = await nodemailer.createTransport({
      host: "smtppro.zoho.in",
      auth: {
        user: process.env.SERVICE_EMAIl,
        pass: process.env.SERVICE_EMAIl_PWD,
      },
    });

    const template = `<!DOCTYPE html>
         <html lang="">
          <head>
            <title>Kepplr | System Wide Report </title>
          </head>
          <body>
            <a href = ${secureURL}>Report</a>
          </body>
          </html>
        `;

    const mailOptions = {
      from: process.env.SERVICE_EMAIl,
      to: email_address,
      subject: "Kepplr Password Assistance",
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
}
export default Utils;
