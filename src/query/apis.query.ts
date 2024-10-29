import { eq } from "drizzle-orm"

import DbTableSchema from "@database/schema"
import { db } from "@database/pg"

namespace ApisQuery {

    export async function getApisByProjectId(projectId: string) {
        return await db.select({
            project_id: DbTableSchema.projects.projectId,
            project_name: DbTableSchema.projects.projectName,
            api_id: DbTableSchema.apis.apiId,
            api_route: DbTableSchema.apis.apiRoute,
            api_method: DbTableSchema.apis.apiMethod,
            api_created_at: DbTableSchema.apis.apiCreatedAt
        })
        .from(DbTableSchema.projects)
        .innerJoin(DbTableSchema.apis, eq(DbTableSchema.apis.apiProjectId, DbTableSchema.projects.projectId))
        .where(eq(DbTableSchema.projects.projectId, projectId))
    }
    
}

export default ApisQuery