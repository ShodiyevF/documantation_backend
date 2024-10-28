import AuthInterface from "@interface/auth.interface";
import UsersQuery from "@query/users.query";
import Exception from "@lib/httpException";
import JWT from "@lib/jwt";

namespace AuthModel {

    export async function register(body: AuthInterface.IRegisterBody) {
        const {
            user_first_name,
            user_last_name,
            user_email,
            user_password
        } = body


        const checkEmail = await UsersQuery.getUserByEmail(user_email)
        if (checkEmail) {
            throw new Exception.HttpException(409, 'Email already exists', Exception.Errors.ALREADY_EXISTS)
        }

        await UsersQuery.insertUser({
            userFirstName: user_first_name,
            userLastName: user_last_name,
            userEmail: user_email,
            userPassword: user_password
        })
        
    }

    export async function login(body: AuthInterface.IRegisterBody) {
        const {
            user_email,
            user_password
        } = body


        const user = await UsersQuery.getUserByEmail(user_email)
        if (!user || user.userPassword !== user_password) {
            throw new Exception.HttpException(400, 'Wrong email or password', Exception.Errors.UNAUTHORIZED)
        }

        return JWT.requestJwtToken({
            id: user.userId
        })
    }

}

export default AuthModel