require("dotenv").config();

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 8080,
  PROXY_TARGET_COUNTRIES = process.env.PROXY_TARGET_COUNTRIES || "US",
  routes = require("./routes"),
  Queue = require("promise-queue"),
  { CronJob } = require("cron"),
  proxy = require("./modules/proxy"),
  { pingThenInspectIp } = require("./services/proxy"),
  db = require("./modules/db"),
  queue = new Queue(1, 100),
  moment = require("moment"),
  _ = require("lodash");

db.createDbIfNotExists();

app.set("json spaces", 2);
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
  const findGoodProxyJob = new CronJob("0 */1 * * * *", findGoodProxyTask);
  const deleteOldProxyJob = new CronJob("0 */60 * * * *", deleteOldProxyTask);
  findGoodProxyJob.start();
  deleteOldProxyJob.start();
});

async function deleteOldProxyTask() {}

async function findGoodProxyTask() {
  const proxies = await proxy.findProxy({ countries: PROXY_TARGET_COUNTRIES });

  proxies
    .map(proxy => `${proxy.ip}:${proxy.port}`)
    .forEach(addProxyInspectionToQueue);

  console.log(
    `${moment().toISOString()} ${
      proxies.length
    } proxies placed on queue for processing.`
  );
}

async function addProxyInspectionToQueue(proxy) {
  queue.add(async () => {
    const proxyDetails = await pingThenInspectIp(proxy);

    const { errorCount, blockedByCloudflare } = proxyDetails.findings;

    if (errorCount == 0 && !blockedByCloudflare) {
      await db.add(proxy, JSON.stringify(proxyDetails));
      console.log(`${moment().toISOString()} ${proxy} added`);
    }
  });
}
