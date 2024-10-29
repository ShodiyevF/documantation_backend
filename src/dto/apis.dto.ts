import Validation from "@shared/validation/validation";
import RegexUtil from "@util/regex.util";

namespace ApisDto {

    export const getApisParams: Validation.DTO = {
        project_id: {
            required: true,
            type: 'string',
            pattern: [RegexUtil.UUID]
        }
    }
    
}

export default ApisDto