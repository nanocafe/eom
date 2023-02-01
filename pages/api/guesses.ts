import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { validateGuess } from "utils/validate";
import { TunedBigNumber } from "utils/nano";
import { IPaymentResponse } from "types/checkout";
import { GuessComplete, GuessData } from "types/guess";
import prisma from "lib/prisma";
import { CHECKOUT_API_KEY, CLOSE_DAY, CONVERT_SYMBOL, OPEN_DAY, COIN_ID, isLocked, ENTRY_FEE, ENTRY_FEE_RAWS } from "config/config";
import { getLatestPrice } from "services/coingecko";

const allowedSortBy = ['position', 'createdAt', 'price', 'nickname'];
const allowedOrderBy = ['asc', 'desc'];

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

            const { page: _page = 1, limit: _limit = 10, sortBy = 'position', orderBy = 'asc' } = req.query;

            const page = Number(_page);
            const limit = Number(_limit);

            if (typeof page !== 'number' || page < 1) {
                return res.status(400).json({
                    message: 'invalid page'
                });
            }

            if (typeof limit !== 'number' || limit < 1) {
                return res.status(400).json({
                    message: 'invalid limit'
                });
            }

            if (typeof sortBy !== 'string' || !allowedSortBy.includes(sortBy)) {
                return res.status(400).json({
                    message: 'invalid sortBy'
                });
            }

            if (typeof orderBy !== 'string' || !allowedOrderBy.includes(orderBy)) {
                return res.status(400).json({
                    message: 'invalid orderBy'
                });
            }

            const { [CONVERT_SYMBOL]: price } = await getLatestPrice(COIN_ID, CONVERT_SYMBOL);

            // Get all guesses from the current month
            const allGuesses = await prisma.guess.findMany({
                where: thisMonth,
            });

            const response = {
                total: allGuesses.length,
                values: [] as GuessComplete[]
            }

            //  Add position to each guess and sort by position
            response.values = allGuesses.map((guess, index) => {
                const diff = Math.abs(guess.price - price);
                return {
                    ...guess,
                    position: index,
                    diff
                }
            })
            .sort((a, b) => a.diff - b.diff)
            .map((guess, index) => {
                return {
                    ...guess,
                    position: index + 1
                }
            });

            /* Since we need sort to add position, we should sort by the other fields manually */

            if (sortBy === 'createdAt') {
                response.values = response.values.sort((a, b) => {
                    if (a.createdAt < b.createdAt) {
                        return orderBy === 'asc' ? -1 : 1;
                    }
                    if (a.createdAt > b.createdAt) {
                        return orderBy === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }
            
            if (sortBy === 'nickname') {
                response.values = response.values.sort((a, b) => {
                    if (a.nickname < b.nickname) {
                        return orderBy === 'asc' ? -1 : 1;
                    }
                    if (a.nickname > b.nickname) {
                        return orderBy === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }

            if (sortBy === 'price') {
                response.values = response.values.sort((a, b) => {
                    if (a.price < b.price) {
                        return orderBy === 'asc' ? -1 : 1;
                    }
                    if (a.price > b.price) {
                        return orderBy === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }

            return res.status(200).json({
                total: response.values.length,
                values: response.values.slice((page - 1) * limit, page * limit)
            });

        } else if (req.method === 'POST') {

            const today = () => new Date().getDate();

            // Competition of the month not yet started
            if (today() < OPEN_DAY) return res.status(400).json({ message: "not started yet" })

            // Competition of the month finished
            if (isLocked()) {
                return res.status(400).json({ message: "competiton is finished" })
            }

            // Parse user json request 
            let json: GuessData | any = req.body;
            if (typeof json !== "object") {
                try {
                    json = JSON.parse(req.body)
                } catch (e) {
                    return res.status(400).json({
                        message: "unable to parse JSON"
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
                    message: 'payment not confirmed'
                });
            }

            // Validate user guess
            try {
                validateGuess(payment.metadata);
            } catch (err) {
                return res.status(400).json({
                    message: err
                });
            }

            // Get guess data from checkout metadata
            const { userNickname, userNanoAddress: address, userGuessPrice: price, amount } = payment.metadata;

            const nickname = userNickname.toLowerCase();

            // Ensure user has paid enough
            if (TunedBigNumber(amount).isLessThan(ENTRY_FEE_RAWS)) {
                return res.status(402).json({ message: 'insufficient amount' });
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
                    message: 'nickname already exists'
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
                    message: 'address already exists'
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
                    message: 'price already exists'
                });
            }

            // Get user IP
            const ip = req.headers['x-forwarded-for'];
            if (typeof ip !== 'string') {
                return res.status(400).json({
                    message: 'ip not found'
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
                        message: 'ip already exists'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'ip not found'
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
            message: err
        });
    }
}