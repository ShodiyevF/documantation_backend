import DatabaseFunctions from "@database/functions.database";
import JwtLib from "./jwt.lib";

namespace FinderLib {

    export async function findUser(token: string) {
        const splitToken = token.split(' ')[1]
        
        const tokenVerifier: JwtLib.IVerifyJwtToken<{ id: string }> = JwtLib.verifyJwtToken(splitToken);
        if (tokenVerifier.result !== 'VERIFIED') {
            return 'ERROR'
        }
    
        const userId = tokenVerifier.data.id
        
        const user = await DatabaseFunctions.select({
            tableName: 'users',
            filter: {
                userId: userId
            }
        })
        
        return user.userId
    }
    
}

export default FinderLib