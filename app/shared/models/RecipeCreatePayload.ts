import type { RecipeData } from "~~/server/models/Recipe";

export type RecipeCreatePayload = Omit<
    RecipeData,
    'picturePath' | 'createdDate' | 'updatedDate'
>