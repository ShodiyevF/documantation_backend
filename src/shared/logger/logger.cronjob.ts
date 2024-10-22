import internalErrorCatcher from "./logger.internal";
import LoggerQueries from "./logger.query";

async function logCronJob(jobName: string) {
    try {
        await LoggerQueries.insertCronJob({
            cjName: jobName
        })
    } catch (error) {
        internalErrorCatcher(error);
    }
}

export default logCronJob