import { convert, Unit } from 'nanocurrency';
import { DEFAULT_CLOSE_DAY, DEFAULT_OPEN_DAY, DEFAULT_PRICE_GUESS_NANO } from "core/constants";

export const OPENING_YEAR = 2023;

export const OPENING_MONTH = 1;

export const OPEN_DAY = Number(process.env.NEXT_PUBLIC_OPEN_DAY || DEFAULT_OPEN_DAY);

export const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);

export const PRICE_GUESS_NANO = convert(process.env.NEXT_PUBLIC_PRICE_GUESS_NANO || DEFAULT_PRICE_GUESS_NANO, { from: Unit.NANO, to: Unit.raw });

export const CHECKOUT_API_KEY = process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '';

export const LATEST_PRICE_CACHE_TIME = 60 * 1000; // 1 minute in milliseconds

export const COIN_ID = 'nano';

export const CONVERT_SYMBOL = "usd";