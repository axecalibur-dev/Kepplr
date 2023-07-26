const mongoose = require("mongoose")

export const friendSchema = new mongoose.Schema({
    firstName : {
        type : String
    },

    lastName : {
        type : String
    },

    gender : {
        type:String
    },

    age : {
        type:String
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