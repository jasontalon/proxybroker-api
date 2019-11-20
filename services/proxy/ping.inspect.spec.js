require("dotenv").config();

const inspector = require("./ping.inspect");
describe("ping inspect", () => {
  it("should test ping.inspect", async () => {
    const proxy = "";

    const result = await inspector.pingThenInspectIp(proxy);

    expect(result).toEqual(expect.anything());
  }, 80000);
});
