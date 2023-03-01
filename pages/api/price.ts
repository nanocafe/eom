import { CONVERT_SYMBOL, COIN_ID } from "config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { getLatestPrice } from "services/coingecko";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method !== "GET") {
            return res.status(405).json({
                message: "Method not allowed",
            });
        }

        const { usd, usd_24h_change, url } = await getLatestPrice(COIN_ID, CONVERT_SYMBOL);
        res.status(200).json({ usd, usd_24h_change, url });
    } catch (e) {
        console.error("error", e)
        res.status(500).json({
            message: "Unable to fetch price",
        });
    }
}