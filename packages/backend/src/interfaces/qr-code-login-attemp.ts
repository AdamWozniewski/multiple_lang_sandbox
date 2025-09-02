import type { AttemptStatus } from "@customTypes/qr-code-attemp-status.js";

export interface LoginAttempt {
  attemptId: string;
  userId: string;
  code: number;
  status: AttemptStatus;
  createdAt: number;
  expiresAt: number;
}
