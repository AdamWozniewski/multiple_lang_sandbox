import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@utility/hash";

describe("hashPassword / verifyPassword", () => {
  const pswd = "SuperSecret123!";

  it("hashPassword - returns a different string than the original", async () => {
    const hashed = await hashPassword(pswd);
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(pswd);
  });

  it("verifyPassword - returns true for a valid password", async () => {
    const hashed = await hashPassword(pswd);
    expect(await verifyPassword(pswd, hashed)).toBe(true);
  });

  it("verifyPassword - returns false for invalid password", async () => {
    const hashed = await hashPassword(pswd);
    expect(await verifyPassword("FooBar!", hashed)).toBe(false);
  });

  it("hashPassword - generates different hashes for the same password", async () => {
    const h1 = await hashPassword(pswd);
    const h2 = await hashPassword(pswd);
    expect(h1).not.toBe(h2);
  });
});
