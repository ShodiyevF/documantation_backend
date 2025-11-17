import { boolean, integer, json, jsonb, pgTable, smallint, PgArray, text, timestamp, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { Table } from "drizzle-orm";

export const requestLogsRlTypeEnum = pgEnum('request_logs_rl_type_enum', [ "SUCCESS", "ERROR" ]);
export const apisApiMethodEnum = pgEnum('apis_api_method_enum', ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]);

export const requestsLOGSTable = pgTable('requests_logs', {
    rlId: uuid('rl_id').defaultRandom().primaryKey(),
    rlType: requestLogsRlTypeEnum('rl_type').notNull(),
    rlMethod: varchar('rl_method', { length: 32 }).notNull(),
    rlRoute: text('rl_route').notNull(),
    rlHost: text('rl_host').notNull(),
    rlUserAgent: text('rl_user_agent').notNull(),
    rlBody: json('rl_body').notNull(),
    rlResponseStatus: smallint('rl_response_status').notNull(),
    rlResponseBody: text('rl_response_body').notNull(),
    rlCreatedAt: timestamp('rl_created_at').notNull().defaultNow(),
})

export const internalErrorsLOGSTable = pgTable('internal_errors_logs', {
    ielId: uuid('iel_id').defaultRandom().primaryKey(),
    ielDescription: text('iel_description').notNull(),
    ielStack: text('iel_stack').notNull(),
    ielCreatedAt: timestamp('iel_created_at').notNull().defaultNow(),
})

export const cronJobsLOGSTable = pgTable('cron_jobs_logs', {
    cjlId: uuid('cjl_id').defaultRandom().primaryKey(),
    cjlName: text('cjl_name').notNull(),
    cjlCreatedAt: timestamp('cjl_created_at').notNull().defaultNow(),
})


export const usersTable = pgTable('users', {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    userFirstName: varchar('user_first_name', { length: 32 }).notNull(),
    userLastName: varchar('user_last_name', { length: 32 }).notNull(),
    userEmail: varchar('user_email', { length: 64 }).notNull(),
    userPassword: varchar('user_password', { length: 64 }).notNull(),
    userCreatedAt: timestamp('user_created_at').notNull().defaultNow(),
})

export const projectsTable = pgTable('projects', {
    projectId: uuid('project_id').defaultRandom().primaryKey(),
    projectName: varchar('project_name', { length: 32 }).notNull(),
    projectDescription: text('project_description'),
    projectOwnerId: uuid('project_owner_id').notNull().references(() => usersTable.userId),
    projectCreatedAt: timestamp('project_created_at').notNull().defaultNow(),
})

export const projectUsersTable = pgTable('project_users', {
    puId: uuid('pu_id').defaultRandom().primaryKey(),
    puProjectId: uuid('pu_project_id').notNull().references(() => projectsTable.projectId),
    puUserId: uuid('pu_user_id').notNull().references(() => usersTable.userId),
    puCreatedAt: timestamp('pu_created_at').notNull().defaultNow(),
})

export const modulesTable = pgTable('modules', {
    moduleId: uuid('module_id').defaultRandom().primaryKey(),
    moduleName: varchar('module_name', { length: 32 }).notNull(),
    moduleDescription: text('module_description'),
    moduleOwnerId: uuid('module_owner_id').notNull().references(() => usersTable.userId),
    moduleProjectId: uuid('module_project_id').notNull().references(() => projectsTable.projectId),
    moduleCreatedAt: timestamp('module_created_at').notNull().defaultNow(),
})

export const apisTable = pgTable('apis', {
    apiId: uuid('api_id').defaultRandom().primaryKey(),
    apiName: varchar('api_name', { length: 64 }).notNull(),
    apiRoute: varchar('api_route', { length: 128 }).notNull(),
    apiMethod: apisApiMethodEnum('api_method').notNull(),
    apiDescription: varchar('api_description', { length: 128 }),
    apiOwnerId: uuid('api_owner_id').notNull().references(() => usersTable.userId),
    apiModuleId: uuid('api_module_id').notNull().references(() => modulesTable.moduleId),
    apiProjectId: uuid('api_project_id').notNull().references(() => projectsTable.projectId),
    apiCreatedAt: timestamp('api_created_at').notNull().defaultNow(),
})

export const responsesTable = pgTable('responses', {
    responseId: uuid('response_id').defaultRandom().primaryKey(),
    responseStatus: boolean('response_status').notNull(),
    responseStatusCode: integer('response_status_code').notNull(),
    responseDescription: varchar('response_description', { length: 128 }),
    responseOwnerId: uuid('response_owner_id').notNull().references(() => usersTable.userId),
    responseApiId: uuid('response_api_id').notNull().references(() => apisTable.apiId),
    responseCreatedAt: timestamp('response_created_at').notNull().defaultNow(),
})

export const responseKeysTable = pgTable('response_keys', {
    rkId: uuid('rk_id').defaultRandom().primaryKey(),
    rkName: varchar('rk_name', { length: 128 }).notNull(),
    rkTypes: varchar('rk_types').array().notNull(),
    rkMockData: varchar('rk_mock_data', { length: 128 }),
    rkDescription: varchar('rk_description', { length: 128 }),
    rkOwnerId: uuid('rk_owner_id').notNull().references(() => usersTable.userId),
    rkResponseId: uuid('rk_response_id').notNull().references(() => responsesTable.responseId),
    rkCreatedAt: timestamp('rk_created_at').notNull().defaultNow()
})

export const payloadsTable = pgTable('payloads', {
    payloadId: uuid('payload_id').defaultRandom().primaryKey(),
    payloadType: varchar('payload_type', { length: 15 }).notNull(),
    payloadDescription: varchar('payload_description', { length: 128 }),
    payloadOwnerId: uuid('payload_owner_id').notNull().references(() => usersTable.userId),
    payloadApiId: uuid('payload_api_id').notNull().references(() => apisTable.apiId),
    payloadCreatedAt: timestamp('payload_created_at').notNull().defaultNow(),
})

export const payloadKeysTable = pgTable('payload_keys', {
    pkId: uuid('pk_id').defaultRandom().primaryKey(),
    pkName: varchar('pk_name', { length: 128 }).notNull(),
    pkTypes: varchar('pk_types').array().notNull(),
    pkMockData: varchar('pk_mock_data', { length: 128 }),
    pkDescription: varchar('pk_description', { length: 128 }),
    pkOwnerId: uuid('pk_owner_id').notNull().references(() => usersTable.userId),
    pkPayloadId: uuid('pk_payload_id').notNull().references(() => payloadsTable.payloadId),
    pkCreatedAt: timestamp('pk_created_at').notNull().defaultNow()
})

namespace DbTableSchema {
    export const requestsLOGS = requestsLOGSTable
    export const internalErrorsLOGS = internalErrorsLOGSTable
    export const cronJobsLOGS = cronJobsLOGSTable

    export const users = usersTable
    export const projects = projectsTable
    export const projectUsers = projectUsersTable
    export const apis = apisTable
    export const responses = responsesTable
    export const responseKeys = responseKeysTable
    export const payloads = payloadsTable
    export const payloadKeys = payloadKeysTable

    export const requestLogsRlTypeEnumList = requestLogsRlTypeEnum.enumValues
    export const apisApiMethodEnumList = apisApiMethodEnum.enumValues
    
    export type TRequestLogsRlTypeEnum = typeof requestLogsRlTypeEnum.enumValues[number]
    export type TApisApiMethodEnum = typeof apisApiMethodEnum.enumValues[number]

    export type InferSelectType<T extends Table, P extends boolean | null = null> = P extends true ? Partial<T['_']['inferSelect']> : T['_']['inferSelect'];
    export type InferInsertType<T extends Table> = T['_']['inferInsert'];
    export type InferUpdateType<T extends Table> = Partial<InferInsertType<T>>;
}

export default DbTableSchema