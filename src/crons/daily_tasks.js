import cron from 'node-cron'
import Utils from "../utils/utils";
import CronValues from "../globals/constants/global_constants";
const utils = new Utils();
export const cronJob = cron.schedule(process.env.CRON_JOB_DB_CLEANER, () => {
    utils.kabadiwala().then(result => console.log(`Cleaning Done`)).catch(err=>{
        console.log(`Cleaning Failed ${err}`)
    });
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata' // IST timezone
});

