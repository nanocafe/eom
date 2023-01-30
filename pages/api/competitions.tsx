import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
 
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // Count number of guesses from each month
    // TODO: Should be improved with a better query,
    // like grouping by month and year, then returning only the count
    const guesses = await prisma.guess.findMany({
        where: {
            createdAt: {
                gte: new Date('2021-01-01T00:00:00.000Z'),
            },
        },
        select: {
            createdAt: true,
        },
    })

    const numberOfGuessesByYearAndMonth = guesses.reduce((acc: Record<string, Record<string, number>>, guess: { createdAt: Date }) => {
        const year = guess.createdAt.getFullYear()
        const month = guess.createdAt.getMonth() + 1

        if (!acc[year]) {
            acc[year] = {}
        }

        if (!acc[year][month]) {
            acc[year][month] = 0
        }

        acc[year][month] += 1

        return acc

    }, {} as Record<number, Record<number, number>>)


    return res.status(200).json(numberOfGuessesByYearAndMonth)
}
