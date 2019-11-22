const _ = require("lodash"),
  proxyCheck = require("../../modules/proxy"),
  moment = require("moment"),
  { getDuration, cleanErrorResponse } = require("../../util");
module.exports = function(proxy = "") {
  const inspector = {
    results: { proxy, ip: {}, pings: [], evaluation: {} },
    pingSites: async function(urls) {
      this.results.pings.push(...(await proxyCheck.ping({ proxy, urls })));
      return this;
    },
    lookupIp: async function() {
      try {
        const startTime = moment().toISOString();
        const details = await proxyCheck.inspect(proxy).ip();
        this.results.ip = {
          duration: getDuration(startTime),
          details
        };
      } catch (error) {
        this.results.ip = { error: cleanErrorResponse(error) };
      } finally {
        return this;
      }
    },
    evaluate: function() {
      const titles = _.map(this.results.pings, "title").join("||"),
        blocked = /(access denied|attention required|restrict)/gim.test(titles),
        errors = [
          this.results.ip.error,
          ..._.map(this.results.pings, "error")
        ].filter(p => p);
      this.results.evaluation = { errors, blocked };
      return this;
    }
  };
  return inspector;
};
