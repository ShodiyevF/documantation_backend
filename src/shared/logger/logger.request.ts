import DatabaseFunctions from "@database/functions.database";
import internalErrorCatcher from "./logger.internal";

export async function logWriter(statusCode: number, host: string, method: string, url: string, userAgent: string | undefined, body: object, res: string) {
    try {
        const logType = statusCode >= 200 && statusCode <= 299 ? 'SUCCESS' : 'ERROR';
    
        await DatabaseFunctions.insert({
            tableName: 'requestsLOGS',
            data: {
                rlMethod: method,
                rlBody: body,
                rlHost: host,
                rlRoute: url,
                rlResponseBody: res,
                rlResponseStatus: statusCode,
                rlType: logType,
                rlUserAgent: userAgent || '',
            }
        })

    } catch (error) {
        internalErrorCatcher(error);
    }
}