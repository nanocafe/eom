import axios from "axios";
import cache from "memory-cache";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function getPrice(currencyId: string | number, convertSymbol: string) {
    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${currencyId}&convert=${convertSymbol}`;
        const cachedResponse = cache.get(url);
        if (cachedResponse) {
            return cachedResponse;
        } else {
            const response = await axios.get(
                url,
                {
                    headers: {
                        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
                        "Accept": "application/json",
                    },
                }
            );
            const data = response.data.data[currencyId].quote[convertSymbol];
            cache.put(url, data, CACHE_TIME);
            return data;
        }
}

