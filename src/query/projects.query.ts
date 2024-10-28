import { eq } from "drizzle-orm"

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
    
}

export default ProjectsQuery