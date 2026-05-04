import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Recipe id is required.",
    });
  }

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found",
    });
  }

  const files = await readMultipartFormData(event);
  const image = files?.find((file) => file.name === "image");

  if (!image || !image.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image is required",
    });
  }

  const extension = extname(image.filename || "").toLowerCase() || ".png";
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  if (!allowedExtensions.includes(extension)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported image format",
    });
  }
  const directory = join(process.cwd(), "public", "img", "recipe");
  await mkdir(directory, { recursive: true });

  const filename = `${id}${extension}`;
  const filepath = join(directory, filename);

  await writeFile(filepath, image.data);

  recipe.picturePath = `/img/recipe/${filename}`;
  await recipe.save();

  return {
    picturePath: recipe.picturePath,
  };
});
