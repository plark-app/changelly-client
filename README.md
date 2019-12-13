# Make it possible to exchange cryptocurrency via Changelly or ChangeHero services in your application, based on JavaScript

Current library provide your with Changelly Client on JavaScript for Browser or NodeJS.

Works well with [ChangeHero](https://changehero.io) and [Changelly](https://changelly.com).

_Current library is used at [Plark Wallet](https://plark.io)_

```javascript
import ChangellyClienty from '@plark/changelly-client';

const client = new ChangellyClienty('<API KEY>', '<SECRET KEY>');
client.createTransaction({
    from: 'btc',
    to: 'ltc',
    amount: 2.14,
    address: 'Lapj4BwSx5bTCD3R8L4J3MAxUsFP2s4VGe',
}).then(
    transaction => {
        console.log(transaction); // show your transaction
    }
);
```


--- 

Make with ❤ by [Plark Team](https://plark.io)
