import DatabaseFunctions from "@database/functions.database";
import internalErrorCatcher from "./logger.internal";

async function logCronJob(jobName: string) {
    try {
        await DatabaseFunctions.insert({
            tableName: 'cronJobsLOGS',
            data: {
                cjlName: jobName
            }
        })
    } catch (error) {
        internalErrorCatcher(error);
    }
}

export default logCronJob