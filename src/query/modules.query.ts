import { and, count, eq } from "drizzle-orm"

import ModulesInterface from "@interface/modules.interface"
import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace ModulesQuery {

    export async function getModules(payloads: ModulesInterface.IGetModulesPayloads) {
        const {
            limit,
            page,
            projectId
        } = payloads

        const data = await db.select({
            module_id: DbTableSchema.modules.moduleId,
            module_name: DbTableSchema.modules.moduleName,
            module_description: DbTableSchema.modules.moduleDescription,
            module_creator: {
                user_id: DbTableSchema.users.userId,
                user_first_name: DbTableSchema.users.userFirstName,
                user_last_name: DbTableSchema.users.userLastName,
                user_email: DbTableSchema.users.userEmail,
            },
            module_created_at: DbTableSchema.modules.moduleCreatedAt,
        })
        .from(DbTableSchema.modules)
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.modules.moduleOwnerId))
        .where(
            and(
                eq(DbTableSchema.modules.moduleIsDeleted, false),
                eq(DbTableSchema.modules.moduleProjectId, projectId)
            )
        )
        .orderBy(DbTableSchema.modules.moduleName)
        .offset((page - 1) * limit)
        .limit(limit)

        const totalCount = await db.select({
            count: count()
        })
        .from(DbTableSchema.modules)
        .where(
            and(
                eq(DbTableSchema.modules.moduleIsDeleted, false),
                eq(DbTableSchema.modules.moduleProjectId, projectId)
            )
        )
        .then(data => data[0].count)
        
        return {
            data: data,
            count: totalCount
        }
    }

    export async function getModuleById(moduleId: string) {
        return await db.select({
            module_id: DbTableSchema.modules.moduleId,
            module_name: DbTableSchema.modules.moduleName,
            module_description: DbTableSchema.modules.moduleDescription,
            module_creator: {
                user_id: DbTableSchema.users.userId,
                user_first_name: DbTableSchema.users.userFirstName,
                user_last_name: DbTableSchema.users.userLastName,
                user_email: DbTableSchema.users.userEmail,
            },
            module_created_at: DbTableSchema.modules.moduleCreatedAt,
        })
        .from(DbTableSchema.modules)
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.modules.moduleOwnerId))
        .where(
            eq(DbTableSchema.modules.moduleId, moduleId)
        )
        .then(data => data[0])
    }

}

export default ModulesQuery