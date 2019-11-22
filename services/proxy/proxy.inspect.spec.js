require("dotenv").config();

const inspector = require("./proxy.inspect"),
  proxybroker = require("../../modules/proxy/search"),
  moment = require("moment"),
  { getDuration } = require("../../util");

describe("proxy inspector", () => {
  it.only("inspect proxies", async () => {
    const proxies = await proxybroker({ countries: "US", limit: 15 }),
      items = [];

    for (let i = 0; i < proxies.length; i++) {
      const proxy = proxies[i];
      const start = moment();
      const { results } = await (
        await (
          await inspector(`${proxy.ip}:${proxy.port}`).lookupIp()
        ).pingSites(["https://cloudflare.com/"])
      ).evaluate();
      items.push(results);
      console.log({ duration: getDuration(start), ...results });
    }
    const goodProxies = items.filter(
      p => p.evaluation.errors.length == 0 && !p.evaluation.blocked
    );
    expect(items).toEqual(expect.anything());
    debugger;
  }, 150000);
});
