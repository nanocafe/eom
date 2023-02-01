import axios from "axios";
import { isLocked } from "config/config";
import { DEFAULT_OPEN_DAY } from "core/constants";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/*
    Before save a guess, we need to validate the user ip address.
    - Ensure the ip address is not registered for this month competition
    - Ensure the user is not behind a proxy and save it's information on the database
*/

const startDate = new Date(new Date().setUTCDate(DEFAULT_OPEN_DAY)).setUTCHours(0, 0, 0, 0);

const DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

export default async function (req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== 'POST') {
            return res.status(400).json({
                success: false,
                message: 'invalid method'
            });
        }

        if (isLocked()) {
            return res.status(400).json({
                success: false,
                message: 'the competition is locked'
            });
        }

        // If running locally, skip the ip validation
        if (DEVELOPMENT_MODE) {
            // await 2 seconds to simulate the ip validation
            await new Promise(resolve => setTimeout(resolve, 5000));
            return res.status(200).json({
                success: true,
                message: 'ip validation skipped'
            });
        }

        /*
           The public IP address of the client that made the request.
           If the client is behind a proxy, Vercel behind currently overwrite the X-Forwarded-For
           header and do not forward external IPs. This restriction is in place to prevent IP spoofing.
           https://vercel.com/docs/concepts/edge-network/headers#x-forwarded-for
       */
        const ip = req.headers['x-forwarded-for'];

        // Ensure Vercel got the user ip address
        if (typeof ip !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'ip not found'
            });
        }

        const ipData = await prisma.iPs.findFirst({
            where: {
                ip
            }
        });

        if (ipData) {
            if (ipData.isProxy) {
                return res.status(400).json({
                    success: false,
                    message: 'ip is behind a proxy'
                });
            }
            if (!!ipData.lastGuessAt && ipData.lastGuessAt >= new Date(startDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'ip already exists'
                });
            }
        } else {
            // Get user ip information using ip-api.com
            const ipInfo = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,proxy`);
            if (ipInfo.status !== 200) {
                if (ipInfo.data && ipInfo.data.message) {
                    console.error('unable to get ip information', ipInfo.data.message);
                }
                return res.status(400).json({
                    success: false,
                    message: 'unable to get ip information'
                });
            }
            const { proxy } = ipInfo.data;

            if (typeof proxy !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'unable to get ip information'
                });
            }

            // Save user ip information on the database
            await prisma.iPs.create({
                data: {
                    ip,
                    isProxy: proxy,
                    lastGuessAt: null
                }
            });

            if (proxy) {
                return res.status(400).json({
                    success: false,
                    message: 'ip is behind a proxy'
                });
            }
        }

        res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error("Pre-Checkout message: ", err);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }
}