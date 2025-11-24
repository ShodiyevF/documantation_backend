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
    
}

export default UsefulfunctionsUtil