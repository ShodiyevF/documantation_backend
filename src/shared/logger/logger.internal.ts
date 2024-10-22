import LoggerQueries from './logger.query';
import LoggerLib from '@sharedLib/helper';

async function internalErrorCatcher(error: any): Promise<void>{
    const errorFile = LoggerLib.getErrorLine(error);
    
    await LoggerQueries.insertInternalCatcher({
        ieDescription: error instanceof Error ? errorFile : error,
        ieStack: error.stack
    })
}

export default internalErrorCatcher