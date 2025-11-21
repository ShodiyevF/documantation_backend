import { boolean, json, pgTable, smallint, text, timestamp, uuid, varchar, pgEnum, unique, jsonb } from "drizzle-orm/pg-core";
import { Table } from "drizzle-orm";

export const requestLogsRlTypeEnum = pgEnum('request_logs_rl_type_enum', [ "SUCCESS", "ERROR" ]);
export const apisApiMethodEnum = pgEnum('apis_api_method_enum', ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]);
export const payloadsPayloadTypeEnum = pgEnum('payloads_payload_type_enum', ['params', 'query', 'form-data', 'json']);
export const responsesResponseTypeEnum = pgEnum('responses_response_type_enum', ['json']);
export const projectsProjectAuthorizationTypeEnum = pgEnum('projects_project_authorization_type_enum', ['bearer', 'basic', 'digest']);


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
    rlCreatedAt: timestamp('rl_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const internalErrorsLOGSTable = pgTable('internal_errors_logs', {
    ielId: uuid('iel_id').defaultRandom().primaryKey(),
    ielDescription: text('iel_description').notNull(),
    ielStack: text('iel_stack').notNull(),
    ielCreatedAt: timestamp('iel_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const cronJobsLOGSTable = pgTable('cron_jobs_logs', {
    cjlId: uuid('cjl_id').defaultRandom().primaryKey(),
    cjlName: text('cjl_name').notNull(),
    cjlCreatedAt: timestamp('cjl_created_at', { withTimezone: true }).notNull().defaultNow(),
})


export const usersTable = pgTable('users', {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    userFirstName: varchar('user_first_name', { length: 32 }).notNull(),
    userLastName: varchar('user_last_name', { length: 32 }).notNull(),
    userEmail: varchar('user_email', { length: 64 }).notNull(),
    userPassword: varchar('user_password', { length: 64 }).notNull(),
    userCreatedAt: timestamp('user_created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => ({
    uniqueUserEmail: unique().on(table.userEmail)
}))

export const projectsTable = pgTable('projects', {
    projectId: uuid('project_id').defaultRandom().primaryKey(),
    projectName: varchar('project_name', { length: 32 }).notNull(),
    projectBaseUrl: varchar('project_base_url', { length: 128 }),
    projectAuthorizationType: projectsProjectAuthorizationTypeEnum('project_authorization_type'),
    projectDescription: text('project_description'),
    projectIsDeleted: boolean('project_is_deleted').notNull().default(false),
    projectOwnerId: uuid('project_owner_id').notNull().references(() => usersTable.userId),
    projectCreatedAt: timestamp('project_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const projectInvitationsTable = pgTable('project_invitations', {
    piId: uuid('pi_id').defaultRandom().primaryKey(),
    piAccepted: boolean('pi_accepted').notNull().default(false),
    piIsDeleted: boolean('pi_is_deleted').notNull().default(false),
    piProjectId: uuid('pi_project_id').notNull().references(() => projectsTable.projectId),
    piUserId: uuid('pi_user_id').notNull().references(() => usersTable.userId),
    piUpdatedAt: timestamp('pi_updated_at', { withTimezone: true }).notNull().defaultNow(),
    piCreatedAt: timestamp('pi_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const projectUsersTable = pgTable('project_users', {
    puId: uuid('pu_id').defaultRandom().primaryKey(),
    puProjectId: uuid('pu_project_id').notNull().references(() => projectsTable.projectId),
    puUserId: uuid('pu_user_id').notNull().references(() => usersTable.userId),
    puCreatedAt: timestamp('pu_created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => ({
    uniqueProjectUser: unique().on(table.puProjectId, table.puUserId)
}))

export const codesTable = pgTable('codes', {
    codeId: uuid('code_id').defaultRandom().primaryKey(),
    codeValue: varchar('code_value', { length: 64 }).notNull(),
    codeDescription: varchar('code_description', { length: 128 }).notNull(),
    codeIsDeleted: boolean('code_is_deleted').notNull().default(false),
    codeUserId: uuid('code_user_id').notNull().references(() => usersTable.userId),
    codeProjectId: uuid('code_project_id').notNull().references(() => projectsTable.projectId),
    codeCreatedAt: timestamp('code_created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => ({
    uniqueProjectUser: unique().on(table.codeValue, table.codeProjectId)
}))

export const modulesTable = pgTable('modules', {
    moduleId: uuid('module_id').defaultRandom().primaryKey(),
    moduleName: varchar('module_name', { length: 32 }).notNull(),
    moduleDescription: text('module_description'),
    moduleIsDeleted: boolean('module_is_deleted').notNull().default(false),
    moduleOwnerId: uuid('module_owner_id').notNull().references(() => usersTable.userId),
    moduleProjectId: uuid('module_project_id').notNull().references(() => projectsTable.projectId),
    moduleCreatedAt: timestamp('module_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const apisTable = pgTable('apis', {
    apiId: uuid('api_id').defaultRandom().primaryKey(),
    apiName: varchar('api_name', { length: 128 }).notNull(),
    apiRoute: varchar('api_route', { length: 256 }).notNull(),
    apiMethod: apisApiMethodEnum('api_method').notNull(),
    apiAuthorization: boolean('api_authorization').notNull(),
    apiDescription: varchar('api_description', { length: 128 }),
    apiIsDeleted: boolean('api_is_deleted').notNull().default(false),
    apiOwnerId: uuid('api_owner_id').notNull().references(() => usersTable.userId),
    apiModuleId: uuid('api_module_id').notNull().references(() => modulesTable.moduleId),
    apiProjectId: uuid('api_project_id').notNull().references(() => projectsTable.projectId),
    apiCreatedAt: timestamp('api_created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => ({
    uniqueApiRoute: unique().on(table.apiRoute, table.apiMethod, table.apiProjectId)
}))

export const payloadsTable = pgTable('payloads', {
    payloadId: uuid('payload_id').defaultRandom().primaryKey(),
    payloadType: payloadsPayloadTypeEnum('payload_type').notNull(),
    payloadSchema: jsonb('payload_schema').notNull(),
    payloadExample: text('payload_example'),
    payloadDescription: varchar('payload_description', { length: 128 }),
    payloadIsDeleted: boolean('payload_is_deleted').notNull().default(false),
    payloadOwnerId: uuid('payload_owner_id').notNull().references(() => usersTable.userId),
    payloadApiId: uuid('payload_api_id').notNull().references(() => apisTable.apiId),
    payloadCreatedAt: timestamp('payload_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const payloadCodesTable = pgTable('payload_codes', {
    pcId: uuid('pc_id').defaultRandom().primaryKey(),
    pcPayloadId: uuid('pc_payload_id').notNull().references(() => payloadsTable.payloadId),
    pcCodeId: uuid('pc_code_id').notNull().references(() => codesTable.codeId),
    pcCreatedAt: timestamp('pc_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const responsesTable = pgTable('responses', {
    responseId: uuid('response_id').defaultRandom().primaryKey(),
    responseType: responsesResponseTypeEnum('response_type').notNull(),
    responseSchema: jsonb('response_schema').notNull(),
    responseExample: text('response_example'),
    responseDescription: varchar('response_description', { length: 128 }),
    responseIsDeleted: boolean('response_is_deleted').notNull().default(false),
    responseOwnerId: uuid('response_owner_id').notNull().references(() => usersTable.userId),
    responseApiId: uuid('response_api_id').notNull().references(() => apisTable.apiId),
    responseCreatedAt: timestamp('response_created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const responseCodesTable = pgTable('response_codes', {
    rcId: uuid('rc_id').defaultRandom().primaryKey(),
    rcResponseId: uuid('rc_response_id').notNull().references(() => responsesTable.responseId),
    rcCodeId: uuid('rc_code_id').notNull().references(() => codesTable.codeId),
    rcCreatedAt: timestamp('rc_created_at', { withTimezone: true }).notNull().defaultNow(),
})

namespace DbTableSchema {
    export const requestsLOGS = requestsLOGSTable
    export const internalErrorsLOGS = internalErrorsLOGSTable
    export const cronJobsLOGS = cronJobsLOGSTable

    export const users = usersTable
    export const projects = projectsTable
    export const projectInvitations = projectInvitationsTable
    export const projectUsers = projectUsersTable
    export const codes = codesTable
    export const modules = modulesTable
    export const apis = apisTable
    export const payloads = payloadsTable
    export const responses = responsesTable


    export const requestLogsRlTypeEnumList = requestLogsRlTypeEnum.enumValues
    export const payloadsPayloadTypeEnumList = payloadsPayloadTypeEnum.enumValues
    export const responsesResponseTypeEnumList = responsesResponseTypeEnum.enumValues
    export const projectsProjectAuthorizationTypeEnumList = projectsProjectAuthorizationTypeEnum.enumValues

    
    export type TRequestLogsRlTypeEnum = typeof requestLogsRlTypeEnum.enumValues[number]
    export type TPayloadsPayloadTypeEnum = typeof payloadsPayloadTypeEnum.enumValues[number]
    export type TProjectsProjectAuthorizationTypeEnum = typeof projectsProjectAuthorizationTypeEnum.enumValues[number]

    export type InferSelectType<T extends Table, P extends boolean | null = null> = P extends true ? Partial<T['_']['inferSelect']> : T['_']['inferSelect'];
    export type InferInsertType<T extends Table> = T['_']['inferInsert'];
    export type InferUpdateType<T extends Table> = Partial<InferInsertType<T>>;
}

export default DbTableSchema