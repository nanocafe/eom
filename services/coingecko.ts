import axios from "axios";
import cache from "memory-cache";
import { LATEST_PRICE_CACHE_TIME } from "config/config";

interface LatestPriceValues {
    url: string;
    usd: number;
    usd_24h_change: number;
}

export const getLatestPrice = async (coinId: string, convertTo: string, with24hChange = true): Promise<LatestPriceValues> => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId.toLowerCase()}&vs_currencies=${convertTo.toLowerCase()}&include_24hr_change=${with24hChange}`;
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        return {
            url,
            usd: cachedResponse.usd,
            usd_24h_change: cachedResponse.usd_24h_change
        };
    } else {
        const response = await axios.get(url, {
            headers: { "Accept-Encoding": "gzip,deflate,compress" }
        });
        const { usd, usd_24h_change } = response.data[coinId.toLowerCase()];
        cache.put(url, { usd, usd_24h_change }, LATEST_PRICE_CACHE_TIME);
        return {
            url, usd, usd_24h_change
        }
    }
}

interface RangePriceValues {
    url: string;
    prices: Array<Array<number>>
}

export const getRangePrice = async (coinId: string, convertTo: string, from: number, to: number): Promise<RangePriceValues> => {

    // Coingecko API expects timestamps in seconds, not milliseconds
    if (from.toString().length === 13) {
        from = Math.floor(from / 1000);
    }
    if (to.toString().length === 13) {
        to = Math.floor(to / 1000);
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=${convertTo}&from=${from}&to=${to}`;
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        return { url, prices: cachedResponse.prices };
    } else {
        console.log("Fetching range price from coingecko")
        const response = await axios.get(url, {
            headers: { "Accept-Encoding": "gzip,deflate,compress" }
        });
        const { prices } = response.data;
        cache.put(url, { prices }, 60 * 60 * 1000 * 7); // 7 days in milliseconds
        return { url, prices };
    }
}