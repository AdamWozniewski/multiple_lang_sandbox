import { randomBytes, createHash } from "node:crypto";
const COST = 10;

const isBun =
  typeof globalThis !== "undefined" &&
  typeof (globalThis as any).Bun !== "undefined" &&
  !!(globalThis as any).Bun.password;

export async function hashPassword(password: string, cost = COST) {
  if (isBun) {
    return (globalThis as any).Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost,
    });
  } else {
    const { default: bcryptjs } = await import("bcryptjs");
    return bcryptjs.hash(password, cost);
  }
}

export async function verifyPassword(password: string, hashed: string) {
  if (isBun) {
    return (globalThis as any).Bun.password.verify(password, hashed);
  } else {
    const { default: bcryptjs } = await import("bcryptjs");
    return bcryptjs.compare(password, hashed);
  }
}

export const base64url = (buf: Buffer) => {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
export const sha256Base64url = (input: string)=> {
  const h = createHash("sha256").update(input, "utf8").digest();
  return base64url(h);
}
export const generateSecret = () => {
  return base64url(randomBytes(32));
}
