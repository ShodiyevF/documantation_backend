import ValidationInterface from "@shared/validation/validation.interface";
import DbTableSchema from "@database/schema.database";
import RegexUtil from "@util/regex.util";
import SchemaLib from "@lib/schema.lib";

namespace ApisDto {
    
    export const getApisQuery: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const getApiByIdParams: ValidationInterface.DTO = {
        api_id: {
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

    export const changeApiModuleBody: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }

    export const updateApiParams: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const updateApiBody: ValidationInterface.DTO = {
        api_name: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        api_route: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 256
        },
        api_method: {
            required: false,
            type: 'string',
            enum: DbTableSchema.apisApiMethodEnumList
        },
        api_authorization: {
            required: false,
            type: 'boolean'
        },
        api_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
        },
    }

    export const deleteApiParams: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
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
        payload_schema: {
            required: true,
            type: 'object',
            custom_validation: (value: any) => {
                const schemaValidation = SchemaLib.schemaValidator(value)
                if (schemaValidation.error) {
                    return {
                        error: true,
                        message: schemaValidation.message
                    }
                }

                return {
                    error: false
                }
            }
        },
        payload_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
        },
    }
    
    export const updateApiPayloadParams: ValidationInterface.DTO = {
        payload_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }
    
    export const updateApiPayloadBody: ValidationInterface.DTO = {
        payload_type: {
            required: false,
            type: 'string',
            enum: DbTableSchema.payloadsPayloadTypeEnumList
        },
        payload_schema: {
            required: false,
            type: 'object',
            custom_validation: (value: any) => {
                const schemaValidation = SchemaLib.schemaValidator(value)
                if (schemaValidation.error) {
                    return {
                        error: true,
                        message: schemaValidation.message
                    }
                }

                return {
                    error: false
                }
            }
        },
        payload_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
        },
    }
    
    export const deleteApiPayloadParams: ValidationInterface.DTO = {
        payload_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }

    export const createApiResponseBody: ValidationInterface.DTO = {
        api_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        response_type: {
            required: true,
            type: 'string',
            enum: DbTableSchema.responsesResponseTypeEnumList
        },
        response_schema: {
            required: true,
            type: 'object',
            custom_validation: (value: any) => {
                const schemaValidation = SchemaLib.schemaValidator(value)
                if (schemaValidation.error) {
                    return {
                        error: true,
                        message: schemaValidation.message
                    }
                }

                return {
                    error: false
                }
            }
        },
        response_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
        },
    }
    
    export const updateApiResponseParams: ValidationInterface.DTO = {
        response_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }
    
    export const updateApiResponseBody: ValidationInterface.DTO = {
        response_type: {
            required: false,
            type: 'string',
            enum: DbTableSchema.responsesResponseTypeEnumList
        },
        response_schema: {
            required: false,
            type: 'object',
            custom_validation: (value: any) => {
                const schemaValidation = SchemaLib.schemaValidator(value)
                if (schemaValidation.error) {
                    return {
                        error: true,
                        message: schemaValidation.message
                    }
                }

                return {
                    error: false
                }
            }
        },
        response_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512
        },
    }
    
    export const deleteApiResponseParams: ValidationInterface.DTO = {
        response_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }
    
}

export default ApisDto



