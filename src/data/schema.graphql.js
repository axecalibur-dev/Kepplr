import {gql} from 'apollo-server-express'

const typeDefs = gql`
    
    scalar JSON_Object
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

    input SignupDTO{
        id:ID
        firstName:String
        lastName:String
        password : String!
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
        meta:JSON_Object
    }
    
    type SignupResponse{
        message : String
        status : String
        refresh_token : JSON_Object
        access_token : JSON_Object
        data :[Friend]
        meta:JSON_Object
    }

    type MutationFriendResponse{
        message : String
        status : String
        data :Friend
        meta:JSON_Object
    }
    
    input Identity {
        id : ID
    }
        
    input LoginDTO {
        email : String
        password : String!
    }
    
    input TokenDTO {
        refresh_token:String
    }
    
    input ResetPasswordDTO {
        email : String
    }

    input PasswordResetDTO {
        password_request_otp : String
        new_password : String
        reenter_password : String
    }
    
    type Query{
        getAllFriend:QueryFriendResponse
        getAFriendByID(input:Identity):QueryFriendResponse
        regenerate_token(input:TokenDTO):SignupResponse
    }

    type Mutation{
        updateFriend(input:FriendRequestDTO):MutationFriendResponse
        sign_up(input:SignupDTO):SignupResponse
        login(input:LoginDTO):SignupResponse
        reset_password(input:ResetPasswordDTO):MutationFriendResponse
        set_password(input:PasswordResetDTO):MutationFriendResponse
        
    }
 
`;

export default typeDefs;