import mongoose from "mongoose";

export const friendSchema = new mongoose.Schema({
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
    email : {
        type : String
    },
    contacts : {
        type : Array
    }
});