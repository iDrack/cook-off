import { RecipeDto } from "~/shared/models/RecipeDTO";
import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Id de recette invalide.",
    });
  }

  const recipe = await Recipe.findById(id).lean();
  
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: `Aucune recette n’existe pour id: ${id}!`,
    });
  }

    const data: RecipeDto = {
      ...recipe,
      _id: recipe._id.toString(),
    };
    return data;
});
