import type { Filter } from "~/shared/models/Filter";
import type { RecipeDto, RecipesResponse } from "~/shared/models/RecipeDTO";
import { SortField } from "~/shared/models/SortField";
import type { SortInfo } from "~/shared/models/SortInfo";
import type { RecipeDocument } from "~~/server/models/Recipe";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref<RecipeDto[]>([]);
  const randomPick = ref<RecipeDocument[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const limit = 24;
  const totalItems = ref(0);
  const prevPage = ref<Number | null>(null);
  const nextPage = ref<Number | null>(null);
  const isLoading = ref(false);
  const hasLoaded = ref(false);
  const sortInfo = ref<SortInfo | undefined>();
  const filters = ref<Filter>({
    category: undefined,
    onlyFavorite: false,
    onlyDraft: false,
  });
  const searchQuery = ref("")

  const fetchRecipes = async () => {
    if (isLoading.value) {
      return;
    }
    isLoading.value = true;
    try {
      const res = await $fetch<RecipesResponse>(`/api/recipes`, {
        method: "GET",
        query: {
          page: currentPage.value,
          s: searchQuery.value,
          sort:
            sortInfo.value !== undefined && sortInfo.value.type !== undefined
              ? sortInfo.value.type.toString
              : "",
          dir: sortInfo.value !== undefined ? sortInfo.value.direction : "dsc",
          c: filters.value.category !== undefined ? filters.value.category : "",
          f: filters.value.onlyFavorite,
          d: filters.value.onlyDraft,
        },
      });

      totalPages.value = res.metadata.totalPages;
      totalItems.value = res.metadata.totalItems;
      prevPage.value = res.metadata.prevPage;
      nextPage.value = res.metadata.nextPage;
      recipes.value = res.data;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRandomPick = async () => {
    isLoading.value = true;

    try {
      const res = await $fetch("/api/recipes/random", {
        method: "GET",
      });
      if (res.data) {
        randomPick.value = res.data;
      }
    } finally {
      isLoading.value = false;
      hasLoaded.value = true;
    }
  };

  const fetchRecipeById = async (id: string) => {
    isLoading.value = true
    try {
      const res = await $fetch(`/api/recipes/${id}`, {
        method: 'GET'
      });

      return res;
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const makeRecipeFavorite = async (id: string) => {
    try {
      const res = await $fetch(`/api/recipes/${id}/favorite`, {
        method: "PUT",
      });
      await fetchRecipes();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const res = await $fetch(`/api/recipes/${id}` as "/api/recipes/:id", {
        method: "DELETE",
      });
      await fetchRecipes();
      return res.title;
    } catch (error) {
      throw error;
    }
  };

  return {
    randomPick: readonly(randomPick),
    isLoading: readonly(isLoading),
    hasLoaded: readonly(hasLoaded),
    currentPage,
    totalPages: readonly(totalPages),
    totalItems: readonly(totalItems),
    nextPage: readonly(nextPage),
    prevPage: readonly(prevPage),
    limit,
    recipes: readonly(recipes),
    sortInfo,
    filters,
    searchQuery,
    fetchRecipes,
    fetchRandomPick,
    fetchRecipeById,
    makeRecipeFavorite,
    deleteRecipe,
  };
});
