require("dotenv").config();

const save = require("./db.save"),
  crypto = require("crypto");

describe("save proxy", () => {
  it("should save proxy", async () => {
    const rowsAffected = await save(crypto.randomBytes(64).toString("hex"));

    expect(rowsAffected).toBeGreaterThan(0);
  });
});
