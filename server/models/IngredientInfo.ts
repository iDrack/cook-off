import { defineMongooseModel } from "#nuxt/mongoose";
import { Unit } from "./Unit";

export interface IngredientInfoDocument {
  name: string;
  quantity: number;
  unit: Unit;
}

export const IngredientInfoSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: Object.values(Unit),
    required: true,
  },
};
