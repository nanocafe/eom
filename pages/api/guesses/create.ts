import { toRaws, TunedBigNumber } from "lib/nano/convert";
import { block_info } from "lib/nano/rpc";
import { NextApiRequest, NextApiResponse } from "next";
import Guesses from "../db/Guesses";
import { GuessData } from "../types";

const OPEN_DAY = Number(process.env.OPEN_DAY || 1);
const CLOSE_DAY_BEFORE = Number(process.env.CLOSE_DAY_BEFORE || 1);
const HOT_WALLET = process.env.HOT_WALLET;
const PRICE_GUESS_NANO = toRaws(process.env.PRICE_GUESS_NANO);

const daysInThisMonth = () => new Date(0).getDate();
const today = () => new Date().getDay()

export default function Create(req: NextApiRequest, res: NextApiResponse) {

    // Competition of the month not yet started
    if (today() < OPEN_DAY) return res.status(400).json({ error: "not started yet" })

    // Competition of the month finished
    if ((daysInThisMonth() - today()) <= CLOSE_DAY_BEFORE) {
        return res.status(400).json({ error: "finished" })
    }

    // Parse user json request 
    let json: GuessData = {}
    try {
        json = JSON.parse(req.body)
    } catch (e) {
        return res.status(400).json({
            error: "Unable to parse JSON"
        });
    }

    console.log(json)

    // Validate payment
    block_info(json.hash)
        .then((block) => {

            // If paid amount is less than price, return error
            // Code 402 = Payment Required 
            if (TunedBigNumber(block.amount).isLessThan(PRICE_GUESS_NANO)) {
                return res.status(402).json({ error: "invalid amount" });
            }

            if (block.link_as_account != HOT_WALLET) {
                return res.status(402).json({ error: "invalid destination" });
            }

            const { nickname, address, price, hash } = json;

            Guesses.create({ nickname, address, price, hash })
                .then(resp => {
                    console.log(resp)
                    res.status(200).json({
                        successful: true,
                        ...resp
                    });
                })
                .catch(err => {
                    res.status(400).json(err)
                })
        })
        .catch((err) => res.status(400).json({ error: err }))

}