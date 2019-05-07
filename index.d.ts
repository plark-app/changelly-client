declare type ChangellyResponse<T = any> = {
    jsonrpc: '2.0';
    id: string;
    result: T;
};


declare type CreateTransactionOption = {
    from: string;
    to: string;
    address: string;
    amount: number;

    extraId?: string | number;
};


declare type Transaction = {};

declare interface ChangellyClient {
    (apiKey: string, apiSecret: string): ChangellyClient;
}

declare module 'changelly-client' {
    export = ChangellyClient;
}
