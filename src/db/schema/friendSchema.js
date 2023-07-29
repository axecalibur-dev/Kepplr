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
        required: true
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
    }
});