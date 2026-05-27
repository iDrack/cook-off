import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const contentType = getHeader(event, "content-type");
  const originalName = getHeader(event, "x-file-name");

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

  if (!contentType?.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le fichier doit être une image.",
    });
  }

  const data = await readRawBody(event, false);
  if (
    !data ||
    !(data instanceof Buffer) ||
    data.length === 0 ||
    !originalName
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Une image est requise.",
    });
  }

  if (recipe.picturePath) {
    const filename = basename(recipe.picturePath);
    const filePath = join(process.cwd(), "public", "img", "recipe", filename);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  const extension = extname(originalName).toLowerCase() || ".png";
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(extension)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Format non supporté, utiliser png, jpg ou jpeg.",
    });
  }
  const directory = join(process.cwd(), "public", "img", "recipe");
  await mkdir(directory, { recursive: true });

  const filename = `${id}${extension}`;

  await writeFile(join(directory, filename), data);

  recipe.picturePath = `/img/recipe/${filename}`;
  await recipe.save();

  return {
    picturePath: recipe.picturePath,
  };
});
