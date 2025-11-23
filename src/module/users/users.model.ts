import GlobalInterface from '@interface/global.interface'
import UsersQuery from '@query/users.query'

namespace UsersModel {

    export async function getUsersAll(query: GlobalInterface.IGetAll) {
        const users = await UsersQuery.getUsersAll(query)

        return users
    }
    
}

export default UsersModel