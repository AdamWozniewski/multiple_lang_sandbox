import * as mongoose from "mongoose";
import {config} from "../config.js";

await mongoose.connect(config.db, {});