import ValidationInterface from "@shared/validation/validation.interface";
import DbTableSchema from "@database/schema.database";
import RegexUtil from "@util/regex.util";

namespace ApisDto {

    const keyTypes = ['boolean', 'number', 'int', 'object', 'null', 'string']
    
    export const getApisQuery: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const createApiBody: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        api_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        api_route: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 256
        },
        api_method: {
            required: true,
            type: 'string',
            enum: DbTableSchema.apisApiMethodEnumList
        },
        api_authorization: {
            required: true,
            type: 'boolean'
        },
        api_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
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
            enum: DbTableSchema.payloadsPayloadTypeEnumList
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