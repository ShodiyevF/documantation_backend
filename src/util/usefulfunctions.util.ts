namespace UsefulfunctionsUtil {
    
    export function isNullableData(newData: any, oldData: any) {
        if (newData === null) {
            return null
        }
        
        if (!newData) {
            return oldData
        }
        
        if (newData) {
            return newData
        }
    }
    
    export function hasKey<T extends object>(
        obj: T,
        key: PropertyKey
    ): key is keyof T {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    
}

export default UsefulfunctionsUtil