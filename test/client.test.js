import ChangellyClient from '../';
import assert from 'assert';

const API_KEY = 'test';
const API_SECRET = 'test';

describe('Can create Client', () => {
    it('Create Client', () => {
        try {
            const client = new ChangellyClient(API_KEY, API_SECRET);
        } catch (error) {
            assert.fail(error);
        }
    });

    const client = new ChangellyClient(API_KEY, API_SECRET);

    it('Get Currencies List', async () => {
        const data = await client.getCurrencies();
    });
});