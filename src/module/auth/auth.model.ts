import DatabaseFunctions from "@database/functions.database";
import AuthInterface from "@interface/auth.interface";
import Exception from "@lib/http_exception.lib";
import JWT from "@lib/jwt.lib";

namespace AuthModel {

    export async function register(body: AuthInterface.IRegisterBody) {
        const {
            user_first_name,
            user_last_name,
            user_email,
            user_password
        } = body


        const checkEmail = await DatabaseFunctions.select({
            tableName: 'users',
            filter: {
                userEmail: user_email
            }
        })
        if (checkEmail) {
            throw new Exception.HttpException(409, 'Email already exists', Exception.Errors.EMAIL_ALREADY_EXISTS)
        }

        await DatabaseFunctions.insert({
            tableName: 'users',
            data: {
                userFirstName: user_first_name,
                userLastName: user_last_name,
                userEmail: user_email,
                userPassword: user_password
            }
        })
    }

    export async function login(body: AuthInterface.IRegisterBody) {
        const {
            user_email,
            user_password
        } = body


        const user = await DatabaseFunctions.select({
            tableName: 'users',
            filter: {
                userEmail: user_email
            }
        })
        if (!user || user.userPassword !== user_password) {
            throw new Exception.HttpException(400, 'Wrong email or password', Exception.Errors.WRONG_EMAIL_OR_PASSWORD)
        }

        return JWT.requestJwtToken({
            id: user.userId
        })
    }

}

export default AuthModel