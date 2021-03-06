import fastify from "fastify";
import routes from "./routes";
const app = fastify(),
  { PORT = 8080 } = process.env;

app.register(routes);

app.listen(PORT as number, "0.0.0.0", () => {
  console.log(`listening to port ${PORT}`);
});
