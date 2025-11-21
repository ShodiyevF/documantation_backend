import { and, desc, eq } from "drizzle-orm"

import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace ProjectsQuery {

    export async function getUserProjects(userId: string) {
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            project_description: DbTableSchema.projects.projectDescription,
            project_created_at: DbTableSchema.projects.projectCreatedAt,
        })
        .from(DbTableSchema.projects)
        .innerJoin(DbTableSchema.projectUsers, and(
            eq(DbTableSchema.projectUsers.puProjectId, DbTableSchema.projects.projectId),
            eq(DbTableSchema.projectUsers.puUserId, userId),
        ))
        .where(
            and(
                eq(DbTableSchema.projects.projectIsDeleted, false),
                eq(DbTableSchema.projects.projectOwnerId, userId),
            )
        )
        .orderBy(
            desc(DbTableSchema.projects.projectCreatedAt)
        )
    }
    
}

export default ProjectsQuery