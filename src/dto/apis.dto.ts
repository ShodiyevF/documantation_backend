import ValidationInterface from "@shared/validation/validation.interface";
import RegexUtil from "@util/regex.util";

namespace ApisDto {

    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"]
    const payloadType = ['params', 'query', 'form-data', 'body']
    const keyTypes = ['boolean', 'number', 'int', 'object', 'null', 'string']
    
    export const getApisParams: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const createApiBody: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        api_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 64
        },
        api_route: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        api_method: {
            required: true,
            type: 'string',
            enum: methods,
        },
        api_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
    }

    export const createKey: ValidationInterface.DTO = {
        key_name: {
            required: true,
            type: 'string',
            min_length: 3,
            max_length: 128,
        },
        key_types: {
            required: true,
            type: 'array',
            element_type: 'string',
            element_enum: keyTypes,
        },
        key_mock_data: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        key_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
    } 

    export const createApiResponseBody: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
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
            min_length: 1,
            max_length: 128
        },
        response_keys: {
            required: true,
            type: 'array',
            element_type: 'object',
            element_dto: createKey
        },
    }
    
    export const createApiPayloadBody: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        payload_type: {
            required: true,
            type: 'string',
            enum: payloadType
        },
        payload_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        payload_keys: {
            required: true,
            type: 'array',
            element_type: 'object',
            element_dto: createKey
        },
    }
    
}

export default ApisDto