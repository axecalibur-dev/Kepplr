import ControllerServices from "../db/services/controller_services";
const Controller = new ControllerServices()
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

        login : (parent, {input}) => {
            return Controller.login_user(
                parent, {input}
            )
        }
    },
}