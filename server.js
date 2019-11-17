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
  queue = new Queue(2, 100);

db.createDbIfNotExists();

app.set("json spaces", 2);
app.use(express.json());

routes(app);

app.listen(PORT || 8080, () => {
  console.log(`listening to port ${PORT}`);
  const findProxyJob = new CronJob("0 */5 * * * *", findProxyTask);

  findProxyJob.start();
});

async function findProxyTask() {
  const proxies = await proxy.findProxy({ countries: PROXY_TARGET_COUNTRIES });

  proxies
    .map(proxy => `${proxy.ip}:${proxy.port}`)
    .forEach(addProxyInspectionToQueue);
}

async function addProxyInspectionToQueue(proxy) {
  queue.add(async () => {
    const proxyDetails = await pingThenInspectIp({
      proxy,
      siteCount: 2
    });

    await db.add(proxy, JSON.stringify(proxyDetails));
  });
}
