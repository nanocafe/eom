import { convert, Unit } from 'nanocurrency';
import { DEFAULT_CLOSE_DAY, DEFAULT_OPEN_DAY, DEFAULT_PRICE_GUESS_NANO } from "core/constants";

export const OPEN_DAY = Number(process.env.NEXT_PUBLIC_OPEN_DAY || DEFAULT_OPEN_DAY);

export const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);

export const PRICE_GUESS_NANO = convert(process.env.NEXT_PUBLIC_PRICE_GUESS_NANO || DEFAULT_PRICE_GUESS_NANO, { from: Unit.NANO, to: Unit.raw });

export const CHECKOUT_API_KEY = process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '';

export const CMC_API_KEY = process.env.CMC_API_KEY || '';

export const PRICE_CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const XNO_CURRENCY_ID = 1567;

export const CONVERT_SYMBOL = "USD";