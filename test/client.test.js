import ChangellyClient from '../';
import assert from 'assert';

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const HOST = process.env.HOST;


const txOption = {
    from: 'btc',
    to: 'ltc',
    amount: 2.14,
    address: 'Lapj4BwSx5bTCD3R8L4J3MAxUsFP2s4VGe',
};


describe('Can create Client', () => {
    let client;
    before(() => {
        if (!API_KEY || !API_SECRET) {
            throw new Error('Need to implement API key and API secret for use Changelly Client tests');
        }

        client = new ChangellyClient(API_KEY, API_SECRET, HOST);
    });


    it('Can get Currencies List', async () => {
        const list = await client.getCurrencies();

        assert.ok(Array.isArray(list), 'Currency list is not Array');
        assert.ok(list.length > 0, 'List does not contain any currencies');
    });


    it('Can get Currencies Full List', async () => {
        const list = await client.getCurrenciesFull();

        assert.ok(Array.isArray(list), 'Currency Full list is not Array');
        assert.ok(list.length > 0, 'List does not contain any currencies');
    });


    it('Can get Min Amount', async () => {
        const minAmount = await client.getMinAmount('btc', 'ltc');

        assert.strictEqual(typeof minAmount, 'number');
        assert.ok(minAmount > 0);
    });


    it('Can get Exchange Amount', async () => {
        const amount = await client.getExchangeAmount('btc', 'ltc', 2);

        assert.strictEqual(typeof amount, 'number');
        assert.ok(amount > 0);
    });

    let lastGeneratedTx = undefined;
    it('Can create Transaction', async () => {
        const transaction = await client.createTransaction(txOption);

        assert.strictEqual(transaction.currencyFrom, txOption.from);
        assert.strictEqual(transaction.currencyTo, txOption.to);
        assert.strictEqual(transaction.amountExpectedFrom, txOption.amount);
        assert.strictEqual(typeof transaction.amountExpectedTo, 'number');
        assert.strictEqual(transaction.status, 'new');
        assert.strictEqual(transaction.payoutAddress, txOption.address);

        lastGeneratedTx = transaction;
    });


    it('Can get Transactions', async () => {

        if (!lastGeneratedTx) {
            throw new Error('Need transaction to check.');
        }

        const transactions = await client.getTransactions({
            currency: txOption.from,
            address: lastGeneratedTx.payinAddress,
        });

        assert.ok(Array.isArray(transactions), 'Transaction list is not Array');
        assert.ok(transactions.length > 0, 'No transactions list is not Array');

        const tx = transactions[0];

        assert.strictEqual(tx.currencyFrom, lastGeneratedTx.currencyFrom);
        assert.strictEqual(tx.currencyTo, lastGeneratedTx.currencyTo);
        assert.strictEqual(tx.payinAddress, lastGeneratedTx.payinAddress);
    });


    it('Can get Status', async () => {
    });
});
