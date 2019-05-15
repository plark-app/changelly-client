import crypto from 'crypto';
import Axios, { AxiosInstance } from 'axios';

import ChangellyClientInterface, {
    ChangellyRequest,
    ChangellyResponse,
    ChangellyError,
    ChangellyFindTransactionOption,
    ChangellyTransaction,
    ChangellyExtendedTransaction,
    ChangellyCreateTransactionOption,
    ChangellyTransactionStatus,
} from '../index';

const API_URL = 'https://api.changelly.com';
const SOCKET_URL = 'https://socket.changelly.com';

export default class ChangellyClient implements ChangellyClientInterface {
    protected readonly apiKey: string;
    protected readonly apiSecret: string;

    protected readonly client: AxiosInstance;

    public constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        this.client = Axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.apiKey,
            },
        });
    }


    public async sendRequest<T = any>(method: string, params: any = {}): Promise<ChangellyResponse<T>> {
        const id = this._id();
        const message: ChangellyRequest = {
            method: method,
            jsonrpc: '2.0',
            params: params,
            id: id,
        };

        const sign = this._sign(message);

        const { data } = await this.client.request<ChangellyResponse<T> | ChangellyError>({
            method: 'POST',
            data: message,
            headers: { sign: sign },
        });

        if ('error' in data) {
            throw new Error(data.error.message);
        }

        return data as ChangellyResponse<T>;
    }


    public async getCurrencies(): Promise<string[]> {
        const data = await this.sendRequest<string[]>('getCurrencies', {});

        return data.result;
    }


    public async getCurrenciesFull(): Promise<any[]> {
        const data = await this.sendRequest<string[]>('getCurrenciesFull', {});

        return data.result;
    }


    public async validateAddress(currency: string, address: string): Promise<boolean> {
        const data = await this.sendRequest<boolean>('validateAddress', {
            currency: currency,
            address: address,
        });

        return data.result;
    }


    public async getMinAmount(from: string, to: string): Promise<number> {
        const data = await this.sendRequest<string>('getMinAmount', {
            from: from.toLocaleLowerCase(),
            to: to.toLocaleLowerCase(),
        });

        return parseFloat(data.result);
    }


    public async getExchangeAmount(from: string, to: string, amount: number): Promise<number> {
        const data = await this.sendRequest<string>('getExchangeAmount', {
            from: from.toLocaleLowerCase(),
            to: to.toLocaleLowerCase(),
            amount: '' + amount,
        });

        return parseFloat(data.result);
    }


    public async createTransaction(option: ChangellyCreateTransactionOption): Promise<ChangellyTransaction> {
        const data = await this.sendRequest<ChangellyTransaction>('createTransaction', {
            from: option.from.toLocaleLowerCase(),
            to: option.to.toLocaleLowerCase(),
            address: option.address,
            amount: option.amount,
            extraId: option.extraId,
        });

        return {
            ...data.result,
            amountExpectedTo: +data.result.amountExpectedTo,
        };
    }


    public async getTransactions(option: ChangellyFindTransactionOption): Promise<ChangellyExtendedTransaction[]> {
        const data = await this.sendRequest<ChangellyExtendedTransaction[]>('getTransactions', {
            ...option,
            currency: option.currency ? option.currency.toLocaleLowerCase() : undefined,
        });

        return data.result;
    }


    public async getStatus(transactionId: string): Promise<ChangellyTransactionStatus> {
        const data = await this.sendRequest<ChangellyTransactionStatus>('getStatus', {
            id: transactionId,
        });

        return data.result;
    }


    protected _id(): string {
        const regexp = /[xy]/g;

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regexp, (c: string) => {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }


    protected _sign(body: object): string {
        return crypto
            .createHmac('sha512', this.apiSecret)
            .update(JSON.stringify(body))
            .digest('hex');
    }
}