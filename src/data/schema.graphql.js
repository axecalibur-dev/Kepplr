import {gql} from 'apollo-server-express'

const typeDefs = gql`
    
    scalar JSON_TYPE
    enum Gender{
        MALE
        FEMALE
        OTHER
    }

    type Contact{
        firstName:String
        lastName:String
    }
    
    type Friend{
        id:ID
        firstName:String
        lastName:String
        gender:Gender
        language:String
        age:Int
        email: String
        contacts:[Contact]
    }



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
    

#    input SeriesInput{
#        id:ID
#        seriesName:String
#        year:Int
#        rating:Rating
#    }

    input ContactInput{
        firstName:String
        lastName:String
    }

    input FriendRequestDTO{
        id:ID
        firstName:String
        lastName:String
        gender:Gender
        language:String
        age:Int
        email: String
        contacts:[ContactInput]
    }



    type QueryFriendResponse{
        message : String
        status : String
        data :[Friend]
        meta:JSON_TYPE
    }

    type MutationFriendResponse{
        message : String
        status : String
        data :Friend
        meta:JSON_TYPE
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

export default typeDefs;