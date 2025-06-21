import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { User } from "@mongo/models/user.js";

let mongo: MongoMemoryServer;
const VALID_PASS = "abcd";

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(() => User.deleteMany({}));

describe("User Model - Integration Tests", () => {
  it("creates user with hash and apiToken", async () => {
    const u = await User.create({
      email: "a@a.pl",
      password: VALID_PASS,
      roles: new mongoose.Types.ObjectId(),
    });
    expect(u.password).not.toBe(VALID_PASS);
    expect(u.apiToken).toBeDefined();
    expect(u.activate).toBe(false);
  });

  it("validates invalid email", async () => {
    await expect(
      User.create({
        email: "no-email",
        password: VALID_PASS,
        roles: new mongoose.Types.ObjectId(),
      }),
    ).rejects.toThrow(/Niepoprawny adres email/);
  });

  it("enforces email uniqueness", async () => {
    const payload = {
      email: "b@b.pl",
      password: VALID_PASS,
      roles: new mongoose.Types.ObjectId(),
    };
    await User.create(payload);
    await expect(User.create(payload)).rejects.toBeInstanceOf(
      mongoose.Error.ValidationError,
    );
    await expect(User.create(payload)).rejects.toHaveProperty(
      "errors.email.message",
      `Taki email (${payload.email}) już istnieje`,
    );
  });

  it("virtual fullName returns the full name", async () => {
    const u = new User({
      email: "c@c.pl",
      password: VALID_PASS,
      roles: new mongoose.Types.ObjectId(),
      firstName: "Jan",
      lastName: "Kowalski",
    });
    await u.save();
    expect(u.fullName).toBe("Jan Kowalski");
  });

  it("comparePassword correctly verifies", async () => {
    const u = await User.create({
      email: "d@d.pl",
      password: VALID_PASS,
      roles: new mongoose.Types.ObjectId(),
    });
    expect(await u.comparePassword(VALID_PASS)).toBe(true);
    expect(await u.comparePassword("xxxx")).toBe(false);
  });
});
