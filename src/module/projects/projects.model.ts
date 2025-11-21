import ProjectsInterface from "@interface/projects.inteface"
import DatabaseFunctions from "@database/functions.database"
import ProjectsQuery from "@query/projects.query"
import Exception from "@lib/http_exception.lib"
import FinderLib from "@lib/finder.lib"

namespace ProjectsModel {

    export async function getProjects(token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        return await ProjectsQuery.getUserProjects(userId)
    }

    export async function createProject(body: ProjectsInterface.ICreateProjectBody, token: string) {
        const {
            project_name,
            project_base_url,
            project_authorization_type,
            project_description,
        } = body

        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const checkProject = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectOwnerId: userId,
                projectName: project_name,
                projectIsDeleted: false,
            }
        })

        console.log(checkProject);
        
        if (checkProject) {
            throw new Exception.HttpException(409, 'Project name already exists', Exception.Errors.PROJECT_ALREADY_EXISTS)
        }

        const project = await DatabaseFunctions.insert({
            tableName: 'projects',
            data: {
                projectName: project_name,
                projectBaseUrl: project_base_url,
                projectAuthorizationType: project_authorization_type,
                projectDescription: project_description,
                projectOwnerId: userId
            }
        })

        await DatabaseFunctions.insert({
            tableName: 'projectUsers',
            data: {
                puProjectId: project.projectId,
                puUserId: userId
            }
        })
    }

}

export default ProjectsModel