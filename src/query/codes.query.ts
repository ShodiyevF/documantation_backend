import { and, count, eq } from "drizzle-orm"

import CodesInterface from "@interface/codes.interface"
import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace CodesQuery {

    export async function getCodeById(codeId: string) {
        return await db.select({
            code_id: DbTableSchema.codes.codeId,
            code_value: DbTableSchema.codes.codeValue,
            code_description: DbTableSchema.codes.codeDescription,
            code_creator: {
                user_id: DbTableSchema.users.userId,
                user_first_name: DbTableSchema.users.userFirstName,
                user_last_name: DbTableSchema.users.userLastName,
                user_email: DbTableSchema.users.userEmail,
            },
            code_created_at: DbTableSchema.codes.codeCreatedAt,
        })
        .from(DbTableSchema.codes)
        .leftJoin(DbTableSchema.users, eq(DbTableSchema.users.userId, DbTableSchema.codes.codeUserId))
        .where(
            eq(DbTableSchema.codes.codeId, codeId)
        )
        .then(data => data[0])
    }

    export async function getCodes(payloads: CodesInterface.IGetCodesPayloads) {
        const {
            limit,
            page,
            projectId
        } = payloads

        const data = await db.select({
            code_id: DbTableSchema.codes.codeId,
            code_value: DbTableSchema.codes.codeValue,
            code_description: DbTableSchema.codes.codeDescription,
            code_created_at: DbTableSchema.codes.codeCreatedAt,
        })
        .from(DbTableSchema.codes)
        .where(
            and(
                eq(DbTableSchema.codes.codeIsDeleted, false),
                eq(DbTableSchema.codes.codeProjectId, projectId)
            )
        )
        .orderBy(DbTableSchema.codes.codeValue)
        .offset((page - 1) * limit)
        .limit(limit)

        const totalCount = await db.select({
            count: count()
        })
        .from(DbTableSchema.codes)
        .where(
            and(
                eq(DbTableSchema.codes.codeIsDeleted, false),
                eq(DbTableSchema.codes.codeProjectId, projectId)
            )
        )
        .then(data => data[0].count)
        
        return {
            data: data,
            count: totalCount
        }
    }
    
}

export default CodesQuery