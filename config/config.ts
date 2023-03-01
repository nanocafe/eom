import { convert, Unit } from 'nanocurrency';
import { DEFAULT_CLOSE_DAY, DEFAULT_OPEN_DAY, DEFAULT_NEXT_PUBLIC_ENTRY_FEE } from "core/constants";

export const OPEN_DAY = Number(process.env.NEXT_PUBLIC_OPEN_DAY || DEFAULT_OPEN_DAY);

export const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);

export const ENTRY_FEE = process.env.NEXT_PUBLIC_ENTRY_FEE || DEFAULT_NEXT_PUBLIC_ENTRY_FEE;

export const ENTRY_FEE_RAWS = convert(ENTRY_FEE, { from: Unit.NANO, to: Unit.raw });

export const CHECKOUT_API_KEY = process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '';

export const LATEST_PRICE_CACHE_TIME = 60 * 1000; // 1 minute in milliseconds

export const COIN_ID = 'nano';

export const CONVERT_SYMBOL = "usd";

export const DEADLINE = new Date(new Date().setUTCDate(CLOSE_DAY)).setUTCHours(
    23,
    59,
    59,
    999,
);

export const isLocked = () => {
    const todayDate = new Date().getUTCDate();
    return todayDate < OPEN_DAY || Date.now() > DEADLINE;
}