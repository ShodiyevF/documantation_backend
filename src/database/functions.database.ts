import { eq, and } from "drizzle-orm";

import DatabaseInterface from "@interface/database.interface";
import DbTableSchema from "./schema.database";
import { db } from "./pg.database";

namespace DatabaseFunctions {
    
    export async function select<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.ISelectPayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>> {
        const {
            tableName,
            filter
        } = payloads
        
        const table = DbTableSchema[tableName]
        
        const conditions = Object.entries(filter).map(([key, value]) => eq((table as any)[key], value))
        
        const result = await db.select()
        .from(table)
        .where(
            and(...conditions)
        )
        
        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }
    
    export async function insert<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IInsertPayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>> {
        const {
            tableName,
            data
        } = payloads
        
        const table = DbTableSchema[tableName]
        const result = await db.insert(table)
        .values(data)
        .returning()
        
        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }
    
    export async function bulkInsert<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IInsertBulkPayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]> {
        const {
            tableName,
            data
        } = payloads
        
        const table = DbTableSchema[tableName]
        const result = await db.insert(table)
        .values(data)
        .returning()
        
        return result
    }
    
    export async function update<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IUpdatePayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]> {
        const {
            tableName,
            targets,
            data,
        } = payloads
        
        const table = DbTableSchema[tableName] as any
        
        const conditions = []
        
        if (targets) {
            for (const target of targets) {
                conditions.push(
                    eq((table as any)[target.targetColumn], target.targetValue)
                )
            }
        }
        
        const result = await db
        .update(table)
        .set(data)
        .where(
            and(...conditions)
        )
        .returning()
        
        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows
    }
    
    export async function remove<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IRemovePayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]> {
        const {
            tableName,
            targets,
        } = payloads
        
        const table = DbTableSchema[tableName] as any
        
        const conditions = []
        
        if (targets) {
            for (const target of targets) {
                conditions.push(eq((table as any)[target.targetColumn], target.targetValue))
            }
        }
        
        const result = await db
        .delete(table)
        .where(
            and(
                ...conditions
            )
        )
        .returning()
        
        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows
    }
    
}

export default DatabaseFunctions