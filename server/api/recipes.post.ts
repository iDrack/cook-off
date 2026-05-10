import { Recipe } from "../models/Recipe";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    return await Recipe.create(body);
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error?.message || "La recette n'est pas complète."
    })
  }
});