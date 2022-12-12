import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "core/constants";
import { checkAddress } from 'nanocurrency';
import { IPaymentMetadata } from "types.ts/checkout";

export const validatePrice = (price: number) => {
    if (typeof price !== 'number' || price <= 0) {
        throw ("Price must be a positive number");
    }
    if (price > 1000000) {
        throw ("Price must be less than 1,000,000 Nano");
    }
}

export const validateNickname = (nickname: string) => {
    if (typeof nickname !== 'string') {
        throw ("Nickname must be a string");
    } 
    if (nickname.length < MIN_NICKNAME_LENGTH) {
        throw ("Nickname must be at least 2 characters");
    }
    if (nickname.length > MAX_NICKNAME_LENGTH) {
        throw ("Nickname must be less than 20 characters");
    }
}

export const validateGuess = (guess: IPaymentMetadata) => {

    // Validate nickname
    if (!("userNickname" in guess)) {
        throw ("Missing nickname");
    }
    validateNickname(guess.userNickname);

    // Validate Nano address
    if (!("userNanoAddress" in guess)) {
        throw ("Missing address");
    }
    if (!checkAddress(guess.userNanoAddress)) {
        throw ("Invalid address");
    }

    // Validate price
    if (!("userGuessPrice" in guess)) {
        throw ("Missing price");
    }
    const price = Number(guess.userGuessPrice);
    if (isNaN(price)) {
        throw ("Price must be a number");
    }
    validatePrice(price);
};