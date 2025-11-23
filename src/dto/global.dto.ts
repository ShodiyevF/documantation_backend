import ValidationInterface from "@shared/validation/validation.interface";

namespace GlobalDto {

    export const getAllQuery: ValidationInterface.DTO = {
        term: {
            required: false,
            type: 'string',
            min_length: 1,
            max_length: 128
        }
    }
    
}

export default GlobalDto