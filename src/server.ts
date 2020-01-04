import express from "express";
import RouteBuilder from "./routes";
const { PORT = 8080 } = process.env,
  app = express();

app.set("json spaces", 2);
app.use(express.json());

new RouteBuilder(app).setup();

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
