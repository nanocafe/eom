/*
    This route allows the creation of fake guesses for use only in development,
    thus allowing to test writing and reading the table, pagination, ordering, UI display, etc.

    Example: http://localhost:3000/api/faker?minPrice=0.01&maxPrice=10&limit=10
    It will create 10 guesses with random prices between 0.01 and 10.
*/

import { NextApiRequest, NextApiResponse } from "next";
import { faker } from '@faker-js/faker';
import prisma from "lib/prisma";
import { deriveAddress, derivePublicKey, deriveSecretKey, generateSeed } from 'nanocurrency';
import { CLOSE_DAY, OPEN_DAY } from "config/config";
import { GuessData } from "types/guess";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Create fake guesses to populate the leaderboard in development/test mode
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {

        const { minPrice: _minPrice , maxPrice: _maxPrice, limit: _limit } = req.query;

        if (!_minPrice || !_maxPrice || !_limit) {
            return res.status(400).json({
                message: 'missing minPrice, maxPrice or limit'
            });
        }

        const minPrice = Number(_minPrice);
        const maxPrice = Number(_maxPrice);
        const limit = Number(_limit);

        if (isNaN(minPrice) || isNaN(maxPrice) || isNaN(limit)) {
            return res.status(400).json({
                message: 'minPrice, maxPrice and limit must be numbers'
            });
        }

        if (minPrice > maxPrice) {
            return res.status(400).json({
                message: 'minPrice must be less than maxPrice'
            });
        }

        if (minPrice < 0 || maxPrice < 0 || limit < 0) {
            return res.status(400).json({
                message: 'minPrice, maxPrice and limit must be greater than 0'
            });
        }

        const startDate = new Date(new Date().setUTCDate(OPEN_DAY)).setUTCHours(0, 0, 0, 0);
        const endDate = new Date(new Date().setUTCDate(CLOSE_DAY)).setUTCHours(23, 59, 59, 999);

        const thisMonth = {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }

        const currentGuesses = await prisma.guess.findMany({
            where: thisMonth,
        });

        const newGuesses: GuessData[] = [];

        const newRandomPrice = (): number => {
            const price = Number(faker.finance.amount(minPrice, maxPrice));
            if (currentGuesses.find((guess: any) => guess.price === price)) {
                return newRandomPrice();
            }
            if (newGuesses.find(guess => guess.price === price)) {
                return newRandomPrice();
            }
            return price;
        }

        const newRandomNickname = (): string => {
            const nickname = faker.name.firstName().toLowerCase();
            if (currentGuesses.find((guess: any) => guess.nickname === nickname)) {
                return newRandomNickname();
            }
            if (newGuesses.find(guess => guess.nickname === nickname)) {
                return newRandomNickname();
            }
            return nickname;
        }

        const seed = await generateSeed();

        for (let i = 0; i < limit; i++) {
            let secret = deriveSecretKey(seed, i);
            let publicKey = derivePublicKey(secret);
            newGuesses.push({
                nickname: newRandomNickname(),
                address: deriveAddress(publicKey, {
                    useNanoPrefix: true
                }),
                price: newRandomPrice(),
                hash: publicKey,
            });
        }

        await prisma.guess.createMany({
            data: newGuesses,
            skipDuplicates: true
        });

        return res.status(200).json(newGuesses);
    }

    return res.status(404).json({
        message: 'Not found'
    });
}


