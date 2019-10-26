require("dotenv").config();

const { saveProxyIp, fetchProxyIp } = require("./db");

describe("db", () => {
	test.each([
		[
			[
				{ ip: "1.2.3.4", port: "100", type: "HTTPS" },
				{ ip: "4.3.2.1", port: "500", type: "HTTP" },
				{ ip: "111.222.333.444", port: "5432", type: "HTTPS" }
			]
		]
	])("save proxies", async proxies => {
		const affectedRows = await saveProxyIp(proxies);
		expect(affectedRows).toBeGreaterThan(0);
	});

	test("fetch", async () => {
		const proxies = await fetchProxyIp();
		expect(proxies.length).toBeGreaterThan(0);
	});
});
