import { checkNanoAddress } from "lib/nano/check";
import { toRaws, TunedBigNumber } from "lib/nano/convert";
import { block_info } from "lib/nano/rpc";
import { NextApiRequest, NextApiResponse } from "next";
import { validateNanoAddress, validateNickname, validatePrice } from "utils/validate";
import Guesses from "../db/Guesses";
import { GuessData } from "../types";

const OPEN_DAY = Number(process.env.OPEN_DAY || 1);
const CLOSE_DAY_BEFORE = Number(process.env.CLOSE_DAY_BEFORE || 1);
const HOT_WALLET = process.env.HOT_WALLET;
const PRICE_GUESS_NANO = toRaws(process.env.PRICE_GUESS_NANO);

const daysInThisMonth = () => new Date(0).getDate();
const today = () => new Date().getDate();

const validateGuess = (guess: GuessData) => {

    // Validate price
    if (!("price" in guess)) {
        throw ("Missing price");
    }
    validatePrice(guess.price);

    // Validate nickname
    if (!("nickname" in guess)) {
        throw ("Missing nickname");
    }
   validateNickname(guess.nickname);

   // Validate Nano address
    if (!("address" in guess)) {
        throw ("Missing address");
    }
    validateNanoAddress(guess.address);
};

export default function Create(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST requests allowed' })

    // Competition of the month not yet started
    if (today() < OPEN_DAY) return res.status(400).json({ error: "not started yet" })

    // Competition of the month finished
    if ((daysInThisMonth() - today()) <= CLOSE_DAY_BEFORE) {
        return res.status(400).json({ error: "finished" })
    }

    // Parse user json request 
    let json: GuessData = req.body;
    if (typeof json !== "object") {
        try {
            json = JSON.parse(req.body)
        } catch (e) {
            return res.status(400).json({
                error: "unable to parse JSON"
            });
        }
    }
    
    // Validate user guess
    try {
        validateGuess(json);
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }

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