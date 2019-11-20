require("dotenv").config();
const pingSites = require("./ping");

describe("test ping", () => {
  it.only.each([
    ["", 4, true],
  /*  ["198.199.120.189:3128", 4, true],
    ["35.235.75.244:3128", 4, true]*/
  ])(
    "should use proxy %s then ping %s sites",
    async (proxy, siteCount, shouldExpect) => {
      const results = await pingSites( proxy);

      expect(results).toEqual(expect.anything());
      console.log(results);
    },
    120000
  );
});
