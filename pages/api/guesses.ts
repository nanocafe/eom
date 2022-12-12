import axios from "axios";
import { DEFAULT_CLOSE_DAY, DEFAULT_OPEN_DAY, DEFAULT_PRICE_GUESS_NANO } from "core/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { validateGuess } from "utils/validate";
import Guesses from "./db/Guesses";
import { convert, Unit } from 'nanocurrency';
import { TunedBigNumber } from "utils/nano";
import { IPaymentResponse } from "types.ts/checkout";
import { GuessData } from "types.ts/guess";
import { Op } from "sequelize";

const OPEN_DAY = Number(process.env.NEXT_PUBLIC_OPEN_DAY || DEFAULT_OPEN_DAY);
const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);
const PRICE_GUESS_NANO = convert(process.env.NEXT_PUBLIC_PRICE_GUESS_NANO || DEFAULT_PRICE_GUESS_NANO, { from: Unit.NANO, to: Unit.raw });
const CHECKOUT_API_KEY = process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '';

// Initialize database
const guesses = new Guesses();
guesses.sync();

export default async function (req: NextApiRequest, res: NextApiResponse) {

    try {
        if (req.method === 'GET') {

            const values = await guesses.readAll();
            return res.status(200).json(values);

        } else if (req.method === 'POST') {

            const today = () => new Date().getDate();

            // Competition of the month not yet started
            if (today() < OPEN_DAY) return res.status(400).json({ error: "not started yet" })

            // Competition of the month finished
            if (today() >= CLOSE_DAY) {
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

            // Get guess data from checkout metadata
            const { userNickname: nickname, userNanoAddress: address, userGuessPrice: price, amount } = payment.metadata;

            // Ensure user has paid enough
            if (TunedBigNumber(amount).isLessThan(PRICE_GUESS_NANO)) {
                return res.status(402).json({ error: 'insufficient amount' });
            }

            const startDate = new Date(new Date().setUTCDate(OPEN_DAY)).setUTCHours(0, 0, 0, 0);
            const endDate = new Date(new Date().setUTCDate(CLOSE_DAY)).setUTCHours(23, 59, 59, 999);

            // Ensure nikcname is not registered for this month competition
            const nicknameExists = await guesses.find({
                nickname,
                createdAt: {
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                }
            });
            if (nicknameExists) {
                return res.status(400).json({
                    error: 'nickname already exists'
                });
            }

            await guesses.sync();

            // Ensure address is not registered for this month competition
            const addressExists = await guesses.find({
                address,
                createdAt: {
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                }
            });
            if (addressExists) {
                return res.status(400).json({
                    error: 'address already exists'
                });
            }

            // Ensure price is not registered for this month competition
            const priceExists = await guesses.find({
                price,
                createdAt: {
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                }
            });
            if (priceExists) {
                return res.status(400).json({
                    error: 'price already exists'
                });
            }

            // Save user guess to database
            guesses.create({
                nickname,
                address,
                price: Number(price),
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
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}