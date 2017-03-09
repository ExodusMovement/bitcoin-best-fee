# bitcoin-best-fee

`bitcoin-best-fee` aggregates the recommended Bitcoin fees from a variety of endpoints.

## Install

    npm install bitcoin-best-fee

## Usage

```js
const bestFee = require('bitcoin-best-fee')
```

All methods return a Promise that resolves to the fee in satoshi/byte as a Number.

### `bestFee.fetchHigh()`

Fetch the highest fee from any of the endpoints.

Example:

```js
bestFee.fetchHigh()
.then(fee => console.log(fee))
// -> 240
```

### `bestFee.fetchLow()`

Fetch the lowest fee from any of the endpoints.

### `bestFee.fetchMean()`

Fetch the mean average fee from all the endpoints.

### `bestFee.fetchMedian()`

Fetch the median average fee from all the endpoints.

## Tests

Run `npm test` to run the linter and basic test suite.

Run `npm run test-slow` to run additional slow tests. The slow tests are contained in `test/slow/`. _Warning: This takes 2-3m to run; be patient._

## License

MIT
