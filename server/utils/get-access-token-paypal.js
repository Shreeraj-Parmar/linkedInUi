
import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv()
const getToken = async () => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_SECRET;
        const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
        const response = await axios.post(
            process.env.PAYPAL_TOKEN_URL_DEVELOPMENT, // here if test than use sandbox url otherwise direct url
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        // console.log("res data is", response.data);
        return response.data.access_token;

    } catch (error) {
        console.log(error);
    }
};


export default getToken;