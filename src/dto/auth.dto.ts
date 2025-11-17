import ValidationInterface from "@shared/validation/validation.interface";
import RegexUtil from "@util/regex.util";


namespace AuthDto {

    export const register: ValidationInterface.DTO = {
        user_first_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 32
        },
        user_last_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 32
        },
        user_email: {
            required: true,
            type: 'string',
            pattern: RegexUtil.email
        },
        user_password: {
            required: true,
            type: 'string',
            min_length: 8,
            max_length: 32
        },
    }

    export const login: ValidationInterface.DTO = {
        user_email: {
            required: true,
            type: 'string',
            pattern: RegexUtil.email
        },
        user_password: {
            required: true,
            type: 'string',
            min_length: 8,
            max_length: 32
        },
    }
    
}

export default AuthDto