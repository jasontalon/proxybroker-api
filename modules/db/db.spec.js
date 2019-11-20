const crypto = require("crypto"),
  db = require("./db")();
describe("test db", () => {
  it("should create db if not exists", async () => {
    await db.createDbIfNotExists();
  });
  it("should insert proxy row", async () => {
    const proxy = "8.8.8.8";
    const details = crypto.randomBytes(64).toString("hex");
    await db.add(proxy, details);
  });
  it("should get proxy rows", async () => {
    const rows = await db.get();
  });
});
