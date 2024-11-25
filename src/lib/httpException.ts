namespace Exception {

    export enum Errors {
        INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
        VALIDATION_ERROR = 'VALIDATION_ERROR',
        FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
        BAD_JSON_FORMAT = 'BAD_JSON_FORMAT',
        ALREADY_EXISTS = 'ALREADY_EXISTS',
        INVALID_TOKEN = 'INVALID_TOKEN',
        TOKEN_EXPIRED = 'TOKEN_EXPIRED',
        TOKEN_REVOKED = 'TOKEN_REVOKED',
        UNAUTHORIZED = 'UNAUTHORIZED',
        UPLOAD_ERROR = 'UPLOAD_ERROR',
        NO_ACCESS = 'NO_ACCESS',
    };

    export enum FRONT {
        PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
        API_NOT_FOUND = 'API_NOT_FOUND',
    };
    
    export class HttpException {
        status: number;
        message: string;
        error: Errors | FRONT;
        
        constructor(status: number, message: string, error: Errors | FRONT) {
            this.status = status;
            this.message = message || '';
            this.error = error;
        }
    }

}

export default Exception