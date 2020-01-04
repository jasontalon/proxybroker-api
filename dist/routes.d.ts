import { Request, Response, Express } from "express";
export default class RouteBuilder {
    private app;
    constructor(app: Express);
    private getRoutes;
    private assignRoute;
    setup(): void;
}
export interface Route {
    httpMethod: "post" | "get" | "put";
    path: string;
    handler: (request: Request, response: Response) => void;
}
//# sourceMappingURL=routes.d.ts.map