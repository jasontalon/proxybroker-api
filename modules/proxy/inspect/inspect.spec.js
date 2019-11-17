require("dotenv").config();
const inspect = require("./inspect");

describe("test", () => {
  it.each([
    ["198.98.54.241:8080", true],
    ["149.56.106.104:3128", true],
    ["167.71.109.52:8080", true]
  ])(
    "should inpect proxy %s",
    async (proxy, shouldExpect) => {
      const data = await inspect.inspectIp(proxy);
      if (shouldExpect) expect(data).toEqual(expect.anything());
      else expect(data).not.toEqual(expect.anything());

      console.log(data);
    },
    30000
  );

  it.each([
    ["https://icanhazip.com/", "108.160.129.219:8080", true],
    ["https://www.npmjs.com/", "108.160.129.219:8080", true],
    ["https://fb.com/", "108.160.129.219:8080", true]
  ])(
    "should inspect page %s with proxy %s",
    async (targetSite, proxy, shouldExpect) => {
      const data = await inspect.inspectPage(proxy, { targetSite });
      if (shouldExpect) expect(data).toEqual(expect.anything());
      else expect(data).not.toEqual(expect.anything());

      console.log(data);
    },
    60000
  );
});
