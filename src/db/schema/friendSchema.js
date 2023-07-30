import mongoose from "mongoose";

export const friendSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        default:null
    },

    requested_password_assistance : {
        type:Boolean,
        default:false
    },

    password_request_otp : {
        type:String,
        default:null
    },

    firstName : {
        type : String,
        required: true
    },

    lastName : {
        type : String,
        required: true
    },

    gender : {
        type:String,
        required: true
    },

    age : {
        type:String,
        required:true
    },
    language : {
        type : String
    },

    contacts : {
        type : Array
    },

    registration_source : {
        type: String,
        enum: ['Google', 'Facebook', 'Email'],
        required: true,
        default:"Email",
    },



    oAuthCredentials: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    // {^^^^^^^^^ format for oAuthCredentials
    //    "open_api_id" : "google"/"facebook"
    // }

}, { minimize: false })
