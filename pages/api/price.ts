import { CONVERT_SYMBOL, COIN_ID } from "config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { getLatestPrice } from "services/coingecko";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await getLatestPrice(COIN_ID, CONVERT_SYMBOL);
        res.status(200).json(data);
    } catch (e) {
        console.error("error", e)
        res.status(500).json({
            message: "Unable to fetch price",
        });
    }
}