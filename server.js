const { PORT = 8080 } = process.env,
  express = require("express"),
  app = express(),
  routes = require("./routes");

app.set("json spaces", 2);
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
