import { RecipeDocument } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
  const total = await Recipe.countDocuments();
  const size = Math.min(4, total);

  if (size === 0) {
    return { data: [] };
  }

  const data = await Recipe.aggregate([
    {
      $sample: { size },
    },
  ]);
  return {
    data,
  };
});
