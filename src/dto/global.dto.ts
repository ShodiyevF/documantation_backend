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

    export const paginationQuery: ValidationInterface.DTO = {
        page: {
            required: true,
            type: 'number',
            min: 1,
            max: 2048,
        },
        limit: {
            required: true,
            type: 'number',
            min: 1,
            max: 200,
        },
    }
    
}

export default GlobalDto