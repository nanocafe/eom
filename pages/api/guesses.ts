import axios from "axios";
import { DEFAULT_CLOSE_DAY, DEFAULT_OPEN_DAY, DEFAULT_PRICE_GUESS_NANO } from "core/constants";
import { checkNanoAddress } from "lib/nano/check";
import { toRaws, TunedBigNumber } from "lib/nano/convert";
import { NextApiRequest, NextApiResponse } from "next";
import { validateNanoAddress, validateNickname, validatePrice } from "utils/validate";
import Guesses from "./db/Guesses";
import { GuessData } from "./types";

const OPEN_DAY = Number(process.env.NEXT_PUBLIC_OPEN_DAY || DEFAULT_OPEN_DAY);
const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);
const PRICE_GUESS_NANO = toRaws(process.env.NEXT_PUBLIC_PRICE_GUESS_NANO || DEFAULT_PRICE_GUESS_NANO);
const CHECKOUT_API_KEY = process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '';
interface IPaymentMetadata {
    // Default NanoByte metadata fields
    merchantApiKey: string;
    paymentId: string;
    merchantName: string;
    amount: string;
    label: string;

    // Custom NanoCafe metadata fields
    userNickname: string;
    userNanoAddress: string;
    userGuessPrice: number;
}

interface IPaymentResponse {
    status: string;
    metadata: IPaymentMetadata;
}

const validateGuess = (guess: IPaymentMetadata) => {

    // Validate nickname
    if (!("userNickname" in guess)) {
        throw ("Missing nickname");
    }
    validateNickname(guess.userNickname);

    // Validate Nano address
    if (!("userNanoAddress" in guess)) {
        throw ("Missing address");
    }
    validateNanoAddress(guess.userNanoAddress);

    // Validate price
    if (!("userGuessPrice" in guess)) {
        throw ("Missing price");
    }
    const price = Number(guess.userGuessPrice);
    if (isNaN(price)) {
        throw ("Price must be a number");
    }
    validatePrice(price);
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        Guesses.init();
        await Guesses.sync();
        const values = await Guesses.readAll();
        return res.status(200).json(values);

    } else if (req.method === 'POST') {

        const today = () => new Date().getDate();

        // Competition of the month not yet started
        if (today() < OPEN_DAY) return res.status(400).json({ error: "not started yet" })

        // Competition of the month finished
        if (today() > CLOSE_DAY) {
            return res.status(400).json({ error: "finished" })
        }

        // Parse user json request 
        let json: GuessData | any = req.body;
        if (typeof json !== "object") {
            try {
                json = JSON.parse(req.body)
            } catch (e) {
                return res.status(400).json({
                    error: "unable to parse JSON"
                });
            }
        }

        const response = await axios.get(
            `https://api.nanobytepay.com/payments/${json.paymentId}`,
            {
                headers: {
                    "x-api-key": CHECKOUT_API_KEY,
                },
            }
        );

        const payment: IPaymentResponse = response.data;

        if (payment.status !== 'confirmed') {
            return res.status(400).json({
                error: 'payment not confirmed'
            });
        }

        // Validate user guess
        try {
            validateGuess(payment.metadata);
        } catch (err) {
            return res.status(400).json({
                error: err
            });
        }

        const { userNickname, userNanoAddress, userGuessPrice, amount } = payment.metadata;

        if (TunedBigNumber(amount).isLessThan(PRICE_GUESS_NANO)) {
            return res.status(402).json({ error: 'insufficient amount' });
        }

        Guesses.init();
        await Guesses.sync();

        // Save user guess to database
        Guesses.create({
            nickname: userNickname,
            address: userNanoAddress,
            price: Number(userGuessPrice),
            hash: json.paymentId
        })
            .then(resp => {
                res.status(200).json({
                    successful: true,
                    ...resp
                });
            })
            .catch(err => {
                res.status(400).json(err)
            })
    } else {
        return res.status(405).send({
            message: 'Only POST requests allowed'
        });
    }
}