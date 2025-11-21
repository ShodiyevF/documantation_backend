import { inArray } from "drizzle-orm"

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
    
}

export default UsersQuery