const express = require("express"),
	app = express(),
	port = process.env.PORT || 8080,
	CronJob = require("cron").CronJob,
	{ findProxy } = require("./proxy.find"),
	findProxyJob = new CronJob("0 */1 * * * *", findProxyCommand); //runs every minute

app.set("json spaces", 2);

let lastRunAt = "",
	proxies = [];

app.get("/", async function(req, res) {
	res.jsonp({ lastRunAt, proxies });
});

app.get("/refresh", async function(req, res) {
	await findProxyCommand();
	res.jsonp({ lastRunAt, proxies });
});

app.listen(port, () => {
	console.log(`listening to port ${port}`);
	findProxyJob.start();
});

async function findProxyCommand() {
	proxies = await findProxy();
	lastRunAt = new Date();
}
