import cron from 'node-cron'

import logCronJob from '@shared/logger/logger.cronjob'

function newCronJob(jobName: string, schedule: string, job: Function): cron.ScheduledTask {
    return cron.schedule(schedule, () => {
        logCronJob(jobName)
        job()
    })
}

export default newCronJob