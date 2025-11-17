namespace ValidationInterface {

    interface IStringType {
        required: boolean;
        type: 'string';
        min_length?: number;
        max_length?: number;
        pattern?: RegExp;
        enum?: any[];
        custom_validation?: CustomValidation;
    }

    interface INumberType {
        required: boolean;
        type: 'number';
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: any[];
        custom_validation?: CustomValidation;
    }

    interface IBooleanType {
        required: boolean;
        type: 'boolean';
    }

    interface IObjectType {
        required: boolean;
        type: 'object';
        dto?: DTO;
    }

    interface IArrayElementStringType {
        required: boolean;
        type: 'array';
        element_type: 'string';
        element_min_length?: number;
        element_max_length?: number;
        element_pattern?: RegExp;
        element_enum?: any[];
        element_custom_validation?: CustomValidation;
    }

    interface IArrayElementNumberType {
        required: boolean;
        type: 'array';
        element_type: 'number';
        element_min?: number;
        element_max?: number;
        element_pattern?: RegExp;
        element_enum?: any[];
        element_custom_validation?: CustomValidation;
    }

    interface IArrayElementBooleanType {
        required: boolean;
        type: 'array';
        element_type: 'boolean';
    }

    interface IArrayElementObjectType {
        required: boolean;
        type: 'array';
        element_type: 'object';
        element_dto?: DTO;
    }

    type IArrayType = IArrayElementStringType | IArrayElementNumberType | IArrayElementBooleanType | IArrayElementObjectType

    type ValidationRule = IStringType | INumberType | IBooleanType | IObjectType | IArrayType
    
    type CustomValidation = [(value: any) => boolean, string];
    
    export interface DTO {
        [key: string]: ValidationRule;
    }
    
    export interface ValidationResult {
        status: number;
        error?: string;
    }
    
}

export default ValidationInterface