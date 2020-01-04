import ProxyBroker, { Config, Format } from "./proxybroker";
describe("test proxybroker", () => {
  it("should find proxy", async () => {
    const config: Config = {
      countries: ["US"],
      lvl: ["High"],
      limit: 10,
      strict: true,
      types: ["HTTP", "HTTPS"]
    };

    const result: string[] | null = await new ProxyBroker(config).search();

    result.forEach(item => console.log(Format(item)));
    expect(result?.length ?? 0).toBeGreaterThan(0);
  }, 60000);
});
