import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {Friends} from "../../dbConnector";
import HttpStatus from "http-status-codes";
import Utils from "../../../utils/utils";

const utils = new Utils();

class AuthServices {
    build_token = (user) => {
        const access_token =  jwt.sign({
                token_type : "Bearer/Access",
                friend_id: user.id,
                firstName : user.firstName,
                lastName : user.lastName
            },
            process.env.JWT_SECRET, {expiresIn: '7d'});

        const refresh_token =  jwt.sign({
                token_type : "Refresh",
                friend_id: user.id,
                firstName : user.firstName,
                lastName : user.lastName
            },
            process.env.JWT_SECRET, {expiresIn: '30d'});

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    }
    hash_password = async (password) => {
        return await bcrypt.hash(password, await bcrypt.genSalt(12));
    }
    verifyToken = (token) => {
        return jwt.verify(token, process.env.JWT_SECRET);

    }

    reset_password = async (parent , {input}) => {

        const system_otp = await utils.generateRandomOTP()
        const user = await Friends.findOneAndUpdate({
            email : input.email
        }, {
                requested_password_assistance: true,
                password_request_otp: system_otp
            }

        )


        if(!user){

            console.log("No such user found.")
            return {
                "message":"No such friend with provided email.",
                "status":HttpStatus.NOT_FOUND,
                "data":null,
                "meta" : {}
            }
        }

        const mail_fired =  await utils.fire_password_reset_mail(
            input.email ,
            system_otp
        )


        if(mail_fired){
            return {
                "message":`A mail has been sent to ${input.email}`,
                "status":HttpStatus.OK,
                "data":null,
                "meta" : {}
            }
        }

        else{
            return {
                "message":`Mail`,
                "status":HttpStatus.OK,
                "data":null,
                "meta" : {}
            }
        }
    }

    initiate_reset_password_service = async (parent , {input} ) => {
        const auth = new AuthServices();
        if(input["new_password"] === input["reenter_password"]) {
            const user = await Friends.findOneAndUpdate({
                password_request_otp : input.password_request_otp,
                requested_password_assistance:true
            }, {
                requested_password_assistance: false,
                password_request_otp: null,
                password: await auth.hash_password(input["new_password"])
            })

            if(!user){
                return {
                    "message":"Invalid OTP/ No request made.",
                    "status":HttpStatus.NOT_FOUND,
                    "data":null,
                    "meta" : {}
                }
            }

            else {
                return {
                    "message":"FOUND",
                    "status":HttpStatus.OK,
                    "data":null,
                    "meta" : {
                        otp : user.password_request_otp,
                        email : user.email,
                    }
                }
            }
        }

        else{
            return {
                "message":"Passwords Do Not Match",
                "status":HttpStatus.BAD_REQUEST,
                "data":null,
                "meta" : {}
            }
        }
    }

}
export default AuthServices;