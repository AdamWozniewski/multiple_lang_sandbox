import mongoose from "mongoose";
import { config } from '@config';

const { connection } = mongoose;

connection.on("connected", () => console.log("mongo - connected"));
connection.on("open", () => console.log("mongo - open"));
connection.on("disconnected", () => console.log("mongo - disconnected"));
connection.on("reconnected", () => console.log("mongo - reconnected"));
connection.on("disconnecting", () => console.log("mongo - disconnecting"));
connection.on("close", () => console.log("mongo - close"));

await mongoose.connect(config.db, {
  serverSelectionTimeoutMS: 5000,
});
