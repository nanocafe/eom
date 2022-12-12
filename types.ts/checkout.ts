export interface IPaymentMetadata {
    // Default NanoByte metadata fields
    merchantApiKey: string;
    paymentId: string;
    merchantName: string;
    amount: string;
    label: string;

    // Custom NanoCafe metadata fields
    userNickname: string;
    userNanoAddress: string;
    userGuessPrice: number;
}

export interface IPaymentResponse {
    status: string;
    metadata: IPaymentMetadata;
}