import internalErrorCatcher from "./logger.internal";
import LoggerQueries from "./logger.query";

export async function logWriter(statusCode: number, host: string, method: string, url: string, userAgent: string | undefined, body: object, res: string) {
    try {
        const logType: string = statusCode >= 200 && statusCode <= 299 ? 'SUCCESS' : 'ERROR';
    
        await LoggerQueries.insertRequest({
            requestMethod: method,
            requestBody: body,
            requestHost: host,
            requestRoute: url,
            requestResponseBody: res,
            requestResponseStatus: statusCode,
            requestType: logType,
            requestUserAgent: userAgent || '',
        })

    } catch (error) {
        internalErrorCatcher(error);
    }
}