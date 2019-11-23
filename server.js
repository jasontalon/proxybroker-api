require("dotenv").config();

const { PORT = 8080, PROXY_TARGET_COUNTRIES = "US" } = process.env,
  { CronJob } = require("cron"),
  express = require("express"),
  app = express(),
  routes = require("./routes"),
  proxybroker = require("./modules/proxy/search"),
  { save } = require("./modules/db"),
  { inspector } = require("./services/proxy"),
  moment = require("moment");

app.set("json spaces", 2);
app.use(express.json());

routes(app);

const findGoodProxyJob = new CronJob("0 */2 6-17 * * *", findGoodProxyTask);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);  
  findGoodProxyJob.start();
});

async function findGoodProxyTask() {
  const response = await proxybroker({
    countries: PROXY_TARGET_COUNTRIES,
    limit: 10
  });

  const proxies = response.map(proxy => `${proxy.ip}:${proxy.port}`),
    sitesToPing = ["https://cloudflare.com/"];

  for (let i = 0; i < proxies.length; i++) {
    const proxy = proxies[i],
      { results } = await inspector(proxy)
        .then(i => i.lookupIp())
        .then(i => i.pingSites(sitesToPing))
        .then(i => i.evaluate());

    console.log(`[${i + 1}][${moment().format("h:mm:ss a")}] evaluate ${proxy}...`);

    const {
      evaluation: { errors, blocked }
    } = results;

    if (errors.length == 0 && !blocked) {
      await save(proxy);
      console.log(`[${i + 1}] good!`);
    } else {
      console.log(`[${i + 1}] bad`);
    }
  }
}
