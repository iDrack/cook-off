export type RecipeDto = Omit<RecipeDocument, "_id"> & {
  _id: string;
};

export type RecipesResponse = {
  data: RecipeDto[];
  metadata: {
    totalPages: number;
    totalItems: number;
    prevPage: number | null;
    nextPage: number | null;
  };
};