require("dotenv").config();

const { filterProxyIp } = require("./proxy");

describe("proxy", () => {
	it("should get proxy ips", async () => {
		const proxyIps = await filterProxyIp();
		expect(proxyIps.length).toBeGreaterThan(0);
		console.log(proxyIps);
	}, 60000);
});
