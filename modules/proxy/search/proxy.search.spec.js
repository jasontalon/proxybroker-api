const search = require("./proxy.search");

describe("proxy", () => {
  it("should get proxy ips", async () => {
    const proxyIps = await search({ limit: 10, countries: "US CA" });
    expect(proxyIps.length).toBeGreaterThan(0);
    console.log(proxyIps);
  }, 60000);
});
