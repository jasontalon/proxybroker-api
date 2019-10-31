require("dotenv").config();

const { findProxy } = require("./proxy.find");

describe("proxy", () => {
	it("should get proxy ips", async () => {
		const proxyIps = await findProxy();
		expect(proxyIps.length).toBeGreaterThan(0);
		console.log(proxyIps);
	}, 60000);
});
