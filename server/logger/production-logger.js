// import winston from "winston"
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize } = format;

const productionLogger = () => {

    const myFormat = printf(({ level, message, timestamp }) => {
        return ` [${level}]:  ${timestamp}  ${message}`;
    });

    return createLogger({
        level: "debug", // abvove this level not running
        format: combine(  // combine method used to combine the formates
            // colorize(), // if i write here than it shows color in console but not into the file , if  not write than color shows into the file but not in console , so when use production than dont use colorised 
            timestamp(), // acctual server time
            myFormat
        ),
        transports: [
            new transports.Console(), // logs in console
            new transports.File({ filename: "myLogs.log" }), // all logs in combined.log file
            // new transports.File({ filename: "error.log", level: "error" }), // only error logs in error.log file
        ],
    })
}

export default productionLogger;