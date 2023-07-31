import ControllerServices from "../db/services/controller_services";
import Utils from "../utils/utils";
import AuthServices from "../db/services/auth/auth_services";
const Controller = new ControllerServices()

const utils = new Utils();
const auth = new AuthServices()
export const resolvers = {
    Query : {
        getAllFriend: async (parent) => {
            return Controller.getAllUsers(
                parent
            )
        },

        getAFriendByID: async (parent, {input} ) => {
            return Controller.getOneUserByID(
                parent, {input}
            )
        },

        regenerate_token : async (parent , {input}) => {
            return Controller.regenerate_token(
                parent, {input}
            )
        }

    },

    Mutation : {
        updateFriend : async (parent ,{input})=>{
            return Controller.update_user(
                parent, {input}
            )
        },

        sign_up : (parent, {input}) => {
            return Controller.sign_up_user(
                parent, {input}
            )
        },

        login : (parent, {input},context, info) => {
            return Controller.login_user(
                parent, {input} , context , info
            )
        },

        reset_password: (parent, {input}) =>{
            return auth.reset_password(parent, {input})
        },

        set_password:(parent, {input}) =>{
            return auth.initiate_reset_password_service(parent, {input})
        }
    },
}