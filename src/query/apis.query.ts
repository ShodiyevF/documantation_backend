import { eq } from "drizzle-orm"

import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace ApisQuery {

    //! APIS_START
    
    export async function getApisByProjectId(projectId: string) {
        return await db.select({
            api_id: DbTableSchema.apis.apiId,
            api_name: DbTableSchema.apis.apiName,
            api_route: DbTableSchema.apis.apiRoute,
            api_method: DbTableSchema.apis.apiMethod,
            api_description: DbTableSchema.apis.apiDescription,
            project: {
                project_id: DbTableSchema.projects.projectId,
                project_name: DbTableSchema.projects.projectName,
            },
            api_created_at: DbTableSchema.apis.apiCreatedAt
        })
        .from(DbTableSchema.projects)
        .innerJoin(DbTableSchema.apis, eq(DbTableSchema.apis.apiProjectId, DbTableSchema.projects.projectId))
        .where(eq(DbTableSchema.projects.projectId, projectId))
    }

    export async function getApiById(apiId: string) {
        return await db.select()
        .from(DbTableSchema.apis)
        .where(eq(DbTableSchema.apis.apiId, apiId))
        .then(data => data[0])
    }

    //! APIS_END

    
}

export default ApisQuery