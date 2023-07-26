import {Friends , Series} from "../db/dbConnector";
const HttpStatus = require('http-status-codes');
export const resolvers= {
    Query : {
        getAllFriend: async (parent) => {
            try{

                const current_friends = await Friends.find()
                if(current_friends.length === 0)
                    return {
                        "message":"No data found.",
                        "status":HttpStatus.NOT_FOUND,
                        "data":null
                    }
                else{
                    return {
                        "message":"Friends found.",
                        "status":HttpStatus.OK,
                        "data":current_friends
                    }
                }
            }

            catch(err){
                return {
                    "message":`An exception occurred.`,
                    "status":HttpStatus.BAD_REQUEST,
                    "data":null
                }
            }
        },

        // getAFriendByID: async (parent, {input} ) => {
        //     try{
        //         const current_friends = await Friends.findById({_id:input.id})
        //         if(current_friends.length === 0)
        //             return {
        //                 "message":"No data found",
        //                 "status":HttpStatus.NOT_FOUND,
        //                 "data":null
        //             }
        //     }
        //
        //     catch(err){
        //         console.log(err)
        //         return {
        //             "message":`An exception occurred.`,
        //             "status":HttpStatus.BAD_REQUEST,
        //             "data":null
        //         }
        //     }
        // },

        // findASeries:(root ,{id})=>{
        //     return new Promise((resolve,reject)=>{
        //         Series.findOne({_id:id},(err,series)=>{
        //             if(err){
        //                 reject(err)
        //             }
        //             else{
        //                 resolve(series)
        //             }
        //         })
        //     })
        // }
    },

    Mutation : {
        createFriend :  async (parent , {input})=>{
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
            try{
                const current_friend = await newFriend.save()
                return {
                    "message":"Friend Created.",
                    "status":HttpStatus.CREATED,
                    "data":current_friend
                }
            }

            catch(err){
                return {
                    "message":`An exception occurred.`,
                    "status":HttpStatus.BAD_REQUEST,
                    "data":null
                }
            }


        },

        updateFriend : async (parent ,{input})=>{
            try {
                const current_friend = await Friends.findByIdAndUpdate({_id:input.id},
                    {
                        firstName : input.firstName,
                        lastName : input.lastName,
                        gender : input.gender,
                        language:input.language,
                        age : input.age,
                        email : input.email,
                        contacts:input.contacts},
                    {new:true}
                )

                if(!current_friend){
                    return {
                        "message":"No such friend with provided ID.",
                        "status":HttpStatus.NOT_FOUND,
                        "data":null
                    }
                }
                else{
                    return {
                        "message":"Friend Updated.",
                        "status":HttpStatus.CREATED,
                        "data":current_friend
                }}

            }

            catch(err){
                return {
                    "message":`An exception occurred.`,
                    "status":HttpStatus.BAD_REQUEST,
                    "data":null
                }
            }


        },

        // addASeries:(parent,{series})=>{
        //     const newSeries = new Series({
        //         seriesName : series.seriesName,
        //         year:series.year,
        //         rating : series.rating
        //     })
        //
        //     newSeries.id = newSeries._id
        //
        //     return new Promise((resolve , reject)=>{
        //         newSeries.save((err,document)=>{
        //             if(err){
        //                 reject(err)
        //             }
        //             else{
        //                 resolve(document)
        //             }
        //         })
        //     })
        // }
    }
}