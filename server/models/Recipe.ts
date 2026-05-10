import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from 'mongoose';
import { Category } from "../../app/shared/models/Category";
import { IngredientInfoSchema, IngredientInfoDocument } from "./IngredientInfo";

export interface RecipeData {
  title: string;
  description: string;
  tips?: string;
  isDraft: boolean;
  isFavorite: boolean;
  defaultNbPeople: number;
  category: Category;
  ingredients: IngredientInfoDocument[];
  steps: string[];
  picturePath: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface RecipeDocument extends RecipeData {
  _id: Types.ObjectId,
}

export const Recipe = defineMongooseModel<RecipeDocument>({
  name: "Recipe",
  schema: {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tips: {
      type: String,
      required: false,
      trim: true,
    },
    isDraft: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      required: true,
      default: false,
    },
    defaultNbPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    ingredients: {
      type: [IngredientInfoSchema],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    picturePath: {
      type: String,
      required: false,
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  options: {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
    collection: "recipes",
  },
});
