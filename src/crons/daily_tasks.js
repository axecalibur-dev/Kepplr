import cron from 'node-cron'
import Utils from "../utils/utils";
const utils = new Utils();
export const cronJob_Night = cron.schedule(process.env.CRON_SCHEDULE , () => {
    utils.kabadiwala().then(result => console.log(`Cleaning Done`)).catch(err=>{
        console.log(`Cleaning Failed ${err}`)
    });
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata' // IST timezone
});
