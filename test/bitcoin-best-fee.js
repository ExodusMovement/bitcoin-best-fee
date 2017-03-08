'use strict'
const test = require('tape')
// Polyfill fetch() for bitcoin-fee:
global.fetch = require('node-fetch')
const bestFee = require('..')

test('fetchHigh() works', t => {
  testWorks(bestFee.fetchHigh(), t)
})

test('fetchLow() works', t => {
  testWorks(bestFee.fetchLow(), t)
})

test('fetchMean() works', t => {
  testWorks(bestFee.fetchMean(), t)
})

test('fetchMedian() works', t => {
  testWorks(bestFee.fetchMedian(), t)
})

function testWorks (promise, t) {
  t.plan(1)
  promise.then(fee => {
    t.is(typeof fee, 'number', 'fee is a number')
    t.end()
  })
  .catch(t.end)
}

test('fee comparisons', t => {
  t.plan(5)
  Promise.all([
    bestFee.fetchHigh(),
    bestFee.fetchLow(),
    bestFee.fetchMedian(),
    bestFee.fetchMean()
  ])
  .then(([high, low, median, mean]) => {
    t.true(high > low, 'high > low')
    t.true(high > median, 'high > median')
    t.true(high > mean, 'high > mean')
    t.true(low < median, 'low < median')
    t.true(low < mean, 'low < mean')
    t.end()
  })
  .catch(t.end)
})
