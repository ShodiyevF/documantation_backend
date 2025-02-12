import { and, eq } from "drizzle-orm"

import ApisInterface from "@interface/apis.inteface"
import DbTableSchema from "@database/schema"
import { db } from "@database/pg"

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

    //! APIS_END


    //! RESPONSE_START
    
    export async function insertResponse(payloads: ApisInterface.IInsertApiResponse) {
        return await db.insert(DbTableSchema.responses)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }

    export async function insertResponseKey(payloads: ApisInterface.IInsertResponseKey) {
        return await db.insert(DbTableSchema.responseKeys)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }
    
    //! RESPONSE_END


    //! PAYLOAD_END

    export async function insertPayload(payloads: ApisInterface.IInsertPayload) {
        return await db.insert(DbTableSchema.payloads)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }

    export async function insertPayloadKey(payloads: ApisInterface.IInsertPayloadKey) {
        return await db.insert(DbTableSchema.payloadKeys)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }

    //! PAYLOAD_END

    
}

export default ApisQuery