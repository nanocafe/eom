import { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";
import axios from "axios";

const XNO_ID = 1567;
const CONVERT = "USD";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${XNO_ID}&convert=${CONVERT}`;
        const cachedResponse = cache.get(url);
        if (cachedResponse) {
            res.status(200).json({
                ...cachedResponse
            });
        } else {
            const response = await axios.get(
                url,
                {
                    headers: {
                        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
                        "Accept": "application/json",
                    },
                }
            );
            const data = response.data.data[XNO_ID].quote[CONVERT];
            cache.put(url, data, CACHE_TIME);
            res.status(200).json({
                ...data,
            });
        }
    } catch (e) {
        console.log("error", e)
        res.status(500).json({
            message: "Unable to fetch price",
        });
    }
}