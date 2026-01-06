import ValidationInterface from "@shared/validation/validation.interface";
import RegexUtil from "@util/regex.util";

namespace ModulesDto {

    export const getModulesQuery: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }
    
    export const getModuleByIdParams: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const createModuleBody: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        module_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 32,
        },
        module_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512,
        },
    }

    export const updateModuleParams: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

    export const updateModuleBody: ValidationInterface.DTO = {
        module_name: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 32,
        },
        module_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 512,
        },
    }

    export const deleteModuleParams: ValidationInterface.DTO = {
        module_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        }
    }

}

export default ModulesDto