import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { validateGuess } from "utils/validate";
import { TunedBigNumber } from "utils/nano";
import { IPaymentResponse } from "types/checkout";
import { GuessData } from "types/guess";
import prisma from "lib/prisma";
import { CHECKOUT_API_KEY, CLOSE_DAY, OPEN_DAY, PRICE_GUESS_NANO } from "config/config";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    try {

        const startDate = new Date(new Date().setUTCDate(OPEN_DAY)).setUTCHours(0, 0, 0, 0);
        const endDate = new Date(new Date().setUTCDate(CLOSE_DAY)).setUTCHours(23, 59, 59, 999);

        const thisMonth = {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }

        if (req.method === 'GET') {

            // Get all guesses from the current month
            const values = await prisma.guess.findMany({
                where: {
                    ...thisMonth
                }
            });

            return res.status(200).json(values);

        } else if (req.method === 'POST') {

            const today = () => new Date().getDate();

            // Competition of the month not yet started
            if (today() < OPEN_DAY) return res.status(400).json({ error: "not started yet" })

            // Competition of the month finished
            if (today() >= CLOSE_DAY + 1) {
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

            // Ensure nikcname is not registered for this month competition
            const nicknameExists = await prisma.guess.findFirst({
                where: {
                    nickname,
                    ...thisMonth
                }
            });

            if (nicknameExists) {
                return res.status(400).json({
                    error: 'nickname already exists'
                });
            }

            // Ensure address is not registered for this month competition
            const addressExists = await prisma.guess.findFirst({
                where: {
                    address,
                    ...thisMonth
                }
            });

            if (addressExists) {
                return res.status(400).json({
                    error: 'address already exists'
                });
            }

            // Ensure price is not registered for this month competition
            const priceExists = await prisma.guess.findFirst({
                where: {
                    price: Number(price),
                    ...thisMonth
                }
            });

            if (priceExists) {
                return res.status(400).json({
                    error: 'price already exists'
                });
            }

            // Get user IP
            const ip = req.headers['x-forwarded-for'];
            if (typeof ip !== 'string') {
                return res.status(400).json({
                    error: 'ip not found'
                });
            }

            const ipData = await prisma.iPs.findFirst({
                where: {
                    ip
                }
            });

            // Ensure the ip data exists
            if (ipData) {
                // Ensure IP is not registered for this month competition
                if (!!ipData.lastGuessAt && ipData.lastGuessAt >= new Date(startDate)) {
                    return res.status(400).json({
                        error: 'ip already exists'
                    });
                }
            } else {
                return res.status(400).json({
                    error: 'ip not found'
                });
            }

            // Update IP last guess date
            await prisma.iPs.update({
                where: {
                    ip
                },
                data: {
                    lastGuessAt: new Date()
                }
            });

            // Save user guess to database
            const resp = await prisma.guess.create({
                data: {
                    nickname,
                    address: address.replace("xrb_", "nano_"),
                    price: Number(price),
                    hash: payment.metadata.paymentHash,
                }
            })

            return res.status(200).json({
                success: true,
                ...resp
            });

        } else {
            return res.status(405).send({
                message: 'Only POST requests allowed'
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err
        });
    }
}