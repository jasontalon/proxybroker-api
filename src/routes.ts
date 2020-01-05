import * as api from "fastify";
import ProxyBroker, { Level, ProxyType, Format } from "./proxybroker";
import { IncomingMessage, Server, ServerResponse } from "http";

export default function(
  fastify: api.FastifyInstance,
  options: api.RegisterOptions<Server, IncomingMessage, ServerResponse>,
  callback: (err?: api.FastifyError | undefined) => void
) {
  fastify.route({ handler: searchProxy, url: "/search", method: "GET" });

  callback();
}

async function searchProxy(
  request: api.FastifyRequest,
  response: api.FastifyReply<any>
) {
  const emptyString = "",
    {
      countries = emptyString,
      types = emptyString,
      lvl = emptyString,
      limit = 10,
      strict = false
    } = request.query;

  if ([types, lvl].includes(emptyString)) {
    response.status(400);
    return {
      message:
        "specify following parameters: types=[HTTP, HTTPS, SOCKS4, SOCKS5, CONNECT:80, CONNECT25], lvl=[Transparent, Anonymous, High]"
    };
  }
  try {
    const notEmpty = (value: string) => !!value,
      asProxyType = (type: string) => type as ProxyType,
      asLevel = (level: string) => level as Level,
      commaSeperated: string = ",",
      proxies = await new ProxyBroker({
        countries: (countries as string).split(commaSeperated).filter(notEmpty),
        types: (types as string)
          .split(commaSeperated)
          .map(asProxyType)
          .filter(notEmpty),
        lvl: (lvl as string)
          .split(commaSeperated)
          .map(asLevel)
          .filter(notEmpty),
        limit,
        strict
      }).search();

    return proxies.map(Format);
  } catch (err) {
    response.status(400);
    return err;
  }
}
