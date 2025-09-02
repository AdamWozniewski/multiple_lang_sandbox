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
