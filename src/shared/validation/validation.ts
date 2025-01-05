import internalErrorCatcher from "@shared/logger/logger.internal";

namespace Validation {

    interface ValidationRule {
        required?: boolean;
        type?: string;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp[];
        custom_validation?: [((value: any) => boolean | string), string];
    }
    
    export interface DTO {
        [key: string]: ValidationRule;
    }
    
    interface ValidationResult {
        status: number;
        error?: string;
    }
    
    export function validator(dto: DTO, body: { [key: string]: any }): ValidationResult {
        try {   
            for (const key in dto) {
                if (dto.hasOwnProperty(key)) {
                    const rules = dto[key];
                    const value = body[key];
    
                    if (rules.required && (value === undefined || value === null || value === '')) {
                        return { status: 400, error: `${key}: Field is required` };
                    }
    
                    if (value === undefined || value === null || value === '') {
                        continue;
                    }
                    
                    if (typeof value !== rules.type) {
                        return { status: 400, error: `${key}: Expected type ${rules.type}, but got ${typeof value}` };
                    }
    
                    if (rules.type === 'boolean') {   
                        if (value !== true && value !== false && value !== 'true' && value !== 'false') {
                            return { status: 400, error: `${key}: Expected type ${rules.type}, but got ${typeof value}` };
                        }
                    }
    
                    if (rules.type === 'number') {
                        if (rules.min !== undefined && value < rules.min) {
                            return { status: 400, error: `${key}: Value should be greater than or equal to ${rules.min}` };
                        }
    
                        if (rules.max !== undefined && value > rules.max) {
                            return { status: 400, error: `${key}: Value should be less than or equal to ${rules.max}` };
                        }
                    }
    
                    if (rules.type === 'string') {
                        if (rules.minLength !== undefined && value.length < rules.minLength) {
                            return { status: 400, error: `${key}: Length should be at least ${rules.minLength} characters` };
                        }
                        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                            return { status: 400, error: `${key}: Length should be at most ${rules.maxLength} characters` };
                        }
                    }
    
                    if (rules.pattern && rules.pattern.length && !rules.pattern[0].test(value)) {
                        return { status: 400, error: `${key}: Value does not match the required pattern ${rules.pattern[0]}` };
                    }
    
                    if (rules.custom_validation && (!rules.custom_validation[0](value) || typeof rules.custom_validation[0](value) === 'string')) {
                        
                        console.log(`${key}: ${typeof rules.custom_validation[0](value) === 'string' ? rules.custom_validation[0](value) : rules.custom_validation[1]}`);
                        
                        return { status: 400, error: `${key}: ${typeof rules.custom_validation[0](value) === 'string' ? rules.custom_validation[0](value) : rules.custom_validation[1]}` };
                    }
                }
            }
    
            return { status: 200 };
        } catch (error) {
            internalErrorCatcher(error)
            return { status: 400 };
        }
    }

}

export default Validation