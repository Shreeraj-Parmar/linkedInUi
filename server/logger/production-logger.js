// import winston from "winston"
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize } = format;

const productionLogger = () => {

    const myFormat = printf(({ level, message, timestamp }) => {
        return ` [${level}]:  ${timestamp}  ${message}`;
    });

    const logDir = "logs"
    const sevenDaysAgo = moment().subtract(7, "days")
    fs.readdirSync(logDir).forEach(file => {
        const filePath = `${logDir}/${file}`
        const fileDate = moment(fs.statSync(filePath).ctime)
        if (fileDate.isBefore(sevenDaysAgo)) {
            fs.unlinkSync(filePath)
        }
    })


    return createLogger({
        level: "debug", // abvove this level not running
        format: combine(  // combine method used to combine the formates
            // colorize(), // if i write here than it shows color in console but not into the file , if  not write than color shows into the file but not in console , so when use production than dont use colorised 
            timestamp(), // acctual server time
            myFormat
        ),
        transports: [
            new transports.Console(), // logs in console
            new transports.File({ filename: `logs/${moment().format("DD-MM-YYYY")}.log` }), // all logs in combined.log file
        ],
    })
}

export default productionLogger;