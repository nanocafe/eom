import { COIN_ID, CONVERT_SYMBOL, isLocked } from "config/config";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getRangePrice } from "services/coingecko";
import { GuessComplete } from "types/guess";
import crypto from "crypto";
import Papa from 'papaparse';

const allowedSortBy = ['position', 'createdAt', 'price', 'nickname'];
const allowedOrderBy = ['asc', 'desc'];

export default async function (req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== 'GET') {
            return res.status(405).json({
                message: 'Method not allowed'
            });
        }

        const year = Number(req.query.year);
        const month = Number(req.query.month);

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

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({
                message: 'invalid year or month'
            });
        }

        const startDate = new Date(new Date().setUTCFullYear(year, month - 1, 1)).setUTCHours(0, 0, 0, 0);

        // Todo: remove this line and uncomment the next one
        const endofMonth = new Date(new Date().setUTCFullYear(year, month - 1, 28)).setUTCHours(23, 59, 59, 999);
        // const endofMonth = new Date(new Date().setUTCFullYear(year, month, 0)).setUTCHours(23, 59, 59, 999);

        if (Date.now() < startDate) {
            return res.status(400).json({
                message: 'this competition has not started yet'
            });
        }

        if (Date.now() < endofMonth) {
            return res.status(400).json({
                message: 'this competition has not ended yet'
            });
        }

        const dateFilter = {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endofMonth)
            }
        }

        /*
            Get the price at the end of the month
            We cannot get the latest price from a specific time (hh:mm:ss)
            So we get the prices of the last 12 hours of the month and use the last one
        */
        const endDateSafeInitialRange = new Date(endofMonth).setUTCHours(12, 0, 0, 0);
        const prices = await getRangePrice(COIN_ID, CONVERT_SYMBOL, endDateSafeInitialRange, endofMonth);
        const lastPrice = prices[prices.length - 1];

        // Get all guesses from the snapshot month
        const guesses = await prisma.guess.findMany({
            where: dateFilter,
            orderBy: {
                createdAt: 'asc'
            },
        });

        if (guesses.length === 0) {
            return res.status(404).json({
                message: 'no guesses found'
            });
        }

        const csv = Papa.unparse(guesses);

        const response = {
            total: guesses.length,
            values: [] as GuessComplete[],
            winner: null as number | null,
            checksum: {
                csv: {
                    sha256: crypto.createHash('sha256').update(csv).digest('hex'),
                    md5: crypto.createHash('md5').update(csv).digest('hex')
                }
            },
            download: {
                csv: `/api/snapshots/${year}/${month}/download/csv`,
            }
        }

        //  Add position to each guess and sort by position
        response.values = guesses.map((guess: any, index: number) => {
            const diff = Math.abs(guess.price - lastPrice);
            return {
                ...guess,
                position: index,
                diff
            }
        })
            .sort((a: any, b: any) => a.diff - b.diff)
            .map((guess: GuessComplete, index: number) => {
                return {
                    ...guess,
                    position: index + 1
                }
            });

        // Add winner only if the competition is locked
        if (isLocked()) {
            response.winner = response.values[0].id;
        }

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
            ...response,
            values: response.values.slice((page - 1) * limit, page * limit),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
}


