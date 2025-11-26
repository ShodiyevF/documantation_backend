import { and, count, eq } from "drizzle-orm"

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
            api_created_at: DbTableSchema.apis.apiCreatedAt
        })
        .from(DbTableSchema.apis)
        .leftJoin(DbTableSchema.modules, eq(DbTableSchema.modules.moduleId, DbTableSchema.apis.apiModuleId))
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.apis.apiOwnerId))
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