import ProjectsInterface from "@interface/projects.inteface"
import ProjectsQuery from "@query/projects.query"
import Exception from "@lib/http_exception.lib"
import JWT from "@lib/jwt.lib"

namespace ProjectsModel {

    export async function projects(token: string) {

        const userId = JWT.verifyJwtToken(token)

        return await ProjectsQuery.getProjectsByUserId(userId)
    }

    export async function createProject(body: ProjectsInterface.ICreateProjectBody,token: string) {
        const {
            project_name,
            project_description
        } = body

        const userId = JWT.verifyJwtToken(token)

        const checkProject = await ProjectsQuery.getProjectsByName({
            project_name,
            user_id: userId
        })
        if (checkProject) {
            throw new Exception.HttpException(409, 'Project name already exists', Exception.Errors.ALREADY_EXISTS)
        }

        const project = await ProjectsQuery.insertProject({
            projectName: project_name,
            projectDescription: project_description,
            projectOwnerId: userId
        })

        await ProjectsQuery.attachUserToProject({
            puProjectId: project.projectId,
            puUserId: userId
        })
    }

}

export default ProjectsModel