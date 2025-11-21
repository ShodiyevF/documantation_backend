import ProjectsInterface from "@interface/projects.inteface"
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
            project_description
        } = body

        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const checkProject = await ProjectsQuery.getProjectsByName({
            project_name,
            user_id: userId
        })
        if (checkProject) {
            throw new Exception.HttpException(409, 'Project name already exists', Exception.Errors.PROJECT_ALREADY_EXISTS)
        }

        // const project = await ProjectsQuery.insertProject({
        //     projectName: project_name,
        //     projectDescription: project_description,
        //     projectOwnerId: userId
        // })

        // await ProjectsQuery.attachUserToProject({
        //     puProjectId: project.projectId,
        //     puUserId: userId
        // })
    }

}

export default ProjectsModel