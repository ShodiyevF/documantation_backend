namespace Exception {

    export enum Errors {

        //! ALREADY_EXISTS_START



        //! ALREADY_EXISTS_END


        //! NOT_FOUND_START

            PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
            API_NOT_FOUND = 'API_NOT_FOUND',

        //! NOT_FOUND_END
        
        
        //! VALIDATION_ERROR_START
        
            FILE_VALIDATION_ERROR = 'FILE_VALIDATION_ERROR',
            VALIDATION_ERROR = 'VALIDATION_ERROR',

        //! VALIDATION_ERROR_END


        //! AUTHORIZATION_ERROR_START
        
            AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',

        //! AUTHORIZATION_ERROR_END

        
        //! SERVER_CONFIG_START

            INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
            BAD_JSON_FORMAT = 'BAD_JSON_FORMAT',
            INVALID_TOKEN = 'INVALID_TOKEN',
            TOKEN_EXPIRED = 'TOKEN_EXPIRED',
            TOKEN_REVOKED = 'TOKEN_REVOKED',
            
        //! SERVER_CONFIG_END
        
        
        //! BAD_VALUES_START
            
            UPLOAD_ERROR = 'UPLOAD_ERROR',
        
        //! BAD_VALUES_END
        
    };
    
    export class HttpException {
        status: number;
        message: string;
        error: Errors;
        
        constructor(status: number, message: string, error: Errors) {
            this.status = status;
            this.message = message || '';
            this.error = error;
        }
    }

}

export default Exception