import util from "util";
import { exec } from "child_process";

export default class ProxyBroker {
  constructor(private config: Config) {}

  async search(): Promise<string[]> {
    const command: string = this.buildCommand(),
      asyncExec = util.promisify(exec);

    const { stdout, stderr } = await asyncExec(command);

    if (stderr) throw stderr;
    else {
      const items: string[] = stdout.split("\n").filter(p => p);
      return items;
    }
  }

  private buildCommand(): string {
    const { types, lvl, strict, limit, countries } = this.config,
      buildArgs = (config: Config) => {
        const countryArgs: string =
            countries.length > 0 ? `--countries ${countries.join(" ")}` : "",
          lvlArgs: string = lvl.length > 0 ? `--lvl ${lvl.join(" ")}` : "",
          typesArgs: string =
            types.length > 0 ? `--types ${types.join(" ")}` : "",
          strictArgs: string = strict ? "--strict" : "",
          limitArgs: string = `--limit ${limit}`;

        return `${countryArgs} ${typesArgs} ${lvlArgs} ${strictArgs} ${limitArgs}`;
      },
      args: string = buildArgs(this.config),
      command: string = `proxybroker find ${args}`,
      removeWhiteSpaces = (val: string) =>
        val.replace(/\r?\n|\r/g, " ").replace(/\s\s+/g, " ");

    return removeWhiteSpaces(command);
  }
}
class AddressFormatter {
  private extracted: string;
  formatted: Address;
  constructor(private proxy: string) {
    this.extracted = "";
    this.formatted = { fullAddress: "", ip: "", port: "", summary: "" };
  }

  extract(): AddressFormatter {
    this.extracted =
      (
        this.proxy.match(
          /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+/gm
        ) || []
      ).pop() ?? "";
    return this;
  }

  format(): AddressFormatter {
    const regex = new RegExp(/(?::[0-9]+)$/gm),
      ip = this.extracted.replace(regex, ""),
      port =
        ((this.extracted.match(regex) || []).pop() || "").replace(/:/gm, "") ||
        "";

    this.formatted = {
      fullAddress: `${ip}:${port}`,
      ip,
      port,
      summary: this.proxy
    };

    return this;
  }
}

export function Format(proxy: string): Address {
  const { formatted } = new AddressFormatter(proxy).extract().format();

  return formatted;
}

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
export type ProxyType =
  | "HTTP"
  | "HTTPS"
  | "SOCKS4"
  | "SOCKS5"
  | "CONNECT:80"
  | "CONNECT:25";

export type Level = "Transparent" | "Anonymous" | "High";

export interface Proxy {
  summary: string;
  ip: string;
  port: string;
  country: string;
  ipPort: string;
}
