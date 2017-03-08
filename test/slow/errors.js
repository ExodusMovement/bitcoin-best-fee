'use strict'
const test = require('tape')

const proxyquire = require('proxyquire')

const createMock = require('../helpers/createMock.js')

// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')

test('can error out', t => {
  const bestFee = proxyquire('../..', {
    'bitcoin-fee': createMock(() => Promise.reject(new Error('Test Error')))
  })

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
