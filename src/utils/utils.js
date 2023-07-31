import crypto from 'crypto'
import nodemailer from 'nodemailer'
import {Friends} from "../db/dbConnector";
class Utils {
    format_error_message = (error_message) => {
        return error_message.replace(/Path/g, "Value").replace(/`/g, '');
    }

    fire_password_reset_mail = async (email_address , otp) => {
        const transporter = await nodemailer.createTransport({
            service:"outlook",
            auth : {
                user: process.env.SERVICE_EMAIl,
                pass : process.env.SERVICE_EMAIl_PWD
            }
        })

        const template =`<!DOCTYPE html>
          <html lang="">
          <head>
            <title>Password Reset Email</title>
          </head>
          <body>
            <h1>Password Reset Email</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            <p><strong>OTP: ${otp}</strong></p>
            <p><strong>Click here to reset : <a href> ... </a></strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Thank you,</p>
            <p>Your Website Team</p>
          </body>
          </html>
        `;


        const mailOptions = {
            from: process.env.SERVICE_EMAIl,
            to: email_address,
            subject: "Password Reset Email -<> ",
            html: template,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    resolve(false);
                    // Resolve the Promise with false (email not sent).
                } else {
                    reject(true); // Resolve the Promise with true (email sent successfully).
                }
            });
        });
    }

    generateRandomOTP = () => {
        const min = 100000; // Minimum 6-digit number (100000)
        const max = 999999; // Maximum 6-digit number (999999)

        const range = max - min + 1;
        const randomBytes = crypto.randomBytes(4); // 4 bytes to cover the range up to 65536

        return min + Math.floor(randomBytes.readUInt32BE() / 0xffffffff * range);
    }

    kabadiwala = async () => {
        console.log("Kabadiwala service running")
        const users = await Friends.deleteMany({})
        console.log("Kabadiwala service ended.")
        console.log(`Removed Rows : ${users["deletedCount"]}`)
    }
}
export default Utils