import Validation from "@shared/validation/validation";
import RegexUtil from "@util/regex.util";

namespace ApisDto {

    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]
    
    export const getApisParams: Validation.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.UUID]
        }
    }

    export const createApiBody: Validation.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.UUID]
        },
        api_name: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 64
        },
        api_route: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
        api_method: {
            required: true,
            type: 'string',
            custom_validation: [(value) => {
                const check = methods.find(method => method === value)
                if (!check) {
                    return false
                }
                
                return true
            }, `Only these values should be present ${methods}`]
        },
        api_description: {
            required: false,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
    }
    
}

export default ApisDto