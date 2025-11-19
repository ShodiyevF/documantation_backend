import { boolean, json, pgTable, smallint, text, timestamp, uuid, varchar, pgEnum, unique } from "drizzle-orm/pg-core";
import { relations, Table } from "drizzle-orm";

export const requestLogsRlTypeEnum = pgEnum('request_logs_rl_type_enum', [ "SUCCESS", "ERROR" ]);

export const apisApiMethodEnum = pgEnum('apis_api_method_enum', ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]);

export const payloadsPayloadTypeEnum = pgEnum('payloads_payload_type_enum', ['params', 'query', 'form-data', 'json']);
export const payloadsPayloadValueTypeEnum = pgEnum('payloads_payload_value_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);
export const payloadsPayloadValueChildsTypeEnum = pgEnum('payloads_payload_value_childs_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);
export const payloadKeysPkTypesEnum = pgEnum('payload_keys_pk_types_enum', ['string', 'number', 'boolean', 'null', 'object', 'array', 'date']);
export const payloadKeysPkValueChildsTypeEnum = pgEnum('payload_keys_pk_value_childs_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);

export const responsesResponseTypeEnum = pgEnum('responses_response_type_enum', ['params', 'query', 'form-data', 'json']);
export const responsesResponseValueTypeEnum = pgEnum('responses_response_value_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);
export const responsesResponseValueChildsTypeEnum = pgEnum('responses_response_value_childs_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);
export const responseKeysRkTypesEnum = pgEnum('response_keys_rk_types_enum', ['string', 'number', 'boolean', 'null', 'object', 'array', 'date']);
export const responseKeysRkValueChildsTypeEnum = pgEnum('response_keys_rk_value_childs_type_enum', ['string', 'number', 'boolean', 'null', 'object', 'array']);

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
}, table => ({
    uniqueUserEmail: unique().on(table.userEmail)
}))

export const projectsTable = pgTable('projects', {
    projectId: uuid('project_id').defaultRandom().primaryKey(),
    projectName: varchar('project_name', { length: 32 }).notNull(),
    projectDescription: text('project_description'),
    projectOwnerId: uuid('project_owner_id').notNull().references(() => usersTable.userId),
    projectCreatedAt: timestamp('project_created_at').notNull().defaultNow(),
}, table => ({
    uniqueProjectName: unique().on(table.projectName, table.projectOwnerId)
}))

export const projectUsersTable = pgTable('project_users', {
    puId: uuid('pu_id').defaultRandom().primaryKey(),
    puProjectId: uuid('pu_project_id').notNull().references(() => projectsTable.projectId),
    puUserId: uuid('pu_user_id').notNull().references(() => usersTable.userId),
    puCreatedAt: timestamp('pu_created_at').notNull().defaultNow(),
}, table => ({
    uniqueProjectUser: unique().on(table.puProjectId, table.puUserId)
}))

export const modulesTable = pgTable('modules', {
    moduleId: uuid('module_id').defaultRandom().primaryKey(),
    moduleName: varchar('module_name', { length: 32 }).notNull(),
    moduleDescription: text('module_description'),
    moduleOwnerId: uuid('module_owner_id').notNull().references(() => usersTable.userId),
    moduleProjectId: uuid('module_project_id').notNull().references(() => projectsTable.projectId),
    moduleCreatedAt: timestamp('module_created_at').notNull().defaultNow(),
}, table => ({
    uniqueModuleName: unique().on(table.moduleName, table.moduleProjectId)
}))

export const apisTable = pgTable('apis', {
    apiId: uuid('api_id').defaultRandom().primaryKey(),
    apiName: varchar('api_name', { length: 128 }).notNull(),
    apiRoute: varchar('api_route', { length: 256 }).notNull(),
    apiMethod: apisApiMethodEnum('api_method').notNull(),
    apiAuthorization: boolean('api_authorization').notNull(),
    apiDescription: varchar('api_description', { length: 128 }),
    apiOwnerId: uuid('api_owner_id').notNull().references(() => usersTable.userId),
    apiModuleId: uuid('api_module_id').notNull().references(() => modulesTable.moduleId),
    apiProjectId: uuid('api_project_id').notNull().references(() => projectsTable.projectId),
    apiCreatedAt: timestamp('api_created_at').notNull().defaultNow(),
}, table => ({
    uniqueApiRoute: unique().on(table.apiRoute, table.apiMethod, table.apiProjectId)
}))

export const payloadsTable = pgTable('payloads', {
    payloadId: uuid('payload_id').defaultRandom().primaryKey(),
    payloadType: payloadsPayloadTypeEnum('payload_type').notNull(),
    payloadValueType: payloadsPayloadValueTypeEnum('payload_value_type').notNull(),
    payloadValueChildsType: payloadsPayloadValueChildsTypeEnum('payload_value_childs_type'),
    payloadExample: text('payload_example'),
    payloadDescription: varchar('payload_description', { length: 128 }),
    payloadOwnerId: uuid('payload_owner_id').notNull().references(() => usersTable.userId),
    payloadApiId: uuid('payload_api_id').notNull().references(() => apisTable.apiId),
    payloadCreatedAt: timestamp('payload_created_at').notNull().defaultNow(),
}, table => ({
    uniquePayload: unique().on(table.payloadType, table.payloadValueType, table.payloadApiId)
}))

export const payloadKeysTable = pgTable('payload_keys', {
    pkId: uuid('pk_id').defaultRandom().primaryKey(),
    pkName: varchar('pk_name', { length: 128 }).notNull(),
    pkTypes: payloadKeysPkTypesEnum('pk_types').notNull(),
    pkValueChildsType: payloadKeysPkValueChildsTypeEnum('pk_value_childs_type'),
    pkIsRequired: boolean('pk_is_required').notNull(),
    pkExample: varchar('pk_example'),
    pkDescription: varchar('pk_description', { length: 128 }),
    pkParentId: uuid('pk_parent_id'),
    pkOwnerId: uuid('pk_owner_id').notNull().references(() => usersTable.userId),
    pkPayloadId: uuid('pk_payload_id').notNull().references(() => payloadsTable.payloadId),
    pkCreatedAt: timestamp('pk_created_at').notNull().defaultNow()
})

export const payloadKeysRelations = relations(payloadKeysTable, ({ one, many }) => ({
  parent: one(payloadKeysTable, {
    fields: [payloadKeysTable.pkParentId],
    references: [payloadKeysTable.pkId],
  }),
  children: many(payloadKeysTable),
}));

export const responsesTable = pgTable('responses', {
    responseId: uuid('response_id').defaultRandom().primaryKey(),
    responseType: responsesResponseTypeEnum('response_type').notNull(),
    responseValueType: responsesResponseValueTypeEnum('response_value_type').notNull(),
    responseValueChildsType: responsesResponseValueChildsTypeEnum('response_value_childs_type'),
    responseExample: text('response_example'),
    responseDescription: varchar('response_description', { length: 128 }),
    responseOwnerId: uuid('response_owner_id').notNull().references(() => usersTable.userId),
    responseApiId: uuid('response_api_id').notNull().references(() => apisTable.apiId),
    responseCreatedAt: timestamp('response_created_at').notNull().defaultNow(),
}, table => ({
    uniquePayload: unique().on(table.responseType, table.responseValueType, table.responseApiId)
}))

export const responseKeysTable = pgTable('response_keys', {
    rkId: uuid('rk_id').defaultRandom().primaryKey(),
    rkName: varchar('rk_name', { length: 128 }).notNull(),
    rkTypes: responseKeysRkTypesEnum('rk_types').notNull(),
    rkValueChildsType: responseKeysRkValueChildsTypeEnum('rk_value_childs_type'),
    rkIsRequired: boolean('rk_is_required').notNull(),
    rkExample: varchar('rk_example'),
    rkDescription: varchar('rk_description', { length: 128 }),
    rkParentId: uuid('rk_parent_id'),
    rkOwnerId: uuid('rk_owner_id').notNull().references(() => usersTable.userId),
    rkPayloadId: uuid('rk_payload_id').notNull().references(() => payloadsTable.payloadId),
    rkCreatedAt: timestamp('rk_created_at').notNull().defaultNow()
})

export const responseKeysRelations = relations(responseKeysTable, ({ one, many }) => ({
  parent: one(responseKeysTable, {
    fields: [responseKeysTable.rkParentId],
    references: [responseKeysTable.rkId],
  }),
  children: many(responseKeysTable),
}));

namespace DbTableSchema {
    export const requestsLOGS = requestsLOGSTable
    export const internalErrorsLOGS = internalErrorsLOGSTable
    export const cronJobsLOGS = cronJobsLOGSTable

    export const users = usersTable
    export const projects = projectsTable
    export const projectUsers = projectUsersTable
    export const apis = apisTable
    export const payloads = payloadsTable
    export const payloadKeys = payloadKeysTable
    export const responses = responsesTable
    export const responseKeys = responseKeysTable


    export const requestLogsRlTypeEnumList = requestLogsRlTypeEnum.enumValues
    export const payloadsPayloadTypeEnumList = payloadsPayloadTypeEnum.enumValues
    export const payloadsPayloadValueTypeEnumList = payloadsPayloadValueTypeEnum.enumValues
    export const payloadsPayloadValueChildsTypeEnumList = payloadsPayloadValueChildsTypeEnum.enumValues
    export const payloadKeysPkTypesEnumList = payloadKeysPkTypesEnum.enumValues
    export const payloadKeysPkValueChildsTypeEnumList = payloadKeysPkValueChildsTypeEnum.enumValues
    export const responsesResponseTypeEnumList = responsesResponseTypeEnum.enumValues
    export const responsesResponseValueTypeEnumList = responsesResponseValueTypeEnum.enumValues
    export const responsesResponseValueChildsTypeEnumList = responsesResponseValueChildsTypeEnum.enumValues
    export const responseKeysRkTypesEnumList = responseKeysRkTypesEnum.enumValues
    export const responseKeysRkValueChildsTypeEnumList = responseKeysRkValueChildsTypeEnum.enumValues

    
    export type TRequestLogsRlTypeEnum = typeof requestLogsRlTypeEnum.enumValues[number]
    export type TPayloadsPayloadTypeEnum = typeof payloadsPayloadTypeEnum.enumValues[number]
    export type TPayloadsPayloadValueTypeEnum = typeof payloadsPayloadValueTypeEnum.enumValues[number]
    export type TPayloadsPayloadValueChildsTypeEnum = typeof payloadsPayloadValueChildsTypeEnum.enumValues[number]
    export type TPayloadKeysPkTypesEnum = typeof payloadKeysPkTypesEnum.enumValues[number]
    export type TPayloadKeysPkValueChildsTypeEnum = typeof payloadKeysPkValueChildsTypeEnum.enumValues[number]
    export type TResponsesResponseTypeEnum = typeof responsesResponseTypeEnum.enumValues[number]
    export type TResponsesResponseValueTypeEnum = typeof responsesResponseValueTypeEnum.enumValues[number]
    export type TResponsesResponseValueChildsTypeEnum = typeof responsesResponseValueChildsTypeEnum.enumValues[number]
    export type TResponseKeysRkTypesEnum = typeof responseKeysRkTypesEnum.enumValues[number]
    export type TResponseKeysRkValueChildsTypeEnum = typeof responseKeysRkValueChildsTypeEnum.enumValues[number]

    export type InferSelectType<T extends Table, P extends boolean | null = null> = P extends true ? Partial<T['_']['inferSelect']> : T['_']['inferSelect'];
    export type InferInsertType<T extends Table> = T['_']['inferInsert'];
    export type InferUpdateType<T extends Table> = Partial<InferInsertType<T>>;
}

export default DbTableSchema