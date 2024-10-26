import { boolean, integer, json, jsonb, pgTable, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const requestTypes: [string, ...string[]] = [ "SUCCESS", "ERROR" ]
const apiMethods: [string, ...string[]] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]

export const requestsLOGSTable = pgTable('requests_logs', {
    requestId: uuid('request_id').defaultRandom().primaryKey(),
    requestType: varchar('request_type', { enum: requestTypes }).notNull(),
    requestMethod: varchar('request_method', { length: 32 }).notNull(),
    requestRoute: text('request_route').notNull(),
    requestHost: text('request_host').notNull(),
    requestUserAgent: text('request_user_agent').notNull(),
    requestBody: json('request_body').notNull(),
    requestResponseStatus: smallint('request_response_status').notNull(),
    requestResponseBody: text('request_response_body').notNull(),
    requestCreatedAt: timestamp('request_created_at').notNull().defaultNow(),
})

export const internalErrorsLOGSTable = pgTable('internal_errors_logs', {
    ieId: uuid('ie_id').defaultRandom().primaryKey(),
    ieDescription: text('ie_description').notNull(),
    ieStack: text('ie_stack').notNull(),
    ieCreatedAt: timestamp('ie_created_at').notNull().defaultNow(),
})

export const cronJobsLOGSTable = pgTable('cron_jobs_logs', {
    cjId: uuid('cj_id').defaultRandom().primaryKey(),
    cjName: text('cj_name').notNull(),
    cjCreatedAt: timestamp('cj_created_at').notNull().defaultNow(),
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
    projectFirstName: varchar('project_full_name', { length: 32 }).notNull(),
    projectDescription: text('project_description'),
    projectOwnerId: uuid('project_owner_id').notNull().references(() => usersTable.userId),
    projectCreatedAt: timestamp('project_created_at').notNull().defaultNow(),
})

export const apisTable = pgTable('apis', {
    apiId: uuid('api_id').defaultRandom().primaryKey(),
    apiRoute: varchar('api_route', { length: 128 }).notNull(),
    apiMethod: varchar('api_method', { enum: apiMethods }).notNull(),
    apiOwnerId: uuid('api_owner_id').notNull().references(() => usersTable.userId),
    apiCreatedAt: timestamp('api_created_at').notNull().defaultNow(),
})

export const responsesTable = pgTable('responses', {
    responseId: uuid('response_id').defaultRandom().primaryKey(),
    responseStatus: boolean('response_status').notNull(),
    responseStatusCode: integer('response_status_code').notNull(),
    responseDescription: text('response_description'),
    responseKeys: jsonb('response_keys').notNull(),
    responseOwnerId: uuid('response_owner_id').notNull().references(() => usersTable.userId),
    responseApiId: uuid('response_api_id').notNull().references(() => apisTable.apiId),
    responseCreatedAt: timestamp('response_created_at').notNull().defaultNow(),
})

export const payloadsTable = pgTable('payloads', {
    payloadId: uuid('payload_id').defaultRandom().primaryKey(),
    payloadType: varchar('payload_type', { length: 6 }).notNull(),
    payloadDescription: text('payload_description'),
    payloadKeys: jsonb('payload_keys').notNull(),
    payloadOwnerId: uuid('payload_owner_id').notNull().references(() => usersTable.userId),
    payloadApiId: uuid('payload_api_id').notNull().references(() => apisTable.apiId),
    payloadCreatedAt: timestamp('payload_created_at').notNull().defaultNow(),
})

namespace DbTableSchema {
    export const requests = requestsLOGSTable
    export const internalErrors = internalErrorsLOGSTable
    export const cronJobs = cronJobsLOGSTable
}

export default DbTableSchema