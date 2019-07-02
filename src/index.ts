import crypto from 'crypto';
import Axios, {AxiosInstance} from 'axios';

import ChangellyClientInterface, { changelly } from '../index';

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

    public async sendRequest<T = any>(method: string, params: any = {}): Promise<changelly.Response<T>> {
        const id = this._id();
        const message: changelly.Request = {
            method: method,
            jsonrpc: '2.0',
            params: params,
            id: id,
        };

        const sign = this._sign(message);

        const {data} = await this.client.request<changelly.Response<T> | changelly.Error>({
            method: 'POST',
            data: message,
            headers: {sign: sign},
        });

        if ('error' in data) {
            throw new Error(data.error.message);
        }

        return data as changelly.Response<T>;
    }


    public async getCurrencies(): Promise<string[]> {
        const data = await this.sendRequest<string[]>('getCurrencies', {});

        return data.result;
    }


    public async getCurrenciesFull(): Promise<changelly.CurrencyFull[]> {
        const data = await this.sendRequest<changelly.CurrencyFull[]>('getCurrenciesFull', {});

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


    public async getBulkExchangeAmount(
        list: Array<{ from: string, to: string, amount: number }>
    ): Promise<changelly.ExchangeAmount[]> {
        const requestParams = list.map(opt => ({
            from: opt.from.toLocaleLowerCase(),
            to: opt.to.toLocaleLowerCase(),
            amount: '' + opt.amount,
        }));

        const data = await this.sendRequest<changelly.ExchangeAmount[]>('getExchangeAmount', requestParams);

        return data.result as changelly.ExchangeAmount[];
    }


    public async createTransaction(option: changelly.CreateTransactionOption): Promise<changelly.Transaction> {
        const data = await this.sendRequest<changelly.Transaction>('createTransaction', {
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


    public async getTransactions(option: changelly.FindTransactionOption): Promise<changelly.ExtendedTransaction[]> {
        const data = await this.sendRequest<changelly.ExtendedTransaction[]>('getTransactions', {
            ...option,
            currency: option.currency ? option.currency.toLocaleLowerCase() : undefined,
        });

        return data.result;
    }


    public async getStatus(transactionId: string): Promise<changelly.TransactionStatus> {
        const data = await this.sendRequest<changelly.TransactionStatus>('getStatus', {
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