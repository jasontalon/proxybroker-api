require("dotenv").config();
const ping = require("./proxy.ping");

describe("test ping", () => {
  it.each([
    ["198.199.120.189:3128", true],
    ["35.235.75.244:3128", true]
  ])("should use proxy %s then ping %s sites", async (proxy, shouldExpect) => {
    const results = await ping({
      proxy,
      urls: ["https://www.icanhazip.com/", "https://www.socialblade.com/"]
    });

    expect(results).toEqual(expect.anything());
    console.log(results);
  });
});
