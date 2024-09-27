import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
import ConnectDB from "./Database/db.js";
import router from "./routes/route.js";

const app = express();
app.use(cors());
dotEnv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use("/", router);
const PORT = process.env.PORT;

ConnectDB();
app.listen(PORT, () => {
  console.log(`Server Is Running ON PORT ${PORT}`);
});
