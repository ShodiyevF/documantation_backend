import GlobalInterface from '@interface/global.interface'
import Exception from '@lib/http_exception.lib'
import UsersQuery from '@query/users.query'
import FinderLib from '@lib/finder.lib'

namespace UsersModel {

    export async function getMe(token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        return await UsersQuery.getMe(userId)
    }

    export async function getUsersAll(query: GlobalInterface.IGetAll) {
        const users = await UsersQuery.getUsersAll(query)

        return users
    }
    
}

export default UsersModel