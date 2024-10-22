import DbTableSchema from "@database/schema";
import LoggerDto from "./logger.dto";
import { db } from "@database/pg";

namespace LoggerQueries {

    export async function insertCronJob(payload: LoggerDto.InsertCronJobInterface) {
        const { cjName } = payload
        
        return db.insert(DbTableSchema.cronJobs)
        .values({
            cjName: cjName
        })
    }

    export async function insertRequest(payload: LoggerDto.InsertRequestInterface) {
        const { requestType, requestMethod, requestRoute, requestHost, requestUserAgent, requestBody, requestResponseStatus, requestResponseBody } = payload
        
        return await db.insert(DbTableSchema.requests)
        .values({
            requestType: requestType,
            requestMethod: requestMethod,
            requestRoute: requestRoute,
            requestHost: requestHost,
            requestUserAgent: requestUserAgent,
            requestBody: requestBody,
            requestResponseStatus: requestResponseStatus,
            requestResponseBody: requestResponseBody,
        })
    }

    export async function insertInternalCatcher(payload: LoggerDto.InsertInternalCatcherInterface) {
        const { ieDescription, ieStack } = payload
        
        return await db.insert(DbTableSchema.internalErrors)
        .values({
            ieDescription: ieDescription,
            ieStack: ieStack
        })
    }
    
}

export default LoggerQueries