import ApisInterface from "@interface/apis.inteface"
import ProjectsQuery from "@query/projects.query"
import Exception from "@lib/httpException"
import ApisQuery from "@query/apis.query"
import JWT from "@lib/jwt"

namespace ApisModel {

    export async function getApis(params: ApisInterface.IGetApis, token: string) {
        const {
            projectId
        } = params

        const userId = JWT.verifyJwtToken(token)

        const getProject = await ProjectsQuery.getProjectsById({
            project_id: projectId,
            user_id: userId
        })
        if (!getProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.FRONT.PROJECT_NOT_FOUND)
        }

        const checkUserProject = await ProjectsQuery.checkProjectByUserId(userId, projectId)
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You do not have access to this project', Exception.Errors.NO_ACCESS)
        }

        return await ApisQuery.getApisByProjectId(projectId)
    }


}

export default ApisModel