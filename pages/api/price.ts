import { NextApiRequest, NextApiResponse } from "next";
import getPrice from "services/coinmarketcap";

const XNO_CURRENCY_ID = 1567;
const CONVERT_SYMBOL = "USD";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await getPrice(XNO_CURRENCY_ID, CONVERT_SYMBOL);
        res.status(200).json(data);
    } catch (e) {
        console.error("error", e)
        res.status(500).json({
            message: "Unable to fetch price",
        });
    }
}