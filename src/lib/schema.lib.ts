import BuildInSharedHelper from "@shared/helper/build_in.helper";
import UsefulfunctionsUtil from "@util/usefulfunctions.util";
import RegexUtil from "@util/regex.util";

namespace SchemaLib {
    
    interface IPayloadBase {
        type: 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'file';
        example: any;
        description?: string;
    }
    
    interface IStringPayload extends IPayloadBase {
        type: 'string';
        min_length?: number;
        max_length?: number;
        pattern?: RegExp;
        enum_list?: any[];
        example: string;
    }
    
    interface INumberPayload extends IPayloadBase {
        type: 'number';
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum_list?: any[];
        example: number;
    }
    
    interface IBooleanPayload extends IPayloadBase {
        type: 'boolean';
        example: boolean;
    }
    
    interface INullPayload extends IPayloadBase {
        type: 'null';
        example: null;
    }
    
    interface IArrayPayload extends IPayloadBase {
        type: 'array';
        items_min_length?: number;
        items_max_length?: number;
        items: ChildPayload;
        example: any[];
    }
    
    interface IObjectPayload extends IPayloadBase {
        type: 'object';
        properties: {
            [key: string]: ChildPayload
        }
        example: object;
    }
    
    interface IFileType extends Omit<IPayloadBase, 'example'> {
        type: 'file';
        max_size?: number;
        mime_types?: string[];
    }
    
    type BaseChild<T> = Omit<T, 'example'> & {
        is_required: boolean;
    };
    
    type ChildPayload =
    | BaseChild<IStringPayload>
    | BaseChild<INumberPayload>
    | BaseChild<IBooleanPayload>
    | BaseChild<INullPayload>
    | (BaseChild<IArrayPayload> & {
        items: ChildPayload;
    })
    | (BaseChild<IObjectPayload> & {
        properties: Record<string, ChildPayload>;
    });
    
    type Payload = IStringPayload | INumberPayload | IBooleanPayload | INullPayload | IArrayPayload | IObjectPayload | IFileType
    
    
    type TSchemaValidatorReturn = {
        error: true;
        message: string;
    } | {
        error: false;
    }
    
    const correctTypes = ['string', 'number', 'boolean', 'null', 'array', 'object', 'file']
    
    function typeFinder(type: IPayloadBase['type']) {
        if (type === 'string') {
            return BuildInSharedHelper.isString
        } else if (type === 'number') {
            return BuildInSharedHelper.isNumber
        } else if (type === 'boolean') {
            return BuildInSharedHelper.isBoolean
        } else if (type === 'null') {
            return (value: any) => value === null
        } else if (type === 'array') {
            return BuildInSharedHelper.isArray
        } else {
            return BuildInSharedHelper.isObject
        }
    }
    
    export function schemaValidator(schema: any, isRoot: boolean = true): TSchemaValidatorReturn {
        const {
            type,
            example,
            description,
        } = schema

        if (!UsefulfunctionsUtil.hasKey(schema, 'type')) {
            return { error: true, message: 'type: field is required' }
        }
        
        if (!correctTypes.includes(type)) {
            return { error: true, message: 'type: It must be one of these. ' + correctTypes.join(', ') }
        }

        const typeFunc = typeFinder(type)
        
        if (isRoot && !UsefulfunctionsUtil.hasKey(schema, 'example')) {
            return { error: true, message: 'example: field is required' }
        }
        
        if (isRoot && !typeFunc(example)) {
            return { error: true, message: 'example: must be ' + type}
        }

        if (UsefulfunctionsUtil.hasKey(schema, 'description') && !BuildInSharedHelper.isString(description)) {
            return { error: true, message: 'description: must be string' }
        }

        if (isRoot && UsefulfunctionsUtil.hasKey(schema, 'is_required')) {
            return { error: true, message: 'is_required: is not allowed in root payload' }
        }
        
        if (type === 'string') {
            const { min_length, max_length, pattern, enum_list } = schema
            
            if (UsefulfunctionsUtil.hasKey(schema, 'min_length') && !BuildInSharedHelper.isNumber(min_length)) {
                return { error: true, message: 'min_length: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'max_length') && !BuildInSharedHelper.isNumber(max_length)) {
                return { error: true, message: 'max_length: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'pattern') && !RegexUtil.isValidRegex(pattern!)) {
                return { error: true, message: 'pattern: must be regex' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'enum_list') && !BuildInSharedHelper.isArray(enum_list)) {
                return { error: true, message: 'enum_list: must be array' }
            }
        }
        
        if (type === 'number') {
            const { min, max, pattern, enum_list } = schema
            
            if (UsefulfunctionsUtil.hasKey(schema, 'min') && !BuildInSharedHelper.isNumber(min)) {
                return { error: true, message: 'min: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'max') && !BuildInSharedHelper.isNumber(max)) {
                return { error: true, message: 'max: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'pattern') && !RegexUtil.isValidRegex(pattern!)) {
                return { error: true, message: 'pattern: must be regex' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'enum_list') && !BuildInSharedHelper.isArray(enum_list)) {
                return { error: true, message: 'enum_list: must be array' }
            }
        }
        
        if (type === 'object') {
            const {
                properties,
            } = schema
            
            if (!UsefulfunctionsUtil.hasKey(schema, 'properties')) {
                return { error: true, message: 'properties: field is required' }
            }
            
            if (!BuildInSharedHelper.isObject(properties)) {
                return { error: true, message: 'properties: must be object' }
            }
            
            const entries = Object.entries(properties)
            
            for (const [childKey, childValue] of entries) {
                if (!childValue) {
                    return { error: true, message: `${childKey} → ${childValue}: field is required` }
                }
                
                if (!BuildInSharedHelper.isObject(childValue)) {
                    return { error: true, message: `${childKey} → ${childValue}: must be object` }
                }
                
                if (!UsefulfunctionsUtil.hasKey(childValue, 'is_required')) {
                    return { error: true, message: `${childKey} → is_required: field is required` }
                }
                
                if (!BuildInSharedHelper.isBoolean((childValue as any).is_required)) {
                    return { error: true, message: `${childKey} → is_required: must be boolean` }
                }
                
                const result = schemaValidator(childValue, false)
                if (result.error) {
                    return { error: true, message: `${childKey} → ${result.message}` }
                }
            }
        }
        
        if (type === 'array') {
            const {
                items,
                items_min_length,
                items_max_length
            } = schema
            
            if (!UsefulfunctionsUtil.hasKey(schema, 'items')) {
                return { error: true, message: 'items: field is required' }
            }
            
            if (!BuildInSharedHelper.isObject(items)) {
                return { error: true, message: 'items: must be object' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'items_min_length') && !BuildInSharedHelper.isNumber(items_min_length)) {
                return { error: true, message: 'items_min_length: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'items_max_length') && !BuildInSharedHelper.isNumber(items_max_length)) {
                return { error: true, message: 'items_max_length: must be number' }
            }
            
            if (!UsefulfunctionsUtil.hasKey(items, 'type')) {
                return { error: true, message: 'items → type: field is required' }
            }
            
            const itemType = items.type
            
            if (!correctTypes.includes(itemType)) {
                return { error: true, message: 'items → type: It must be one of these. ' + correctTypes.join(', ') }
            }
            
            const result = schemaValidator(items, false)
            if (result.error) {
                return { error: true, message: `items → ${result.message}` }
            }
        }
        
        if (type === 'file') {
            const {
                max_size,
                mime_types
            } = schema
            
            if (UsefulfunctionsUtil.hasKey(schema, 'max_size') && !BuildInSharedHelper.isNumber(max_size)) {
                return { error: true, message: 'max_size: must be number' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'mime_types') && !BuildInSharedHelper.isArray(mime_types)) {
                return { error: true, message: 'mime_types: must be array' }
            }
            
            if (UsefulfunctionsUtil.hasKey(schema, 'mime_types') && !mime_types!.every((mimeType: string) => BuildInSharedHelper.isString(mimeType))) {
                return { error: true, message: 'mime_types: items must be string' }
            }
        }
        
        return {
            error: false
        }
    }
    
}

export default SchemaLib