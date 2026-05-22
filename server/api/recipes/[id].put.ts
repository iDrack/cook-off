export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const newValues = await readBody(event);

    const recipe = await Recipe.findByIdAndUpdate(id, newValues, {
      new: true,
      runValidators: true
    })

    return recipe;
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
