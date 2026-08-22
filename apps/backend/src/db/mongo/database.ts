import { config } from "@config";
import mongoose from "mongoose";

const { connection } = mongoose;

connection.on("connected", () => console.log("mongo - connected"));
connection.on("open", () => console.log("mongo - open"));
connection.on("disconnected", () => console.log("mongo - disconnected"));
connection.on("reconnected", () => console.log("mongo - reconnected"));
connection.on("disconnecting", () => console.log("mongo - disconnecting"));
connection.on("close", () => console.log("mongo - close"));

mongoose.set("debug", true);
mongoose.set("sanitizeFilter", true);

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.db, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (_e: any) {
    throw new Error("Połączenie zostało zerwane");
  }
};
