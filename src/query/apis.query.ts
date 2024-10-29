import { and, eq } from "drizzle-orm"

import DbTableSchema from "@database/schema"
import { db } from "@database/pg"
import ApisInterface from "@interface/apis.inteface"

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

    export async function getApiByRoute(payloads: ApisInterface.IGetApiByRoute) {
        const {
            projectId,
            apiRoute
        } = payloads
        
        return await db.select()
        .from(DbTableSchema.apis)
        .where(and(
            eq(DbTableSchema.apis.apiRoute, apiRoute),
            eq(DbTableSchema.apis.apiProjectId, projectId),
        ))
    }

    export async function insertApi(payloads: ApisInterface.IInsertApi) {
        return await db.insert(DbTableSchema.apis)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }
    
}

export default ApisQuery