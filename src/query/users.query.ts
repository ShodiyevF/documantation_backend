import { and, eq, ilike, inArray, or } from "drizzle-orm"

import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"
import GlobalInterface from "@interface/global.interface"

namespace UsersQuery {

    export async function getUsersById(userIds: string[]) {
        return await db.select({
            userId: DbTableSchema.users.userId
        })
        .from(DbTableSchema.users)
        .where(
            inArray(
                DbTableSchema.users.userId, userIds
            )
        )
    }

    export async function getUsersAll(payloads: GlobalInterface.IGetAll) {
        const {
            term
        } = payloads
        
        const conditions = []

        if (term) {
            conditions.push(
                or(
                    ilike(DbTableSchema.users.userEmail, `%${term}%`),
                    ilike(DbTableSchema.users.userLastName, `%${term}%`),
                    ilike(DbTableSchema.users.userLastName, `%${term}%`),
                )
            )
        }
        
        return await db.select({
            user_id: DbTableSchema.users.userId,
            user_first_name: DbTableSchema.users.userFirstName,
            user_last_name: DbTableSchema.users.userLastName,
            user_email: DbTableSchema.users.userEmail,
        })
        .from(DbTableSchema.users)
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(DbTableSchema.users.userFirstName)
    }
    
}

export default UsersQuery