import cron from "cron";
import https from "https";

const job = new cron.CronJob(
  "*/14 * * * *", // Run every day at midnight
() => {
    https.get(process.env.API_URL, (res)=>{
        if(res.statusCode === 200) console.log("Get Request sent successfully");
    else console.error("Error sending Get Request", res.statusCode).on("error", (e)=>console.error("Error while sending request", e));
    })
})

export default job;