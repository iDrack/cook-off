export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const recipe = await Recipe.findById(id);
  if (recipe === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette introuvable.",
    });
  }
  recipe.isFavorite = !recipe.isFavorite;
  recipe.save();
  return recipe;
});
