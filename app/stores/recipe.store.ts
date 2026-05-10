import type { RecipeDocument } from "~~/server/models/Recipe";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref<RecipeDocument[]>([]);
  const randomPick = ref<RecipeDocument[]>([]);
  const isLoading = ref(false);
  const hasLoaded = ref(false)

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

  const deleteRecipe = async (id: string) => {
    isLoading.value = true;

    try {
      const res = await $fetch(`/api/recipes/${id}`  as "/api/recipes/:id", {
        method: 'DELETE'
      });
    return res.title;
    } catch(error) {
      throw error
    }
    finally {
      isLoading.value = false;
      hasLoaded.value = true;
    }
  }

  return {
    randomPick: readonly(randomPick),
    isLoading: readonly(isLoading),
    hasLoaded: readonly(hasLoaded),
    fetchRandomPick,
    deleteRecipe
  };
  
});
