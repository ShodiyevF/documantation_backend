import DrizzleOrm from "drizzle-orm";

import DbTableSchema from "@database/schema.database";

namespace DatabaseInterface {
    
    export type TableNames = {
        [K in keyof typeof DbTableSchema]: (typeof DbTableSchema)[K] extends DrizzleOrm.Table ? K : never
    }[keyof typeof DbTableSchema]
    
    export interface ISelectPayloads<T extends TableNames> {
        tableName: T;
        filter: Partial<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>>
    }
    
    export interface IInsertPayloads<T extends TableNames> {
        tableName: T;
        data: DbTableSchema.InferInsertType<(typeof DbTableSchema)[T]>;
    }
    
    export interface IInsertBulkPayloads<T extends TableNames> {
        tableName: T;
        data: DbTableSchema.InferInsertType<(typeof DbTableSchema)[T]>[];
    }
    
    export interface IUpdatePayloads<T extends TableNames> {
        tableName: T
        targets?: {
            targetColumn: keyof DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>
            targetValue: any
        }[]
        data: DbTableSchema.InferUpdateType<(typeof DbTableSchema)[T]>
    }
    
    export interface IRemovePayloads<T extends TableNames> {
        tableName: T
        targets?: {
            targetColumn: keyof DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>
            targetValue: any
        }[]
    }
    
}

export default DatabaseInterface