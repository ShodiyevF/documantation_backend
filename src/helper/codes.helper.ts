import DatabaseFunctions from "@database/functions.database";
import Exception from "@lib/http_exception.lib";

namespace CodesHelper {
    
    export async function checkCodeReferenced(codeId: string) {
        const checkPayload = await DatabaseFunctions.select({
            tableName: 'payloadCodes',
            filter: {
                pcCodeId: codeId
            }
        })
        if (checkPayload) {
            throw new Exception.HttpException(400, 'Some payload is attached to the code', Exception.Errors.SOME_PAYLOAD_ATTACHED_TO_CODE)
        }

        const checkResponse = await DatabaseFunctions.select({
            tableName: 'responseCodes',
            filter: {
                rcCodeId: codeId
            }
        })
        if (checkResponse) {
            throw new Exception.HttpException(400, 'Some response is attached to the code', Exception.Errors.SOME_RESPONSE_ATTACHED_TO_CODE)
        }

        return ''
    }
    
}

export default CodesHelper