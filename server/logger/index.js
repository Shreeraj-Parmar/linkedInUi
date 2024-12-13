import developmentLogger from "./development-logger.js";
import productionLogger from "./production-logger.js";
import { configDotenv } from "dotenv";

configDotenv();

let logger = null;

if (process.env.NODE_ENV === "development") {

    logger = developmentLogger();
} else if (process.env.NODE_ENV === "production") {
    logger = productionLogger();
}

export default logger;