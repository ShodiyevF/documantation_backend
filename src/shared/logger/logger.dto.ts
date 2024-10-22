namespace LoggerDto {

    export interface InsertCronJobInterface {
        cjName: string
    }

    export interface InsertRequestInterface {
        requestType: string
        requestMethod: string
        requestRoute: string
        requestHost: string
        requestUserAgent: string
        requestBody: object
        requestResponseStatus: number
        requestResponseBody: string
    }

    export interface InsertInternalCatcherInterface {
        ieDescription: string
        ieStack: string
    }
    
}

export default LoggerDto;