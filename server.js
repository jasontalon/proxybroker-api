require("dotenv").config();

const express = require("express"),
	app = express(),
	port = process.env.PORT || 3000,
	CronJob = require("cron").CronJob,
	{ filterProxyIp } = require("./proxy"),
	{ saveProxyIp, fetchProxyIp } = require("./db"),
	filterProxyIpJob = new CronJob("0 */1 * * * *", filterProxyCommand); //runs every minute

app.set("json spaces", 2);

app.get("/", async function(req, res) {
	res.jsonp(await fetchProxyIp());
});

app.listen(port, () => {
	console.log(`listening to port ${port}`);
	filterProxyIpJob.start();
});

async function filterProxyCommand() {
	const affectedRows = await saveProxyIp(await filterProxyIp());
	console.log(`${new Date()} - ${affectedRows} rows updated.`);
}
