import ValidationInterface from "@shared/validation/validation.interface";
import DbTableSchema from "@database/schema.database";
import RegexUtil from "@util/regex.util";

namespace ProjectsDto {

    export const createProject: ValidationInterface.DTO = {
        project_name: {
            required: true,
            type: 'string',
            min_length: 1,
            max_length: 32
        },
        project_base_url: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        },
        project_authorization_type: {
            required: false,
            type: 'string',
            enum: DbTableSchema.projectsProjectAuthorizationTypeEnumList
        },
        project_description: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 1024
        },
    }

    export const createProjectInvitations: ValidationInterface.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: RegexUtil.UUID
        },
        user_ids: {
            required: true,
            type: 'array',
            element_type: 'string',
            element_pattern: RegexUtil.UUID
        },
    }
    
}

export default ProjectsDto