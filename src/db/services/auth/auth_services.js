import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class AuthServices {
    build_token = (user) => {
        const access_token =  jwt.sign({
                token_type : "Bearer/Access",
                friend_id: user.id,
                firstName : user.firstName,
                lastName : user.lastName
            },
            process.env.JWT_SECRET, {expiresIn: '7d'});

        const refresh_token =  jwt.sign({
                token_type : "Refresh",
                friend_id: user.id,
                firstName : user.firstName,
                lastName : user.lastName
            },
            process.env.JWT_SECRET, {expiresIn: '30d'});

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    }
    hash_password = async (password) => {
        return await bcrypt.hash(password, await bcrypt.genSalt(12));

    }
    verifyToken = (token) => {
        return jwt.verify(token, process.env.JWT_SECRET);

    }
}
export default AuthServices;