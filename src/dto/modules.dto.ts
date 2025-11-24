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

}

export default ModulesDto