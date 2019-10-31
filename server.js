const express = require("express"),
	app = express(),
	port = process.env.PORT || 8080,
	proxyGetLimit = process.env.PROXY_GET_LIMIT || 15,
	proxyTargetCountries = process.env.PROXY_COUNTRIES || "US",
	CronJob = require("cron").CronJob,
	{ findProxy } = require("./proxy.find"),
	findProxyJob = new CronJob("0 */1 * * * *", findProxyCommand), //runs every minute
	util = require("util");

app.set("json spaces", 2);

let lastRefreshAt = "",
	proxies = [];

app.get("/", async function(req, res) {
	res.jsonp({ lastRunAt: lastRefreshAt, proxies });
});

app.get("/refresh", async function(req, res) {
	try {
		await findProxyCommand();
		res.jsonp({ lastRunAt: lastRefreshAt, proxies });
	} catch (error) {
		res.status(500).send({ error: util.inspect(error) });
	}
});

app.listen(port, () => {
	console.log(`listening to port ${port}`);
	findProxyJob.start();
});

async function findProxyCommand() {
	proxies = await findProxy(proxyTargetCountries, proxyGetLimit);
	lastRefreshAt = new Date();
}
