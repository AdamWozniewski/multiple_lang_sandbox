import { model, type Model, Schema } from "mongoose";

export interface IWebAuthnCredential extends Document {
  createdAt: Date;
  transports: string[];
  counter: number;
  publicKey: Buffer;
  credentialID: Buffer;
}

export const WebAuthnCredentialSchema = new Schema<IWebAuthnCredential>({
  credentialID: {
    type: Buffer,
    required: true,
    unique: true,
  },
  publicKey: {
    type: Buffer,
    required: true,
  },
  counter: {
    type: Number,
    required: true,
  },
  transports: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const WebAuthnCredential: Model<IWebAuthnCredential> =
  model<IWebAuthnCredential>("WebAuthnCredential", WebAuthnCredentialSchema);
