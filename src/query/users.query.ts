import { and, eq, ilike, inArray, or } from "drizzle-orm"

import GlobalInterface from "@interface/global.interface"
import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

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

    export async function getMe(userId: string) {
        return await db.select({
            user_id: DbTableSchema.users.userId,
            user_first_name: DbTableSchema.users.userFirstName,
            user_last_name: DbTableSchema.users.userLastName,
            user_email: DbTableSchema.users.userEmail,
            user_created_at: DbTableSchema.users.userCreatedAt
        })
        .from(DbTableSchema.users)
        .where(
            eq(DbTableSchema.users.userId, userId)
        )
        .then(data => data[0])
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