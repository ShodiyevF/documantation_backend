import ValidationInterface from "@shared/validation/validation.interface";
import internalErrorCatcher from "@shared/logger/logger.internal";
import BuildInSharedHelper from "@shared/helper/build_in.helper";

namespace Validation {

    const NOT_FOUND = Symbol('NOT_FOUND');

    export function validator(dto: ValidationInterface.DTO, body: { [key: string]: any }): ValidationInterface.ValidationResult {
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

                    const stringTypeHandler = rules.type === 'string' ? !BuildInSharedHelper.isString(value) : null
                    const numberTypeHandler = rules.type === 'number' ? !BuildInSharedHelper.isNumber(value) : null
                    const objectTypeHandler = rules.type === 'object' ? !BuildInSharedHelper.isObject(value) : null
                    const booleanTypeHandler = rules.type === 'boolean' ? !BuildInSharedHelper.isBoolean(value) : null
                    const arrayTypeHandler = rules.type === 'array' ? !BuildInSharedHelper.isArray(value) : null
                    
                    const checkType = stringTypeHandler || numberTypeHandler || objectTypeHandler || booleanTypeHandler || arrayTypeHandler
                    
                    if (checkType) {
                        return { status: 400, error: `${key}: Expected type ${rules.type}, but got ${typeof value}` };
                    }
                    
                    if (rules.type === 'boolean') {
                        if (!BuildInSharedHelper.isBoolean(value)) {
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
                        if (rules.min_length !== undefined && value.length < rules.min_length) {
                            return { status: 400, error: `${key}: Length should be at least ${rules.min_length} characters` };
                        }
                        if (rules.max_length !== undefined && value.length > rules.max_length) {
                            return { status: 400, error: `${key}: Length should be at most ${rules.max_length} characters` };
                        }
                    }

                    if (rules.type === 'object') {
                        if (rules.dto) {
                            const validatorResponse = Validation.validator(rules.dto, value);
                            if (validatorResponse.status != 200) {
                                return validatorResponse
                            }
                        }
                    }

                    if (rules.type === 'string' || rules.type === 'number') {
                        if (rules.pattern && !rules.pattern.test(value)) {
                            return { status: 400, error: `${key}: Value does not match the required pattern ${rules.pattern}` };
                        }
                        
                        if (rules.enum) {
                            const checker = rules.enum.includes(value)
                            if (!checker) {
                                return { status: 400, error: `The entered value must match one of the specified values. Specified values: '${rules.enum.join(`', '`)}'` };
                            }
                        }

                        if (rules.custom_validation && !rules.custom_validation[0](value)) {
                            return { status: 400, error: `${key}: ${rules.custom_validation[1]}` };
                        }
                    }

                    if (rules.type === 'array') {

                        if (!Array.isArray(value)) {
                            return { status: 400, error: `${key}: Expected type ${rules.type}, but got ${typeof value}` };
                        }

                        const stringTypeHandler = rules.element_type === 'string' ? !value.every(element => BuildInSharedHelper.isString(element)) : null
                        const numberTypeHandler = rules.element_type === 'number' ? !value.every(element => BuildInSharedHelper.isNumber(element)) : null
                        const objectTypeHandler = rules.element_type === 'object' ? !value.every(element => BuildInSharedHelper.isObject(element)) : null
                        const booleanTypeHandler = rules.element_type === 'boolean' ? !value.every(element => BuildInSharedHelper.isBoolean(element)) : null
                        const checkType = stringTypeHandler || numberTypeHandler || objectTypeHandler || booleanTypeHandler
                        
                        if (checkType) {
                            const stringBadValue = rules.element_type === 'string' ? value.find(element => BuildInSharedHelper.isString(element)) : NOT_FOUND
                            const numberBadValue = rules.element_type === 'number' ? value.find(element => !BuildInSharedHelper.isNumber(element)) : NOT_FOUND
                            const objectBadValue = rules.element_type === 'object' ? value.find(element => !BuildInSharedHelper.isObject(element)) : NOT_FOUND
                            const booleanBadValue = rules.element_type === 'boolean' ? value.find(element => !BuildInSharedHelper.isBoolean(element)) : NOT_FOUND
                            const badValues = [stringBadValue, numberBadValue, objectBadValue, booleanBadValue]
                            const badValue = badValues.find(value => value !== NOT_FOUND)
                            
                            const returnBadValue = typeof badValue === 'object' ? JSON.stringify(badValue) : badValue
                            
                            const getBadObjectType = typeof badValue === 'object' ? BuildInSharedHelper.getObjectOriginalType(badValue) : null
                            const badValueType = getBadObjectType || typeof badValue
                            
                            return { status: 400, error: `${key} child ${returnBadValue}: Expected type ${rules.element_type}, but got ${badValueType}` };
                        }

                        if (rules.element_type === 'boolean') {
                            const checkElementBoolean = value.find(element => !BuildInSharedHelper.isBoolean(element))
                            if (checkElementBoolean) {
                                return { status: 400, error: `${key} child ${checkElementBoolean}: Expected type ${rules.element_type}, but got ${typeof checkElementBoolean}` };
                            }
                        }

                        if (rules.element_type === 'string') {
                            if (rules.element_min_length) {
                                const checkElementMinLength = value.find(element => element.length < rules.element_min_length!)
                                if (checkElementMinLength) {
                                    return { status: 400, error: `${key} child ${checkElementMinLength}: Length should be at least ${rules.element_min_length} characters` };
                                }
                            }

                            if (rules.element_max_length) {
                                const checkElementMaxLength = value.find(element => element.length > rules.element_max_length!)
                                if (checkElementMaxLength) {
                                    return { status: 400, error: `${key} child ${checkElementMaxLength}: Length should be at most ${rules.element_max_length} characters` };
                                }
                            }
                        }

                        if (rules.element_type === 'number') {
                            if (rules.element_min) {
                                const checkElementMin = value.find(element => element < rules.element_min!)
                                if (checkElementMin) {
                                    return { status: 400, error: `${key} child ${checkElementMin}: Value should be greater than or equal to ${rules.element_min}` };
                                }
                            }
        
                            if (rules.element_max) {
                                const checkElementMax = value.find(element => element > rules.element_max!)
                                if (checkElementMax) {
                                    return { status: 400, error: `${key} child ${checkElementMax}: Value should be less than or equal to ${rules.element_max}` };
                                }
                            }
                        }

                        if (rules.element_type === 'object') {
                            if (rules.element_dto) {
                                const checkElementDto = value.find(element => Validation.validator(rules.element_dto!, element).status !== 200);
                                if (checkElementDto) {
                                    return Validation.validator(rules.element_dto!, checkElementDto)
                                }
                            }
                        }

                        if (rules.element_type === 'string' || rules.element_type === 'number') {
                            if (rules.element_pattern) {
                                const checkElementPattern = value.find(element => !rules.element_pattern!.test(element))
                                if (checkElementPattern) {
                                    return { status: 400, error: `${key} child ${checkElementPattern}: Value does not match the required pattern ${rules.element_pattern}` };
                                }
                            }
                            
                            if (rules.element_enum) {
                                const checkElementEnum = value.find(element => !rules.element_enum!.includes(element))
                                if (checkElementEnum) {
                                    return { status: 400, error: `${key} child ${checkElementEnum}: The entered value must match one of the specified values. Specified values: '${rules.element_enum.join(`', '`)}'` };
                                }
                            }

                            if (rules.element_custom_validation) {
                                const checkElementCustomValidation = value.find(element => !rules.element_custom_validation![0](element))
                                if (checkElementCustomValidation) {
                                    return { status: 400, error: `${key} child ${checkElementCustomValidation}: ${rules.element_custom_validation[1]}` };
                                }
                            }
                        }
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