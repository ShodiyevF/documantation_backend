import ProjectsQuery from "@query/projects.query"
import JWT from "@lib/jwt"

namespace ProjectsModel {

    export async function projects(token: string) {

        const userId = JWT.verifyJwtToken(token)

        return await ProjectsQuery.getProjectsByUserId(userId)
    }

}

export default ProjectsModel