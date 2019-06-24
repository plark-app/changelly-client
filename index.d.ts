export type ChangellyRequest<P = any> = {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params: P;
}

export type ChangellyResponse<T = any> = {
    jsonrpc: '2.0';
    id: string;
    result: T;
    message?: string;
};


export type ChangellyError = {
    jsonrpc: '2.0';
    result: false;
    error: {
        code: number;
        message: string;
    }
};


export type ChangellyTransactionStatus
    = 'new'
    | 'waiting'
    | 'confirming'
    | 'exchanging'
    | 'sending'
    | 'finished'
    | 'failed'
    | 'refunded'
    | 'overdue'
    | 'hold';


export type ChangellyCurrencyFull = {
    name: string;
    ticker: string;
    fullName: string;
    enabled: boolean;
    fixRateEnabled: boolean;
    payinConfirmations: number;
    extraIdName: string;
    addressUrl: string;
    transactionUrl: string;
    image: string;
    fixedTime: number;
};


export type ChangellyCreateTransactionOption = {
    from: string;
    to: string;
    amount: number;

    address: string;
    extraId?: string | number;

    refundAddress?: string;
    refundExtraId?: string | number;
};


export type ChangellyFindTransactionOption = {
    currency?: string;
    address?: string;
    extraId?: string;
    limit?: number;
    offset?: number;
};


export type ChangellyTransaction = {
    id: string;
    apiExtraFee: string;
    changellyFee: string;
    payinExtraId?: string | number;
    payoutExtraId?: string | number;
    refundAddress?: string;
    refundExtraId?: string | number,
    amountExpectedFrom: number;
    amountExpectedTo: number
    status: ChangellyTransactionStatus;
    currencyFrom: string;
    currencyTo: string;
    amountTo: number;
    payinAddress: string;
    payoutAddress: string;
    createdAt: string;

    kycRequired: boolean;
};


export type ChangellyExtendedTransaction = {
    id: string;
    createdAt: number;
    payinConfirmations: number;
    status: ChangellyTransactionStatus;
    currencyFrom: string;
    currencyTo: string;
    payinAddress: string;
    payinExtraId?: string | number;
    amountExpectedFrom: number;
    amountExpectedTo: number;
    payoutAddress: string;
    payoutExtraId: string | number;
    amountFrom: string;
    amountTo: string;
    networkFee?: string;
    changellyFee: string;
    apiExtraFee: string;

    kycRequired: boolean;

    moneyReceived: number;
    moneySent: number;

    payinHash?: string;
    payoutHash?: string;
    refundHash?: string;
};


declare class ChangellyClient {
    constructor(apiKey: string, apiSecret: string);

    public getCurrencies(): Promise<string[]>;

    public getCurrenciesFull(): Promise<any[]>;

    public getMinAmount(from: string, to: string): Promise<number>;

    public validateAddress(currency: string, address: string): Promise<boolean>;

    public getExchangeAmount(from: string, to: string, amount: number): Promise<number>;

    public createTransaction(option: ChangellyCreateTransactionOption): Promise<ChangellyTransaction>;

    public getTransactions(option: Partial<ChangellyFindTransactionOption>): Promise<ChangellyExtendedTransaction[]>;

    public getStatus(transactionId: string): Promise<ChangellyTransactionStatus>;
}

export default ChangellyClient;
