module.exports = function (...args) {
  return {
    SERVICES: args.map((item, i) => i.toString()),
    fetchFee (service) {
      let res = args[Number.parseInt(service)]
      if (typeof res === 'number') return Promise.resolve(res)
      return res()
    }
  }
}
