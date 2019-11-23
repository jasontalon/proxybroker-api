require("dotenv").config();

const inspector = require("./proxy.inspect"),
  proxybroker = require("../../modules/proxy/search"),
  moment = require("moment"),
  { getDuration } = require("../../util");

describe("proxy inspector", () => {
  it.only("inspect proxies", async () => {
    const proxies = await proxybroker({ countries: "US", limit: 1 }),
      items = [];

    for (let i = 0; i < proxies.length; i++) {
      const proxy = proxies[i],
        start = moment(),
        { results } = await inspector(`${proxy.ip}:${proxy.port}`)
          .then(p => p.lookupIp())
          .then(p => p.pingSites(["https://cloudflare.com"]))
          .then(p => p.evaluate());

      items.push(results);
      console.log({ duration: getDuration(start), ...results });
    }

    const goodProxies = items.filter(
      p => p.evaluation.errors.length == 0 && !p.evaluation.blocked
    );

    expect(items).toEqual(expect.anything());
  }, 150000);
});
