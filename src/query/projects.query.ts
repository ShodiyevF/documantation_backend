import { and, eq } from "drizzle-orm"

import ProjectsInterface from "@interface/projects.inteface"
import DbTableSchema from "@database/schema"
import { db } from "@database/pg"

namespace ProjectsQuery {

    export async function getProjectsByUserId(userId: string) {
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_description: DbTableSchema.projects.projectDescription,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projectUsers)
        .innerJoin(DbTableSchema.projects, eq(DbTableSchema.projects.projectId, DbTableSchema.projectUsers.puProjectId))
        .where(eq(DbTableSchema.projectUsers.puUserId, userId))
    }

    export async function getProjectsByName(payloads: ProjectsInterface.IGetProjectByName) {
        const {
            project_name,
            user_id
        } = payloads
        
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_description: DbTableSchema.projects.projectDescription,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projects)
        .where(and(
            eq(DbTableSchema.projects.projectOwnerId, user_id),
            eq(DbTableSchema.projects.projectName, project_name),
        ))
        .then(data => data[0])
    }

    export async function insertProject(payloads: ProjectsInterface.ICreateProject) {
        return await db.insert(DbTableSchema.projects)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }

    export async function attachUserToProject(payloads: ProjectsInterface.IAttachUserToProject) {
        return await db.insert(DbTableSchema.projectUsers)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }
    
}

export default ProjectsQuery