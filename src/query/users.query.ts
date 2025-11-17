import { eq } from "drizzle-orm"

import UsersInterface from "@interface/users.interface"
import DbTableSchema from "@database/schema.database"
import { db } from "@database/pg.database"

namespace UsersQuery {

    export async function insertUser(payloads: UsersInterface.IInsertUser) {
        return await db.insert(DbTableSchema.users)
        .values(payloads)
        .returning()
        .then(data => data[0])
    }
    
    export async function getUserByEmail(email: string) {
        return await db.select()
        .from(DbTableSchema.users)
        .where(eq(DbTableSchema.users.userEmail, email))
        .then(data => data[0])
    }
    
}

export default UsersQuery