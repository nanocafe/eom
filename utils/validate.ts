export const validatePrice = (price: number) => {
    if (typeof price !== 'number' || price <= 0) {
        throw ("Price must be a positive number");
    }
    if (price > 1000000) {
        throw ("Price must be less than 1,000,000");
    }
}

export const validateNickname = (nickname: string) => {
    if (typeof nickname !== 'string') {
        throw ("Nickname must be a string");
    } 
    if (nickname.length < 2) {
        throw ("Nickname must be at least 2 characters");
    }
    if (nickname.length > 20) {
        throw ("Nickname must be less than 20 characters");
    }
}