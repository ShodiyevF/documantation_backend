import ProjectsInterface from "@interface/projects.inteface"
import DatabaseFunctions from "@database/functions.database"
import DbTableSchema from "@database/schema.database"
import ProjectsQuery from "@query/projects.query"
import Exception from "@lib/http_exception.lib"
import UsersQuery from "@query/users.query"
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

    export async function getProjectInvitations(token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        return await ProjectsQuery.getProjectInvitations(userId)
    }

    export async function createProjectInvitations(body: ProjectsInterface.ICreateProjectInvitationBody, token: string) {
        const {
            project_id,
            user_ids,
        } = body

        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectOwnerId: userId,
                projectId: project_id,
                projectIsDeleted: false,
            }
        })
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        const checkUsers = await UsersQuery.getUsersById(user_ids)
        if (checkUsers.length !== user_ids.length) {
            const notFound = user_ids.filter(userId => !checkUsers.map(user => user.userId).includes(userId))
            
            throw new Exception.HttpException(404, `${notFound.join(', ')}: user ids not found`, Exception.Errors.USER_NOT_FOUND_BY_IDS)
        }

        const projectUsers = await ProjectsQuery.getProjectUsers(project_id)
        
        let mustInvite = user_ids.filter(userId => !projectUsers.map(projectUser => projectUser.userId).includes(userId))

        const getInserted = await ProjectsQuery.getActiveProjectInvitationsByUserIds({
            projectId: project_id,
            userIds: user_ids
        })
        if (getInserted.length) {
            await ProjectsQuery.updateProjectInvitationsUpdatedAt(getInserted.map(data => data.piId))

            mustInvite = mustInvite.filter(data => !getInserted.map(data => data.userId).includes(data))
        }
        
        if (!mustInvite.length) {
            return ''
        }
        
        const projectInvitationsDatas: DbTableSchema.InferInsertType<typeof DbTableSchema.projectInvitations>[] = mustInvite.map(userId => ({
            piProjectId: project_id,
            piUserId: userId
        }))

        await DatabaseFunctions.bulkInsert({
            tableName: 'projectInvitations',
            data: projectInvitationsDatas
        })
    }

}

export default ProjectsModel