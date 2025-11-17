import ValidationInterface from "@shared/validation/validation.interface";
import RegexUtil from "@util/regex.util";

namespace ProjectsDto {

    export const createProject: ValidationInterface.DTO = {
        project_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 32
        },
        project_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 1024
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

export default ProjectsDto