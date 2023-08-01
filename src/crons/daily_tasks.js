import cron from 'node-cron'
import Utils from "../utils/utils";
import CronValues from "../globals/constants/global_constants";
const utils = new Utils();
export const cronJob_Night = cron.schedule(CronValues.Late_Night_11 , () => {
    utils.kabadiwala().then(result => console.log(`Cleaning Done`)).catch(err=>{
        console.log(`Cleaning Failed ${err}`)
    });
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata' // IST timezone
});
