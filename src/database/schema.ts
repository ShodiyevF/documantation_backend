import { json, pgTable, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const requestTypes: [string, ...string[]] = [ "SUCCESS", "ERROR" ]

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

namespace DbTableSchema {
    export const requests = requestsLOGSTable
    export const internalErrors = internalErrorsLOGSTable
    export const cronJobs = cronJobsLOGSTable
}

export default DbTableSchema