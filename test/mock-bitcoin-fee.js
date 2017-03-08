'use strict'
const test = require('tape')

const proxyquire = require('proxyquire')

const createMock = require('./helpers/createMock.js')

// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')

test('calculations are correct', t => {
  t.plan(4)

  const bestFee = proxyquire('..', {
    'bitcoin-fee': createMock(150, 200, 225)
  })

  Promise.all([
    bestFee.fetchHigh().then(fee => t.is(fee, 225, 'fetchHigh() is correct')),
    bestFee.fetchLow().then(fee => t.is(fee, 150, 'fetchLow() is correct')),
    bestFee.fetchMedian().then(fee => t.is(fee, 200, 'fetchMedian() is correct')),
    bestFee.fetchMean().then(fee => t.is(fee, (150 + 200 + 225) / 3, 'fetchMean() is correct'))
  ])
  .then(() => t.end())
  .catch(t.end)
})

test('works if a service is down', t => {
  t.plan(2)

  const bestFee = proxyquire('..', {
    'bitcoin-fee': createMock(150, () => Promise.reject(new Error('test error')))
  })

  Promise.all([
    bestFee.fetchHigh().then(fee => t.is(fee, 150, 'fetchHigh() works')),
    bestFee.fetchLow().then(fee => t.is(fee, 150, 'fetchLow() works'))
  ])
  .then(() => t.end())
  .catch(t.end)
})

test('works if a service is unresponsive', t => {
  t.plan(2)

  const bestFee = proxyquire('..', {
    'bitcoin-fee': createMock(150, () => new Promise(() => {}))
  })

  Promise.all([
    bestFee.fetchHigh().then(fee => t.is(fee, 150, 'fetchHigh() works')),
    bestFee.fetchLow().then(fee => t.is(fee, 150, 'fetchLow() works'))
  ])
  .then(() => t.end())
  .catch(t.end)
})

test('filters out results that are zero', t => {
  t.plan(1)
  const bestFee = proxyquire('..', {
    'bitcoin-fee': createMock(150, 0)
  })

  bestFee.fetchLow()
  .then(fee => {
    t.is(fee, 150, 'fetchLow() does not return zero')
    t.end()
  })
  .catch(t.end)
})

test('slow responding services', t => {
  t.plan(1)
  const bestFee = proxyquire('..', {
    'bitcoin-fee': createMock(() => timeoutP(10 * 1000).then(() => 200), 150)
  })

  bestFee.fetchLow()
  .then(fee => {
    t.is(fee, 150, 'returns the fastest service')
    t.end()
  })
  .catch(t.end)
})

function timeoutP (ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms).unref())
}
