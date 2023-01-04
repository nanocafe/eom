import axios from "axios";
import { CMC_API_KEY, PRICE_CACHE_TIME } from "config/config";
import cache from "memory-cache";

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
                        "X-CMC_PRO_API_KEY": CMC_API_KEY,
                        "Accept": "application/json",
                    },
                }
            );
            const data = response.data.data[currencyId].quote[convertSymbol];
            cache.put(url, data, PRICE_CACHE_TIME);
            return data;
        }
}

