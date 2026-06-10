import { unlink } from "node:fs/promises";
import { join, basename } from "node:path";
import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'id de recette est nécessaire pour modifier son image.",
    });
  }

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette introuvable.",
    });
  }
  if (recipe.picturePath) {
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

  recipe.picturePath = "";
  return await recipe.save();
});
