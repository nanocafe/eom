import axios from "axios";
import cache from "memory-cache";
import { PRICE_CACHE_TIME } from "config/config";

export const getLatestPrice = async (coinId: string, convertTo: string, with24hChange = true) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId.toLowerCase()}&vs_currencies=${convertTo.toLowerCase()}&include_24hr_change=${with24hChange}`;
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        return cachedResponse;
    } else {
        const response = await axios.get(url);
        const data = response.data[coinId.toLowerCase()];
        cache.put(url, data, 1);
        return data;
    }
}

export const getRangePrice = async (coinId: string, convertTo: string, from: number, to: number) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=${convertTo}&from=${from}&to=${to}`;
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        return cachedResponse;
    } else {
        const response = await axios.get(url);
        const { prices } = response.data;
        cache.put(url, prices, 60 * 60 * 1000 * 7); // 7 days in milliseconds
        return prices;
    }
}