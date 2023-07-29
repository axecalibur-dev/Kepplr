import {Friends} from "../dbConnector";
import HttpStatus from "http-status-codes";
import AuthServices from "./auth/auth_services";
import bcrypt from "bcrypt";

const Auth = new AuthServices();

class ControllerServices{
    sign_up_user = async (parent , {input}) => {
        const current_user = await Friends.findOne({
            email : input.email
        })

        if(!current_user){
            const newFriend = new Friends({
                firstName : input.firstName,
                lastName : input.lastName,
                gender : input.gender,
                language:input.language,
                age : input.age,
                email : input.email,
                contacts:input.contacts
            })

            newFriend.id = newFriend._id
            newFriend.password = await Auth.hash_password(input.password)


            const current_friend = await newFriend.save()
            return {
                "message":"Signup Success.",
                "refresh_token" : await Auth.build_token(current_friend).refresh_token,
                "access_token" : await Auth.build_token(current_friend).access_token,
                "status":HttpStatus.OK,
                "data":[current_friend],
                "meta" : {}
            }
        }

        else{
            return {
                "message":"User already exists. Login.",
                "refresh_token" : null,
                "access_token" : null,
                "status":HttpStatus.OK,
                "data":null,
                "meta" : {}
            }
        }

    }

    login_user = async(parent, {input}) => {
        const current_user = await Friends.findOne({
            email : input.email,
        })

        if (!current_user) {
            return {
                "message":"User does not exist. Signup.",
                "refresh_token" : null,
                "access_token" : null,
                "status":HttpStatus.OK,
                "data":null,
                "meta" : {}
            }
        }
        const passwordMatch = await bcrypt.compare(input.password, current_user.password);
        if (!passwordMatch) {
            return {
                "message":"Invalid Password.",
                "refresh_token" : null,
                "access_token" : null,
                "status":HttpStatus.OK,
                "data":null,
                "meta" : {}
            }
        }

        return {
            "message":"Login OK.",
            "refresh_token" : await Auth.build_token(current_user).refresh_token,
            "access_token" : await Auth.build_token(current_user).access_token,
            "status":HttpStatus.OK,
            "data":null,
            "meta" : {}
        }
    }

    regenerate_token = async (parent,{input}) =>{
        const decoded_token = await Auth.verifyToken(
            input.refresh_token
        )

        const current_user = await Friends.findById(decoded_token.friend_id)
        return {
            "message":"Tokens Refreshed.",
            "refresh_token" : await Auth.build_token(current_user).refresh_token,
            "access_token" : await Auth.build_token(current_user).access_token,
            "status":HttpStatus.OK,
            "data":null,
            "meta" : {}
        }
    }
    update_user = async (parent, {input}) => {
        try {
            const current_friend = await Friends.findByIdAndUpdate({_id:input.id},
                {
                    firstName : input.firstName,
                    lastName : input.lastName,
                    gender : input.gender,
                    language:input.language,
                    age : input.age,
                    email : input.email,
                    updated_at:Date.now,
                    contacts:input.contacts},

                {new:true}
            )

            if(!current_friend){
                return {
                    "message":"No such friend with provided ID.",
                    "status":HttpStatus.NOT_FOUND,
                    "data":null,
                    "meta" : {}
                }
            }
            else{
                return {
                    "message":"Friend Updated.",
                    "status":HttpStatus.OK,
                    "data":current_friend,
                    "meta" : {}
                }}

        }

        catch(err){
            return {
                "message":`An exception occurred.`,
                "status":HttpStatus.BAD_REQUEST,
                "data":null,
                "meta" : {}
            }
        }
    }

    getOneUserByID = async (parent , {input})=>{

        console.log(input)
        try{
            const current_friends = await Friends.findById({_id:input.id})
            if(current_friends == null)
                return {
                    "message":"No data found",
                    "status":HttpStatus.NOT_FOUND,
                    "data":null,
                    "meta" : {}
                }
            else
            {
                return {
                    "message":"Friend found",
                    "status":HttpStatus.OK,
                    "data":[current_friends],
                    "meta" : {}
                }
            }

        }

        catch(err){
            console.log(err)
            return {
                "message":`An exception occurred.`,
                "status":HttpStatus.BAD_REQUEST,
                "data":null,
                "meta" : {}
            }
        }
    }


    getAllUsers = async (parent) => {
        try{

            const current_friends = await Friends.find()
            if(current_friends.length === 0)
                return {
                    "message":"No data found.",
                    "status":HttpStatus.NOT_FOUND,
                    "data":null,
                    "meta":{}
                }
            else{
                return {
                    "message":"Friends found.",
                    "status":HttpStatus.OK,
                    "data":current_friends,
                    "meta": {
                        "count" : current_friends.length
                    }
                }
            }
        }

        catch(err){
            return {
                "message":`An exception occurred.`,
                "status":HttpStatus.BAD_REQUEST,
                "data":null,
                "meta":{}
            }
        }
    }

}
export default ControllerServices;