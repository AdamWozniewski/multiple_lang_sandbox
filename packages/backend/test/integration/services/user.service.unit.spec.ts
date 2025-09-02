import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";

import { UserService } from "@services/User-Service.js";
import { User } from "@mongo/models/user.js";
import bcrypt from "bcryptjs";

const fakeRoles = new mongoose.Types.ObjectId();

const password = "pswd1";
const testUser = {
  firstName: "Jan",
  lastName: "Kowalski",
};

describe("UserService [integration]", () => {
  let mongod: MongoMemoryServer;
  let svc: UserService;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    svc = new UserService();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    for (const coll of Object.values(mongoose.connection.collections)) {
      await coll.deleteMany({});
    }
  });

  it("createUser – saves the document with hashed password and roles", async () => {
    const payload = {
      email: "test@user.pl",
      password: "pass1234",
      roles: fakeRoles,
    };
    const created = await svc.createUser(payload);
    const fromDb = await User.findById(created.id).lean();
    expect(fromDb).not.toBeNull();
    expect(fromDb!.email).toBe(payload.email);
    expect(String(fromDb!.roles)).toBe(String(fakeRoles));
    expect(fromDb!.password).not.toBe(payload.password);
    const matches = await bcrypt.compare(payload.password, fromDb!.password);
    expect(matches).toBe(true);
  });

  it("createUser - on duplicate email throws ValidationError", async () => {
    const payload = { email: "duplicate@user.pl", password, roles: fakeRoles };
    await svc.createUser(payload);
    await expect(svc.createUser(payload)).rejects.toHaveProperty(
      "errors.email.message",
      `Taki email (${payload.email}) już istnieje`,
    );
  });

  it("generateActivationToken – should generate a plain token, hash it, set expiry and save to DB", async () => {
    const user = await svc.createUser({
      email: "activate@tokentest.pl",
      password,
      roles: fakeRoles,
    });

    const plain1 = await svc.generateActivationToken(user.id);
    expect(typeof plain1).toBe("string");
    expect(plain1.length).toBeGreaterThan(0);

    const fresh = await User.findById(user.id).lean();
    expect(fresh).not.toBeNull();

    expect(fresh!.apiToken).not.toBe(plain1);
    expect(await bcrypt.compare(plain1, fresh!.apiToken!)).toBe(true);

    expect(fresh!.apiTokenExpires).toBeInstanceOf(Date);
    expect(new Date(fresh!.apiTokenExpires).getTime()).toBeGreaterThan(
      Date.now(),
    );

    const plain2 = await svc.generateActivationToken(user.id);
    expect(plain2).not.toBe(plain1);
    const fresh2 = await User.findById(user.id).lean();
    expect(await bcrypt.compare(plain2, fresh2!.apiToken!)).toBe(true);
  });

  it("findUserByEmail - returns the created document", async () => {
    const payload = { email: "find@user.pl", password, roles: fakeRoles };
    await svc.createUser(payload);

    const found = await svc.findUserByEmail(payload.email);
    expect(found).not.toBeNull();
    expect(found!.email).toBe(payload.email);
    expect(String(found!.roles)).toBe(String(fakeRoles));
  });

  it("updateUserProfile - changes fields and saves", async () => {
    const payload = { email: "update@user.pl", password, roles: fakeRoles };
    const user = await svc.createUser(payload);

    const updated = await svc.updateUserProfile(user.id, testUser);
    expect(updated).not.toBeNull();
    expect(updated!.firstName).toBe(testUser.firstName);
    expect(updated!.lastName).toBe(testUser.lastName);

    const fromDb = await User.findById(user.id).lean();
    expect(fromDb!.firstName).toBe(testUser.firstName);
    expect(fromDb!.lastName).toBe(testUser.lastName);
  });

  it("activateUser - with correct token activates and clears apiToken", async () => {
    const user = await svc.createUser({
      email: "activate@user.pl",
      password,
      roles: fakeRoles,
    });
    const plainToken = await svc.generateActivationToken(user.id);
    const activated = await svc.activateUser(user.id, plainToken);

    expect(activated.activate).toBe(true);
    expect(activated.apiToken).toBe("");
    expect(activated.apiTokenExpires).toBeNull();
  });

  it("activateUser - with bad token throws Error(“Invalid user”)", async () => {
    const user = await svc.createUser({
      email: "bad@token.pl",
      password,
      roles: fakeRoles,
    });

    await expect(svc.activateUser(user.id, "wrong-token")).rejects.toThrow(
      "Invalid user",
    );
  });
});
