namespace RegexUtil {
    export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    export const email = /^(?=.{1,64}$)[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/
}

export default RegexUtil