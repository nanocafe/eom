export interface GuessData {
    nickname: string;
    address: string;
    price: number;
    hash: string;
}

export interface GuessComplete extends GuessData {
    id: number;
    position: number;
    createdAt: Date;
}