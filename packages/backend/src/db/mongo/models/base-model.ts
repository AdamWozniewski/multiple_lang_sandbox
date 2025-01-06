import type { Document, Schema, Model } from "mongoose";
import { model } from "mongoose";

export interface IBaseModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
}

export abstract class BaseModel<T extends Document> {
  private schema: Schema;
  private model: Model<T>;

  constructor(name: string, schema: Schema) {
    schema.add({
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      active: { type: Boolean, default: true },
    });

    schema.pre("save", function (next) {
      this.updatedAt = new Date();
      next();
    });

    this.schema = schema;
    this.model = model<T>(name, schema);
  }

  getModel(): Model<T> {
    return this.model;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async disable(active: boolean): Promise<T | null> {
    return this.model.updateOne({ active }).exec();
  }
}
