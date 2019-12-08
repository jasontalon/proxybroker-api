const { PROXY_TARGET_COUNTRIES = "US" } = process.env;
const { removeStackProperty } = require("../util");
const findProxy = require("../modules/proxy/search");

const GET = [
  [
    "/",
    async function(req, res) {
      const { countries, limit } = req.query;
      try {
        res.setTimeout(130000, () => res.status(408).send("Request Timeout"));
        const proxies = await findProxy({
          countries: (countries || PROXY_TARGET_COUNTRIES).replace(/,/gm, " "),
          limit: limit || 10
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
