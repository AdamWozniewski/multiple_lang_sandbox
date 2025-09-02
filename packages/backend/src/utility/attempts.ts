import { randomInt } from "node:crypto";
import type { LoginAttempt } from "@interface/qr-code-login-attemp.js";

const attempts = new Map<string, LoginAttempt>();

export const AttemptsStore = {
  save(a: LoginAttempt) {
    attempts.set(a.attemptId, a);
  },
  get(id: string) {
    return attempts.get(id);
  },
  approve(id: string) {
    const a = attempts.get(id);
    if (a) a.status = "approved";
  },
  deny(id: string) {
    const a = attempts.get(id);
    if (a) a.status = "denied";
  },
  remove(id: string) {
    attempts.delete(id);
  },
  sweep() {
    const now = Date.now();
    for (const a of attempts.values()) {
      if (a.expiresAt <= now && a.status === "pending") a.status = "expired";
      if (a.expiresAt + 60_000 < now) attempts.delete(a.attemptId);
    }
  },
};

setInterval(() => AttemptsStore.sweep(), 10_000);

export function generate4DigitCode() {
  return randomInt(1000, 10000); // 1000-9999
}
