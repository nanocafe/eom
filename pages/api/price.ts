import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const XNO_ID = 1567;
const CONVERT = "USD";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.get(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${XNO_ID}&convert=${CONVERT}`,
            {
                headers: {
                    "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
                    "Accept": "application/json",
                },
            }
        );
        res.status(200).json({
            ...response.data.data[XNO_ID].quote[CONVERT],
        });
    } catch (e) {
        console.log("error", e)
        res.status(500).json({
            error: "Unable to fetch price",
        });
    }
}