import { Request, Response, Express } from "express";
import ProxyBroker, { ProxyType, Level, Format } from "./proxybroker";

export default class RouteBuilder {
  constructor(private app: Express) {}

  private getRoutes(): Route[] {
    const routes: Route[] = [
      {
        httpMethod: "get",
        path: "/search",
        handler: async function(request: Request, response: Response) {
          const emptyString = "",
            notEmpty = (value: string) => !!value,
            {
              countries = emptyString,
              types = emptyString,
              lvl = emptyString,
              limit = 10,
              strict = false
            } = request.query;

          if ([types, lvl].includes(emptyString)) {
            response
              .status(400)
              .send(
                "specify types=[HTTP, HTTPS, SOCKS4, SOCKS5, CONNECT:80, CONNECT25], lvl=[Transparent, Anonymous, High] parameters"
              );
            return;
          }
          try {
            const asProxyType = (type: string) => type as ProxyType,
              asLevel = (level: string) => level as Level,
              proxies = await new ProxyBroker({
                countries: (countries as string).split(",").filter(p => p),
                types: (types as string)
                  .split(",")
                  .map(asProxyType)
                  .filter(notEmpty),
                lvl: (lvl as string)
                  .split(",")
                  .map(asLevel)
                  .filter(notEmpty),
                limit,
                strict
              }).search();

            response.jsonp(proxies.map(Format));
          } catch (err) {
            response.status(400).send(err);
          }
        }
      }
    ];
    return routes;
  }

  private assignRoute(route: Route) {
    (this.app as any)[route.httpMethod](route.path, route.handler);
  }

  setup() {
    this.getRoutes().forEach(this.assignRoute, this);
  }
}

export interface Route {
  httpMethod: "post" | "get" | "put";
  path: string;
  handler: (request: Request, response: Response) => void;
}
