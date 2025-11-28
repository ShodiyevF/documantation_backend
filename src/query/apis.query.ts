import { and, count, eq, sql } from "drizzle-orm"

import DbTableSchema from "@database/schema.database"
import ApisInterface from "@interface/apis.inteface"
import { db } from "@database/pg.database"

namespace ApisQuery {

    //! APIS_START
    
    export async function getApisByModuleId(payloads: ApisInterface.IGetApisPayloads) {
        const {
            limit,
            page,
            moduleId
        } = payloads
        
        const apiPayloads = db.select({
            api_id: DbTableSchema.payloads.payloadApiId,
            payloads: sql`
                json_agg(
                    jsonb_build_object(
                        'payload_id', ${DbTableSchema.payloads.payloadId},
                        'payload_type', ${DbTableSchema.payloads.payloadType},
                        'payload_schema', ${DbTableSchema.payloads.payloadSchema},
                        'payload_example', ${DbTableSchema.payloads.payloadExample},
                        'payload_description', ${DbTableSchema.payloads.payloadDescription},
                        'payload_owner', jsonb_build_object(
                            'user_id', ${DbTableSchema.users.userId},
                            'user_first_name', ${DbTableSchema.users.userFirstName},
                            'user_last_name', ${DbTableSchema.users.userLastName},
                            'user_email', ${DbTableSchema.users.userEmail}
                        ),
                        'payload_created_at', ${DbTableSchema.payloads.payloadCreatedAt}
                    )
                ) FILTER (WHERE ${DbTableSchema.payloads.payloadId} IS NOT NULL)
            `.as('payloads')
        })
        .from(DbTableSchema.payloads)
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.payloads.payloadOwnerId))
        .groupBy(DbTableSchema.payloads.payloadApiId)
        .as('api_payloads');

        const apiResponses = db.select({
            api_id: DbTableSchema.responses.responseApiId,
            responses: sql`
                json_agg(
                    jsonb_build_object(
                        'response_id', ${DbTableSchema.responses.responseId},
                        'response_type', ${DbTableSchema.responses.responseType},
                        'response_schema', ${DbTableSchema.responses.responseSchema},
                        'response_example', ${DbTableSchema.responses.responseExample},
                        'response_description', ${DbTableSchema.responses.responseDescription},
                        'response_owner', jsonb_build_object(
                            'user_id', ${DbTableSchema.users.userId},
                            'user_first_name', ${DbTableSchema.users.userFirstName},
                            'user_last_name', ${DbTableSchema.users.userLastName},
                            'user_email', ${DbTableSchema.users.userEmail}
                        ),
                        'response_created_at', ${DbTableSchema.responses.responseCreatedAt}
                    )
                ) FILTER (WHERE ${DbTableSchema.responses.responseId} IS NOT NULL)
            `.as('responses')
        })
        .from(DbTableSchema.responses)
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.responses.responseOwnerId))
        .groupBy(DbTableSchema.responses.responseApiId)
        .as('api_responses');
        
        const data = await db.select({
            api_id: DbTableSchema.apis.apiId,
            api_name: DbTableSchema.apis.apiName,
            api_route: DbTableSchema.apis.apiRoute,
            api_method: DbTableSchema.apis.apiMethod,
            api_authorization: DbTableSchema.apis.apiAuthorization,
            api_description: DbTableSchema.apis.apiDescription,
            api_module: {
                module_id: DbTableSchema.modules.moduleId,
                module_name: DbTableSchema.modules.moduleName,
            },
            api_owner: {
                user_id: DbTableSchema.users.userId,
                user_first_name: DbTableSchema.users.userFirstName,
                user_last_name: DbTableSchema.users.userLastName,
                user_email: DbTableSchema.users.userEmail,
            },
            api_created_at: DbTableSchema.apis.apiCreatedAt,
            api_payloads: sql`
                coalesce(
                    ${apiPayloads.payloads},
                    '[]'
                )
            `,
            api_responses: sql`
                coalesce(
                    ${apiResponses.responses},
                    '[]'
                )
            `,
        })
        .from(DbTableSchema.apis)
        .leftJoin(DbTableSchema.modules, eq(DbTableSchema.modules.moduleId, DbTableSchema.apis.apiModuleId))
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.apis.apiOwnerId))
        .leftJoin(apiPayloads, eq(apiPayloads.api_id, DbTableSchema.apis.apiId))
        .leftJoin(apiResponses, eq(apiResponses.api_id, DbTableSchema.apis.apiId))
        .where(
            and(
                eq(DbTableSchema.apis.apiModuleId, moduleId),
                eq(DbTableSchema.apis.apiIsDeleted, false),
            )
        )
        .orderBy(DbTableSchema.apis.apiCreatedAt)
        .offset((page - 1) * limit)
        .limit(limit)

        const totalCount = await db.select({
            count: count()
        })
        .from(DbTableSchema.apis)
        .where(
            and(
                eq(DbTableSchema.apis.apiIsDeleted, false),
                eq(DbTableSchema.apis.apiModuleId, moduleId)
            )
        )
        .then(data => data[0].count)
        
        return {
            data: data,
            count: totalCount
        }

    }

    export async function getApiById(apiId: string) {
        return await db.select({
            api_id: DbTableSchema.apis.apiId,
            api_name: DbTableSchema.apis.apiName,
            api_route: DbTableSchema.apis.apiRoute,
            api_method: DbTableSchema.apis.apiMethod,
            api_authorization: DbTableSchema.apis.apiAuthorization,
            api_description: DbTableSchema.apis.apiDescription,
            api_module: {
                module_id: DbTableSchema.modules.moduleId,
                module_name: DbTableSchema.modules.moduleName,
            },
            api_owner: {
                user_id: DbTableSchema.users.userId,
                user_first_name: DbTableSchema.users.userFirstName,
                user_last_name: DbTableSchema.users.userLastName,
                user_email: DbTableSchema.users.userEmail,
            },
            api_created_at: DbTableSchema.apis.apiCreatedAt
        })
        .from(DbTableSchema.apis)
        .leftJoin(DbTableSchema.modules, eq(DbTableSchema.modules.moduleId, DbTableSchema.apis.apiModuleId))
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.apis.apiOwnerId))
        .where(
            eq(DbTableSchema.apis.apiId, apiId),
        )
        .orderBy(DbTableSchema.apis.apiCreatedAt)
        .then(data => data[0])
    }

    //! APIS_END

    
}

export default ApisQuery