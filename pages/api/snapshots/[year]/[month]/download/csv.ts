import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import Papa from 'papaparse'

export default async function (req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const year = Number(req.query.year)
    const month = Number(req.query.month)

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'invalid year or month' })
    }

    const startDate = new Date(new Date().setUTCFullYear(year, month - 1, 1)).setUTCHours(0, 0, 0, 0)
    const endofMonth = new Date(new Date().setUTCFullYear(year, month, 0)).setUTCHours(23, 59, 59, 999)


    const guesses = await prisma.guess.findMany({
        where: {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endofMonth)
            }
        },
        orderBy: {
            createdAt: 'asc'
        },
    })

    const csv = Papa.unparse(guesses)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=eom-guesses-snapshot-${year}-${month}.csv`)
    return res.status(200).send(csv)
}

