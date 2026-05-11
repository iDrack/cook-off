import { RecipeDto, RecipesResponse } from "~/shared/models/RecipeDTO";
import { Recipe } from "../models/Recipe";
//TODO : Ajouter option de filtre (catégorie et isDraft ou isFavorite)
//TODO: Ajouter un ordre de trie (date de création / alphabétique...)
//TODO: Ajouter la recherche par texte

export default defineEventHandler(async (event): Promise<RecipesResponse> => {
  const query = getQuery(event);

  if (Array.isArray(query.page)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Le paramètre "page" ne doit être fourni qu’une seule fois.',
    });
  }

  //Get query parameter 'page'
  const pageParam = query.page;

  if (
    pageParam !== undefined &&
    (typeof pageParam !== "string" || !/^[1-9]\d*$/.test(pageParam))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le paramètre "page" doit être un entier positif.',
    });
  }

  //Number of pages
  const limit = 24;
  const totalItems = await Recipe.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  let requestedPage = pageParam === undefined ? 1 : Number(pageParam);

  //Sanitize requestedPage value
  if (requestedPage <= 0) {
    const requestedPage = 1;
  } else if (requestedPage > totalPages) {
    const requestedPage = totalPages;
  }

  const offset = (requestedPage - 1) * limit;

  //Set response metadata
  const metadata = {
    page: requestedPage,
    totalPages: totalPages,
    limit: limit,
    totalItems: totalItems,
    prevPage: requestedPage > 1 ? requestedPage - 1 : null,
    nextPage: requestedPage < totalPages ? requestedPage + 1 : null,
  };

  if (totalItems === 0) {
    return {
      metadata: metadata,
      data: [],
    };
  }

  //Get recipe list with the requested page, sort and filter option
  const recipeList = await Recipe.find().skip(offset).limit(limit).lean();

  const data: RecipeDto[] = recipeList.map((recipe) => ({
    ...recipe,
    _id: recipe._id.toString(),
  }));

  return {
    metadata: metadata,
    data: data,
  };
});
