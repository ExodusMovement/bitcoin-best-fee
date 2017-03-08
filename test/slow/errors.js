'use strict'
const test = require('tape')

const proxyquire = require('proxyquire')

// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')
const bestFee = proxyquire('../..', {
  'bitcoin-fee': {
    SERVICES: ['a', 'b'],
    fetchFee () {
      return Promise.reject(new Error('Test Error'))
    }
  }
})

test('can error out', t => {
  const timeout = setTimeout(() => t.end('timeout'), 35 * 1000)

  bestFee.fetchHigh()
  .then(() => {
    clearTimeout(timeout)
    t.end('Promise should not resolve')
  })
  .catch(e => {
    t.assert(e, 'error')
    clearTimeout(timeout)
    t.end()
  })
})
