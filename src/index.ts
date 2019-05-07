/// <reference path="../index.d.ts" />

import crypto from 'crypto';
import Axios, { AxiosInstance } from 'axios';

const API_URL = 'https://api.changelly.com';
const SOCKET_URL = 'https://socket.changelly.com';

export default class ChangellyClient {

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
        const message = {
            method: method,
            jsonrpc: '2.0',
            params: params,
            id: id,
        };

        const sign = this._sign(message);

        const { data } = await this.client.request<ChangellyResponse<T>>({
            method: 'POST',
            data: message,
            headers: { sign: sign },
        });

        return data;
    }


    public async getCurrencies(): Promise<string[]> {
        const data = await this.sendRequest<string[]>('getCurrencies', {});

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


    public async createTransaction(option: CreateTransactionOption): Promise<Transaction> {
        const data = await this.sendRequest<string>('createTransaction', {
            from: option.from.toLocaleLowerCase(),
            to: option.to.toLocaleLowerCase(),
            address: option.address,
            amount: option.amount,
            extraId: option.extraId,
        });

        return data.result;
    }


    protected _id(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
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