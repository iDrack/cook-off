import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Impossible de trouver la recetee, id manquant.",
    });
  }

  const recipe = await Recipe.findById(id);
  await Recipe.deleteOne({
    _id: id,
  });

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette inexistante.",
    });
  }

  return { title: recipe.title };
});
