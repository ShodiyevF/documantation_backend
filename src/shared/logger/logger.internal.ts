import DatabaseFunctions from '@database/functions.database';
import LoggerLib from '@sharedLib/helper';

async function internalErrorCatcher(error: any): Promise<void>{
    const errorFile = LoggerLib.getErrorLine(error);
    
    await DatabaseFunctions.insert({
        tableName: 'internalErrorsLOGS',
        data: {
            ielDescription: error instanceof Error ? errorFile : error,
            ielStack: error.stack
        }
    })
}

export default internalErrorCatcher