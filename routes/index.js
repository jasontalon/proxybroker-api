const { PROXY_GET_LIMIT = 10, PROXY_COUNTRIES = "US" } = process.env;
const { removeStackProperty } = require("../helpers");
const findProxy = require("../modules/proxy/find");

const GET = [
  [
    "/",
    async function(req, res) {
      const { countries, limit } = req.query;
      try {
        res.setTimeout(30000, () => res.status(408).send("Request Timeout"));
        const proxies = await findProxy({
          countries: (countries || PROXY_COUNTRIES).replace(/,/gm, " "),
          limit: limit || PROXY_GET_LIMIT
        });
        res.jsonp(proxies);
      } catch (err) {
        res.status(500).jsonp(removeStackProperty(err));
      }
    }
  ]
];

function route(app) {
  GET.forEach(route => app.get(...route));
}

module.exports = route;
