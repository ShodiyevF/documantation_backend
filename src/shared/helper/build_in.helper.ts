namespace BuildInSharedHelper {
    
    export function isString(value: any) {
        return typeof value === 'string' || value instanceof String;
    }
    
    export function isNumber(value: any) {
        if (typeof value === 'number' && !isNaN(value)) return true;
        if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return true;
        return false;
    }
    
    export function isBoolean(value: any) {
        if (typeof value === 'boolean') {
            return true
        }
        if (value === 'true' || value === 'false') {
            return true
        }
        
        return false;
    }
    
    export function isObject(value: any) {
        return (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        )
    }
    
    export function isArray(value: any) {
        return Array.isArray(value);
    }
    
    
    export function getObjectOriginalType(value: unknown): string {
        return Object.prototype.toString.call(value).slice(8, -1);
    }
    
}

export default BuildInSharedHelper