import Validation from "@shared/validation/validation";
import RegexUtil from "@util/regex.util";

namespace ProjectsDto {

    export const createProject: Validation.DTO = {
        project_name: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 32
        },
        project_description: {
            required: false,
            type: 'string',
            minLength: 1,
            maxLength: 1024
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

export default ProjectsDto