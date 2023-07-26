import {gql} from 'apollo-server-express'

export const typeDefs = gql`
    
    type Friend{
        id:ID
        firstName:String
        lastName:String
#        gender:Gender
        language:String
        age:Int
        email: String
#        contacts:[Contact]
    }

#    type Contact{
#        firstName:String
#        lastName:String
#    }

#    type Series {
#        id:ID
#        seriesName:String
#        year:Int
#        rating:Rating
#    }

#    enum Rating{
#        ONE
#        TWO
#        THREE
#    }

#    enum Gender{
#        MALE
#        FEMALE
#        OTHER
#    }

#    input SeriesInput{
#        id:ID
#        seriesName:String
#        year:Int
#        rating:Rating
#    }

    input FriendRequestDTO{
        id:ID
        firstName:String
        lastName:String
#        gender:Gender
        language:String
        age:Int
        email: String
#        contacts:[ContactInput]
    }

#    input ContactInput{
#        firstName:String
#        lastName:String
#    }

    type QueryFriendResponse{
        message : String
        status : String
        data :[Friend]
    }

    type MutationFriendResponse{
        message : String
        status : String
        data :Friend
    }

    type Query{
        getAllFriend:QueryFriendResponse
        
#        getAFriendByID:GenericFriendResponse
#        findASeries(id:ID):Series
    }

    type Mutation{
        createFriend(input:FriendRequestDTO):MutationFriendResponse
        updateFriend(input:FriendRequestDTO):MutationFriendResponse
#        addASeries(series:SeriesInput):Series
    }
    
    

`;

