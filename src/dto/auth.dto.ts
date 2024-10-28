import Validation from "@shared/validation/validation";
import RegexUtil from "@util/regex.util";


namespace AuthDto {

    export const register: Validation.DTO = {
        user_first_name: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 32
        },
        user_last_name: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 32
        },
        user_email: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.email]
        },
        user_password: {
            required: true,
            type: 'string',
            minLength: 8,
            maxLength: 32
        },
    }

    export const login: Validation.DTO = {
        user_email: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.email]
        },
        user_password: {
            required: true,
            type: 'string',
            minLength: 8,
            maxLength: 32
        },
    }
    
}

export default AuthDto