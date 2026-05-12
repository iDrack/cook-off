import { RecipeDto } from "~/shared/models/RecipeDTO";
import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Recipe id is required.",
    });
  }

  const recipe = await Recipe.findById(id).lean();
  
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found!",
    });
  }

    const data: RecipeDto = {
      ...recipe,
      _id: recipe._id.toString(),
    };
    return data;
});
