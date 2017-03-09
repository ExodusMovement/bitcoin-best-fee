'use strict'
const test = require('tape')

const proxyquire = require('proxyquire')

const createMock = require('../helpers/createMock.js')

// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')

test('Fees are refeshed', t => {
  let called = 0
  const bestFee = proxyquire('../..', {
    'bitcoin-fee': createMock(() => Promise.resolve(150 + (called++)))
  })

  const timeout = setTimeout(() => t.end('timeout'), 2.25 * 60 * 1000)

  bestFee.fetchHigh()
  .then(fee => t.is(fee, 150, 'Initial fee is correct'))
  .catch(t.end)

  setTimeout(() => {
    bestFee.fetchHigh()
    .then(fee => {
      t.is(fee, 151, 'Fee is updated after two minutes')
      clearTimeout(timeout)
      t.end()
    })
    .catch(t.end)
  }, 2 * 60 * 1000)
})
