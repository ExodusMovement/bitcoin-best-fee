'use strict'
const test = require('tape')

const proxyquire = require('proxyquire')

// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')

let mock = {
  SERVICES: ['a', 'b', 'c'],
  fetchFee (service) {
    switch (service) {
      case 'a':
        return Promise.resolve(150)
      case 'b':
        return Promise.resolve(200)
      case 'c':
        return Promise.resolve(225)
    }
  }
}
const bestFee = proxyquire('..', {'bitcoin-fee': mock})

test('calculations are correct', t => {
  Promise.all([
    bestFee.fetchHigh().then(fee => t.is(fee, 225, 'fetchHigh() is correct')),
    bestFee.fetchLow().then(fee => t.is(fee, 150, 'fetchLow() is correct')),
    bestFee.fetchMedian().then(fee => t.is(fee, 200, 'fetchMedian() is correct')),
    bestFee.fetchMean().then(fee => t.is(fee, (150 + 200 + 225) / 3, 'fetchMean() is correct'))
  ])
  .then(() => t.end())
  .catch(t.end)
})
