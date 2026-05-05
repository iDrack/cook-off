import { Recipe } from "../models/Recipe";
//TODO : Ajouter option de filtre (catégorie et isDraft ou isFavorite)
//TODO: Ajouter un ordre de trie (date de création / alphabétique...)
//TODO: Ajouter la recherche par texte

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  //Get query parameter 'page'
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const requestedPage = Number.parseInt(pageParam ?? "1", 10);

  if (Number.isNaN(requestedPage) || requestedPage <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le paramètre "page" est invalide.',
    });
  }

  //Set response metadata
  const limit = 24;
  const totalItems = await Recipe.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const offset = (requestedPage - 1) * limit;

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

  return {
    metadata: metadata,
    data: recipeList,
  };
});
