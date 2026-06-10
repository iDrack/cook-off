import { unlink } from "node:fs/promises";
import { join, basename } from "node:path";
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

  if (recipe && recipe.picturePath) {
    const filename = basename(recipe.picturePath);
    const IMAGE_DIR = join(process.cwd(), "bucket", "recipes");
    const filePath = join(IMAGE_DIR, filename);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

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
