import ValidationInterface from "@shared/validation/validation.interface";
import RegexUtil from "@util/regex.util";

namespace CodesDto {

    export const getCodesQuery: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const getCodeByIdParams: ValidationInterface.DTO = {
        code_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const createCodeBody: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        code_value: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 64,
        },
        code_description: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 128,
        },
    }

    export const updateCodeParams: ValidationInterface.DTO = {
        code_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }

    export const updateCodeBody: ValidationInterface.DTO = {
        code_value: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 64,
        },
        code_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128,
        },
    }

    export const deleteCodeParams: ValidationInterface.DTO = {
        code_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
    }

}

export default CodesDto