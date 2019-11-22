require("dotenv").config();

const { PORT = 8080, PROXY_TARGET_COUNTRIES = "US" } = process.env,
  { CronJob } = require("cron"),
  express = require("express"),
  app = express(),
  routes = require("./routes"),
  proxybroker = require("./modules/proxy/search"),
  { save } = require("./modules/db"),
  { inspector } = require("./services/proxy");

app.set("json spaces", 2);
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
  const findGoodProxyJob = new CronJob("0 */10 * * * *", findGoodProxyTask);
  findGoodProxyJob.start();
});

async function findGoodProxyTask() {
  console.log("find proxies...");

  const response = await proxybroker({
    countries: PROXY_TARGET_COUNTRIES,
    limit: 10
  });

  const proxies = response.map(proxy => `${proxy.ip}:${proxy.port}`),
    sitesToPing = ["https://cloudflare.com/"];

  for (let i = 0; i < proxies.length; i++) {
    const proxy = proxies[i],
      { results } = await (
        await (await inspector(proxy).lookupIp()).pingSites(sitesToPing)
      ).evaluate();
    const {
      evaluation: { errors, blocked }
    } = results;

    if (errors.length == 0 && !blocked) {
      await save(proxy); //good proxy.
      console.log(`good proxy ->${proxy}`);
    } else {
      console.log(`bad proxy ->${proxy}`);
    }
  }
}
