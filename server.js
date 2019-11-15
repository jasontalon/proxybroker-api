const express = require("express"),
  app = express(),
  port = process.env.PORT || 8080,
  { PROXY_GET_LIMIT = 10, PROXY_COUNTRIES = "US" } = process.env,
  { findProxy } = require("./proxy.find");

app.set("json spaces", 2);
app.use(express.json());

const removeStackProperty = obj =>
  Object.getOwnPropertyNames(obj).reduce((acc, key) => {
    if (key.toLowerCase() !== "stack") {
      acc[key] = obj[key];
      return acc;
    } else return acc;
  }, {});
app.get("/", async (req, res) => {
  try {
    res.setTimeout(20000, () => {
      res.status(408).send("Request Timeout");
    });
    const proxies = await findProxy({
      countries: (req.query.countries || PROXY_COUNTRIES).replace(/,/gm, " "),
      limit: req.query.limit || PROXY_GET_LIMIT
    });
    res.jsonp(proxies);
  } catch (err) {
    res.status(500).jsonp(removeStackProperty(err));
  }
});
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
