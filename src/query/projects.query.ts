import { and, desc, eq, or } from "drizzle-orm"

import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace ProjectsQuery {

    export async function getUserProjects(userId: string) {
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_base_url: DbTableSchema.projects.projectBaseUrl,
            project_authorization_type: DbTableSchema.projects.projectAuthorizationType,
            project_description: DbTableSchema.projects.projectDescription,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projects)
        .fullJoin(DbTableSchema.projectUsers, eq(DbTableSchema.projectUsers.puUserId, userId))
        .where(
            and(
                eq(DbTableSchema.projects.projectIsDeleted, false),
                or(
                    eq(DbTableSchema.projects.projectOwnerId, userId),
                    eq(DbTableSchema.projectUsers.puUserId, userId),
                )
            )
        )
        .orderBy(
            desc(DbTableSchema.projects.projectCreatedAt)
        )
    }
    
}

export default ProjectsQuery