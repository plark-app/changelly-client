export namespace changelly {
    export type Request<P = any> = {
        jsonrpc: '2.0';
        id: string;
        method: string;
        params: P;
    }

    export type Response<T = any> = {
        jsonrpc: '2.0';
        id: string;
        result: T;
        message?: string;
    };

    export type Error = {
        jsonrpc: '2.0';
        result: false;
        error: {
            code: number;
            message: string;
        }
    };

    export type TransactionStatus
        = 'new'
        | 'waiting'
        | 'confirming'
        | 'exchanging'
        | 'sending'
        | 'finished'
        | 'failed'
        | 'refunded'
        | 'overdue'
        | 'hold'
        | 'expired';

    export type CurrencyFull = {
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

    export type CreateTransactionOption = {
        from: string;
        to: string;
        amount: number;

        address: string;
        extraId?: string | number;

        refundAddress?: string;
        refundExtraId?: string | number;
    };

    export type FindTransactionOption = {
        currency?: string;
        address?: string;
        extraId?: string;
        limit?: number;
        offset?: number;
    };

    export type Transaction = {
        id: string;
        apiExtraFee: string;
        changellyFee: string;
        payinExtraId?: string | number;
        payoutExtraId?: string | number;
        refundAddress?: string;
        refundExtraId?: string | number,
        amountExpectedFrom: number;
        amountExpectedTo: number
        status: TransactionStatus;
        currencyFrom: string;
        currencyTo: string;
        amountTo: number;
        payinAddress: string;
        payoutAddress: string;
        createdAt: string;

        kycRequired: boolean;
    };

    export type FixedRate = {};

    export type ExchangeAmount = {
        // currency to exchange from
        from: string;
        // currency to exchange for
        to: string;
        // commission that is taken by the network from the amount sent to the user
        networkFee: string;
        // amount of currency you are going to send
        amount: string;
        // includes exchange fee
        result: string;
        // the amount before any fees are deducted
        visibleAmount: string;
        // current rate of exchange
        rate: string;
        // exchange fee
        fee: string;
    };


    export type ExtendedTransaction = {
        id: string;
        createdAt: number;
        payinConfirmations: number;
        status: TransactionStatus;
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
}

declare class ChangellyClient {
    constructor(apiKey: string, apiSecret: string, host?: string);

    public getCurrencies(): Promise<string[]>;

    public getCurrenciesFull(): Promise<any[]>;

    public getMinAmount(from: string, to: string): Promise<number>;

    public validateAddress(currency: string, address: string): Promise<boolean>;

    public getExchangeAmount(from: string, to: string, amount: number): Promise<number>;

    public getBulkExchangeAmount(
        list: Array<{ from: string, to: string, amount: number }>,
    ): Promise<changelly.ExchangeAmount[]>;

    public createTransaction(option: changelly.CreateTransactionOption): Promise<changelly.Transaction>;

    public getTransactions(option: Partial<changelly.FindTransactionOption>): Promise<changelly.ExtendedTransaction[]>;

    public getStatus(transactionId: string): Promise<changelly.TransactionStatus>;
}

export default ChangellyClient;
