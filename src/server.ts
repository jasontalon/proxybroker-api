import fastify from "fastify";
import routes from "./routes";
const app = fastify(),
  { PORT = 8080 } = process.env;

app.register(routes);

app.listen(PORT as number, () => {
  console.log(`listening to port ${PORT}`);
});
