import { SortField } from "../../app/shared/models/SortField";
import { RecipeDto, RecipesResponse } from "~/shared/models/RecipeDTO";
import { Recipe } from "../models/Recipe";
import type { SortOrder } from "mongoose";

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

  //Determine filters
  const category =
    typeof query.c === "string" && query.c.length > 0 ? query.c : null;
  const onlyFavorite = query.f === "true" || false;
  const onlyDraft = query.d === "true" || false;

  const filters: Record<string, unknown> = {
    ...(category ? { category } : {}),
    ...(onlyFavorite ? { isFavorite: true } : {}),
    ...(onlyDraft ? { isDraft: true } : {}),
  };

  //Number of pages
  const limit = 24;
  const totalItems = await Recipe.countDocuments(filters);
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

  //Determine sort field and direction
  const direction = query.dir === "asc" ? 1 : -1;
  const sortField = query.sort;

  let selectedSort: Record<string, SortOrder | { $meta: any }>;

  switch (sortField) {
    case SortField.updatedDate:
      selectedSort = {
        updatedDate: direction,
      };
      break;

    case SortField.title:
      selectedSort = {
        title: direction,
      };
      break;

    default:
      selectedSort = {
        createdDate: direction,
      };
      break;
  }

  //Get recipe list with the requested page, sort and filter option
  const recipeList = await Recipe.find(filters)
    .sort(selectedSort)
    .skip(offset)
    .limit(limit)
    .lean();

  const data: RecipeDto[] = recipeList.map((recipe) => ({
    ...recipe,
    _id: recipe._id.toString(),
  }));

  return {
    metadata: metadata,
    data: data,
  };
});
