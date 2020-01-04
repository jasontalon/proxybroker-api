import { Request, Response, Express } from "express";
import ProxyBroker, { ProxyType, Level, Format } from "./proxybroker";

export default class RouteBuilder {
  constructor(private app: Express) {}

  private getRoutes(): Route[] {
    const routes: Route[] = [
      new Route("get", "/search", async function(
        request: Request,
        response: Response
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
          response.status(400).jsonp({
            message:
              "specify following parameters: types=[HTTP, HTTPS, SOCKS4, SOCKS5, CONNECT:80, CONNECT25], lvl=[Transparent, Anonymous, High]"
          });
          return;
        }
        try {
          const notEmpty = (value: string) => !!value,
            asProxyType = (type: string) => type as ProxyType,
            asLevel = (level: string) => level as Level,
            commaSeperated: string = ",",
            proxies = await new ProxyBroker({
              countries: (countries as string)
                .split(commaSeperated)
                .filter(notEmpty),
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

          response.jsonp(proxies.map(Format));
        } catch (err) {
          response.status(400).send(err);
        }
      })
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

export class Route {
  constructor(
    public httpMethod: HttpMethod,
    public path: string,
    public handler: Handler
  ) {}
}

export type HttpMethod = "post" | "get" | "put";
type Handler = (request: Request, response: Response) => void;
