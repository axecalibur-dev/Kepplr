import {Friends , Series} from "../db/dbConnector";

export const resolvers= {
    Query : {
        getAllFriend:(parent) => {
            return new Promise((resolve , reject)=>{
                Friends.find((err,friends)=>{
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(friends)
                    }
                })
            })
        },

        findASeries:(root ,{id})=>{
            return new Promise((resolve,reject)=>{
                Series.findOne({_id:id},(err,series)=>{
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(series)
                    }
                })
            })
        }
    },

    Mutation : {
        createFriend : (parent , {input})=>{
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

            return new Promise((resolve,reject)=>{
                newFriend.save((err,document)=>{
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(document)
                    }
                })
            })
        },

        addASeries:(parent,{series})=>{
            const newSeries = new Series({
                seriesName : series.seriesName,
                year:series.year,
                rating : series.rating
            })

            newSeries.id = newSeries._id

            return new Promise((resolve , reject)=>{
                newSeries.save((err,document)=>{
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(document)
                    }
                })
            })
        }
    }
}