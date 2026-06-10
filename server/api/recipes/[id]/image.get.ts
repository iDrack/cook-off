import { readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { Recipe } from "~~/server/models/Recipe";

const IMAGE_DIR = join(process.cwd(), "bucket", "recipes");

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Id de recette invalide."
    });
  }

  const recipe = await Recipe.findById(id).lean();

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette introuvable."
    });
  }

  if (!recipe.picturePath) {
    throw createError({
      statusCode: 404,
      statusMessage: "Aucune image pour cette recette."
    });
  }

  const filename = basename(recipe.picturePath);
  const imagePath = join(IMAGE_DIR, filename);

  let buffer: Buffer;
  try {
    buffer = await readFile(imagePath);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw createError({
        statusCode: 404,
        statusMessage: "Fichier image introuvable."
      });
    }
    throw error;
  }

  const ext = extname(filename).toLowerCase();
  const mimeByExt: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
  };

  setHeader(event, "Content-Type", mimeByExt[ext] || "application/octet-stream");
  setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");

  return buffer;
});