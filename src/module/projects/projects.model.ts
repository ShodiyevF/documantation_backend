import ProjectsInterface from "@interface/projects.inteface"
import UsefulfunctionsUtil from "@util/usefulfunctions.util"
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

    export async function getProjectById(project_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const project = await ProjectsQuery.getProjectById({
            projectId: project_id,
            userId: userId
        })
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        return project
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

    export async function updateProject(body: ProjectsInterface.IUpdateProjectBody, projectId: string, token: string) {
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
                projectId: projectId,
                projectOwnerId: userId
            }
        })
        if (!checkProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        const projectName = project_name ? project_name : checkProject.projectName 
        const projectBaseUrl = UsefulfunctionsUtil.isNullableData(project_base_url, checkProject.projectBaseUrl)
        const projectAuthorizationType = UsefulfunctionsUtil.isNullableData(project_authorization_type, checkProject.projectAuthorizationType)
        const projectDescription = UsefulfunctionsUtil.isNullableData(project_description, checkProject.projectDescription)

        const checkProjectName = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectOwnerId: userId,
                projectName: projectName,
                projectIsDeleted: false,
            }
        })
        if (checkProjectName && checkProjectName.projectId != projectId) {
            throw new Exception.HttpException(409, 'Project name already exists', Exception.Errors.PROJECT_ALREADY_EXISTS)
        }

        await DatabaseFunctions.update({
            tableName: 'projects',
            data: {
                projectName: projectName,
                projectBaseUrl: projectBaseUrl,
                projectAuthorizationType: projectAuthorizationType,
                projectDescription: projectDescription,
            },
            targets: [
                {
                    targetColumn: 'projectId',
                    targetValue: projectId
                }
            ]
        })
    }

    export async function deleteProject(projectId: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const checkProject = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: projectId,
                projectIsDeleted: false,
                projectOwnerId: userId
            }
        })
        if (!checkProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        await DatabaseFunctions.update({
            tableName: 'projects',
            data: {
                projectIsDeleted: true
            },
            targets: [
                {
                    targetColumn: 'projectId',
                    targetValue: projectId
                }
            ]
        })
    }

    export async function transferProjectOwnership(body: ProjectsInterface.ITransferProjectOwnershipBody, token: string) {
        const {
            project_id,
            user_id
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectIsDeleted: false,
                projectOwnerId: userId
            }
        })
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        const projectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: user_id
            }
        })
        if (!projectUser) {
            throw new Exception.HttpException(404, 'Project user not found', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        await DatabaseFunctions.update({
            tableName: 'projects',
            data: {
                projectOwnerId: user_id
            },
            targets: [
                {
                    targetColumn: 'projectId',
                    targetValue: project_id
                }
            ]
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

    export async function confirmProjectInvitation(body: ProjectsInterface.IConfirmProjectInvitationBody, token: string) {
        const {
            invitation_id,
            is_confirmed
        } = body

        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const invitation = await DatabaseFunctions.select({
            tableName: 'projectInvitations',
            filter: {
                piId: invitation_id,
                piUserId: userId
            }
        })
        if (!invitation) {
            throw new Exception.HttpException(404, 'Project invitation not found', Exception.Errors.PROJECT_INVITATION_NOT_FOUND)
        }

        if (invitation.piAccepted || invitation.piIsDeleted) {
            throw new Exception.HttpException(404, 'Project invitation not found', Exception.Errors.PROJECT_INVITATION_NOT_FOUND)
        }

        await DatabaseFunctions.insert({
            tableName: 'projectUsers',
            data: {
                puProjectId: invitation.piProjectId,
                puUserId: userId
            }
        })
        
        const data = is_confirmed ? {
            piAccepted: true
        } : {
            piIsDeleted: false
        }
        
        await DatabaseFunctions.update({
            tableName: 'projectInvitations',
            data: data,
            targets: [
                {
                    targetColumn: 'piId',
                    targetValue: invitation_id
                }
            ]
        })
    }

    export async function leaveProject(body: ProjectsInterface.ILeaveProjectBody, token: string) {
        const {
            project_id
        } = body

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
        })
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        if (project.projectOwnerId === userId) {
            throw new Exception.HttpException(404, 'You are the project owner. Please transfer ownership of the project to another user to leave the project.', Exception.Errors.PLEASE_TRANSFER_PROJECT_OWNERSHIP)
        }

        const projectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: userId
            }
        })
        if (!projectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        await DatabaseFunctions.remove({
            tableName: 'projectUsers',
            targets: [
                {
                    targetColumn: 'puId',
                    targetValue: projectUser.puId
                }
            ]
        })

    }

    export async function removeProjectUser(body: ProjectsInterface.IRemoveProjectUserBody, token: string) {
        const {
            project_id,
            user_id
        } = body

        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectIsDeleted: false,
                projectOwnerId: userId
            }
        })
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }

        const projectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: user_id
            }
        })
        if (!projectUser) {
            throw new Exception.HttpException(404, 'Project user not found', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        await DatabaseFunctions.remove({
            tableName: 'projectUsers',
            targets: [
                {
                    targetColumn: 'puId',
                    targetValue: projectUser.puId
                }
            ]
        })

    }

}

export default ProjectsModel