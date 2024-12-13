// import winston from "winston"
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize } = format;

const developmentLogger = () => {

    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
    });

    return createLogger({
        level: "debug", // abvove this level not running
        format: combine(  // combine method used to combine the formates
            colorize(), // if i write here than it shows color in console but not into the file , if  not write than color shows into the file but not in console , so when use production than dont use colorised 
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            myFormat
        ),
        transports: [
            new transports.Console(), // logs in console
            new transports.File({ filename: "combined.log" }), // all logs in combined.log file
            new transports.File({ filename: "error.log", level: "error" }), // only error logs in error.log file
        ],
    })
}

export default developmentLogger;