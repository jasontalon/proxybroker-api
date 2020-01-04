export default class ProxyBroker {
    private config;
    constructor(config: Config);
    search(): Promise<string[]>;
    private buildCommand;
}
export declare function Format(proxy: string): Address;
export interface Address {
    fullAddress: string;
    ip: string;
    port: string;
    country?: string;
    summary: string;
}
export interface Config {
    countries: string[];
    types: ProxyType[];
    lvl: Level[];
    strict: boolean;
    limit: number;
}
export declare type ProxyType = "HTTP" | "HTTPS" | "SOCKS4" | "SOCKS5" | "CONNECT:80" | "CONNECT:25";
export declare type Level = "Transparent" | "Anonymous" | "High";
export interface Proxy {
    summary: string;
    ip: string;
    port: string;
    country: string;
    ipPort: string;
}
//# sourceMappingURL=proxybroker.d.ts.map