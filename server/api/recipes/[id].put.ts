export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const newValues = await readBody(event);

    if (!(await Recipe.findById(id))) {
      throw createError({
        statusCode: 404,
        statusMessage: "La recette n’existe pas.",
      });
    }

    // May need to update each values
    await Recipe.findByIdAndUpdate(id, newValues);
    const recipeToUpdate = await Recipe.findById(id).lean();

    console.log(recipeToUpdate);

    return recipeToUpdate;
  } catch (error: any) {
    if (error?.statusCode) {
      throw error;
    } else {
      console.log(error);

      throw createError({
        statusCode: 500,
        statusMessage: "An error as occurred.",
      });
    }
  }
});
