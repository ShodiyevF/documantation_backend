import ApisInterface from "@interface/apis.inteface";
import Validation from "@shared/validation/validation";
import RegexUtil from "@util/regex.util";

namespace ApisDto {

    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]
    const payloadType = ['params', 'query', 'form-data', 'body']
    const keyTypes = ['boolean', 'number', 'int', 'object', 'null', 'string']
    
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

    export const createKey: Validation.DTO = {
        key_name: {
            required: true,
            type: 'string',
            minLength: 3,
            maxLength: 128,
        },
        key_types: {
            required: true,
            type: 'object',
            custom_validation: [(types: string[]) => {
                const check = types.every(value => keyTypes.includes(value))

                if (!check) {
                    return `${keyTypes}`
                }

                return true
            }, 'An array can only contain string, number, and boolean types.']
        },
        key_mock_data: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
        key_description: {
            required: false,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
    } 

    export const createApiResponseBody: Validation.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.UUID]
        },
        response_status: {
            required: true,
            type: 'boolean'
        },
        response_status_code: {
            required: true,
            type: 'number',
            min: 100,
            max: 599
        },
        response_description: {
            required: false,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
        response_keys: {
            required: true,
            type: 'object',
            custom_validation: [(list: ApisInterface.IResponseKey[]) => {
                
                if (!Array.isArray(list)) {
                    return false
                }
                
                for (const value of list) {
                    const validatorResponse = Validation.validator(createKey, value);
                    
                    if (validatorResponse.status != 200) {
                        return validatorResponse.error || ''
                    }
                }
                
                return true
            }, 'test']
        },
    }
    
    export const createApiPayloadBody: Validation.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.UUID]
        },
        payload_type: {
            required: true,
            type: 'string',
            custom_validation: [(value: string) => {
                
                if (!payloadType.includes(value)) {
                    return false
                }
                
                return true
            }, `Includes ${payloadType}`]
        },
        payload_description: {
            required: false,
            type: 'string',
            minLength: 1,
            maxLength: 128
        },
        payload_keys: {
            required: true,
            type: 'object',
            custom_validation: [(list: ApisInterface.IPayloadKey[]) => {
                
                if (!Array.isArray(list)) {
                    return false
                }

                if (!list.length) {
                    return false
                }
                
                for (const value of list) {
                    const validatorResponse = Validation.validator(createKey, value);
                    
                    if (validatorResponse.status != 200) {
                        return validatorResponse.error || ''
                    }
                }
                
                return true
            }, 'test']
        },
    }
    
}

export default ApisDto