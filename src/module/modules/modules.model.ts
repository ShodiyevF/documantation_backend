import DatabaseFunctions from '@database/functions.database'
import ModulesInterface from '@interface/modules.interface'
import Exception from '@lib/http_exception.lib'
import ModulesQuery from '@query/modules.query'
import FinderLib from '@lib/finder.lib'

namespace ModulesModel {
    
    export async function getModules(query: ModulesInterface.IGetModulesQuery, token: string) {
        const {
            limit,
            page,
            project_id
        } = query
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectIsDeleted: false
            }
        });
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }
        
        const checkProjectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: userId
            }
        })
        if (!checkProjectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        const result = await ModulesQuery.getModules({
            projectId: project_id,
            limit: limit,
            page: page
        })
        const totalPages = Math.ceil(result.count / limit);

        return {
            total_page: totalPages,
            current_page: page,
            data: result.data
        }
    }
    
}

export default ModulesModel