import { and, desc, eq, inArray, sql } from "drizzle-orm"

import ProjectsInterface from "@interface/projects.inteface"
import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace ProjectsQuery {

    //! SELECT_START
    
    export async function getUserProjects(userId: string) {
        const projectUsers = db.select({
            projectId: DbTableSchema.projects.projectId,
            projectUsers: sql`
                array_agg(
                    jsonb_build_object(
                        'user_id', ${DbTableSchema.users.userId},
                        'user_first_name', ${DbTableSchema.users.userFirstName},
                        'user_last_name', ${DbTableSchema.users.userLastName},
                        'user_email', ${DbTableSchema.users.userEmail}
                    )
                )
            `.as('projectUsers')
        })
        .from(DbTableSchema.projects)
        .leftJoin(DbTableSchema.projectUsers, eq(DbTableSchema.projectUsers.puProjectId, DbTableSchema.projects.projectId))
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.projectUsers.puUserId))
        .groupBy(DbTableSchema.projects.projectId)
        .as('project_users_rows')
        
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_base_url: DbTableSchema.projects.projectBaseUrl,
            project_authorization_type: DbTableSchema.projects.projectAuthorizationType,
            project_description: DbTableSchema.projects.projectDescription,
            project_users: projectUsers.projectUsers,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projectUsers)
        .leftJoin(DbTableSchema.projects, eq(DbTableSchema.projects.projectId, DbTableSchema.projectUsers.puProjectId))
        .leftJoin(projectUsers, eq(projectUsers.projectId, DbTableSchema.projects.projectId))
        .where(
            and(
                eq(DbTableSchema.projects.projectIsDeleted, false),
                eq(DbTableSchema.projectUsers.puUserId, userId),
            )
        )
        .orderBy(
            desc(DbTableSchema.projects.projectCreatedAt)
        )
        // .groupBy(
        //     DbTableSchema.projects.projectId,
        //     DbTableSchema.projects.projectName,
        //     DbTableSchema.projects.projectBaseUrl,
        //     DbTableSchema.projects.projectAuthorizationType,
        //     DbTableSchema.projects.projectDescription,
        //     DbTableSchema.projects.projectCreatedAt,
        // )
    }
    
    export async function getProjectById(payloads: ProjectsInterface.IGetProjectByIdPayloads) {
        const {
            projectId,
            userId
        } = payloads

        const projectUsers = db.select({
            projectId: DbTableSchema.projects.projectId,
            projectUsers: sql`
                array_agg(
                    jsonb_build_object(
                        'user_id', ${DbTableSchema.users.userId},
                        'user_first_name', ${DbTableSchema.users.userFirstName},
                        'user_last_name', ${DbTableSchema.users.userLastName},
                        'user_email', ${DbTableSchema.users.userEmail}
                    )
                )
            `.as('projectUsers')
        })
        .from(DbTableSchema.projects)
        .leftJoin(DbTableSchema.projectUsers, eq(DbTableSchema.projectUsers.puProjectId, DbTableSchema.projects.projectId))
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.projectUsers.puUserId))
        .groupBy(DbTableSchema.projects.projectId)
        .as('project_users_rows')
        
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_base_url: DbTableSchema.projects.projectBaseUrl,
            project_authorization_type: DbTableSchema.projects.projectAuthorizationType,
            project_description: DbTableSchema.projects.projectDescription,
            project_users: projectUsers.projectUsers,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projectUsers)
        .leftJoin(DbTableSchema.projects, eq(DbTableSchema.projects.projectId, DbTableSchema.projectUsers.puProjectId))
        .leftJoin(projectUsers, eq(projectUsers.projectId, DbTableSchema.projects.projectId))
        .where(
            and(
                eq(DbTableSchema.projects.projectIsDeleted, false),
                eq(DbTableSchema.projectUsers.puUserId, userId),
                eq(DbTableSchema.projectUsers.puProjectId, projectId)
            )
        )
        .orderBy(
            desc(DbTableSchema.projects.projectCreatedAt)
        )
        .then(data => data[0])
    }
    
    export async function getProjectInvitations(userId: string) {
        return await db.select({
            invitation_id: DbTableSchema.projectInvitations.piId,
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_created_at: DbTableSchema.projectInvitations.piUpdatedAt
        })
        .from(DbTableSchema.projectInvitations)
        .leftJoin(DbTableSchema.projects, eq(DbTableSchema.projects.projectId, DbTableSchema.projectInvitations.piProjectId))
        .where(
            and(
                eq(DbTableSchema.projectInvitations.piAccepted, false),
                eq(DbTableSchema.projectInvitations.piIsDeleted, false),
                eq(DbTableSchema.projectInvitations.piUserId, userId),
            )
        )
        .orderBy(
            desc(DbTableSchema.projectInvitations.piUpdatedAt)
        )
    }
    
    export async function getActiveProjectInvitationsByUserIds(payloads: ProjectsInterface.IGetProjectInvitationsByUserIdsQuery) {
        const {
            projectId,
            userIds
        } = payloads
        
        return await db.select({
            piId: DbTableSchema.projectInvitations.piId,
            userId: DbTableSchema.projectInvitations.piUserId
        })
        .from(DbTableSchema.projectInvitations)
        .where(
            and(
                eq(DbTableSchema.projectInvitations.piProjectId, projectId),
                inArray(DbTableSchema.projectInvitations.piUserId, userIds),
                eq(DbTableSchema.projectInvitations.piIsDeleted, false),
                eq(DbTableSchema.projectInvitations.piAccepted, false),
            )
        )
    }
    
    export async function getProjectUsers(projectId: string) {
        return await db.select({
            puId: DbTableSchema.projectUsers.puId,
            userId: DbTableSchema.projectUsers.puUserId,
        })
        .from(DbTableSchema.projectUsers)
        .where(
            eq(DbTableSchema.projectUsers.puProjectId, projectId)
        )
    }

    //! SELECT_END

    
    //! INSERT_START
    
    //! INSERT_END

    
    //! UPDATE_START
    
    export async function updateProjectInvitationsUpdatedAt(piIds: string[]) {
        return await db.update(DbTableSchema.projectInvitations)
        .set({
            piUpdatedAt: new Date()
        })
        .where(
            inArray(DbTableSchema.projectInvitations.piId, piIds)
        )
        .returning()
    }

    //! UPDATE_END
    
}

export default ProjectsQuery