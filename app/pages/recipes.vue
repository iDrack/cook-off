<script setup lang='ts'>
import type { Category } from '~/shared/models/Category';
import type { SortInfo } from '~/shared/models/SortInfo';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const recipeStore = useRecipeStore();
const {
  recipes,
  limit,
  currentPage,
  totalItems,
  totalPages,
  isLoading,
  sortInfo,
  filters,
} = storeToRefs(recipeStore);

filters.value = {
  category: undefined,
  onlyFavorite: false,
  onlyDraft: false,
}

const getPageFromQuery = (value: unknown) => {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

watch(() => route.query.page,
  async (pageQuery) => {
    try {
      recipeStore.currentPage = getPageFromQuery(pageQuery);
      await recipeStore.fetchRecipes();
    } catch (error) {
      console.log(error);
      if (isNuxtError(error)) {
        toast.add({ title: "Erreur", description: error.message, color: "info", icon: "i-lucide-triangle-alert" });
      }
    }
  });

const paginationPage = computed({
  get: () => currentPage.value,
  set: async (page: number) => {
    if (page === currentPage.value) return

    await router.replace({
      query: {
        ...route.query,
        page: String(page)
      }
    })
  }
});

try {
  await recipeStore.fetchRecipes();
  if (recipeStore.recipes.length === 0) {
    toast.add({ title: "Aucune recette trouvée.", description: "Créer une recette avant d'accéder à vos recettes.", color: "info", icon: "i-lucide-info" });
    navigateTo('/create-recipe')
  }
} catch (error) {
  console.log(error);
  if (isNuxtError(error)) {
    toast.add({ title: "Erreur", description: error.message, color: "info", icon: "i-lucide-triangle-alert" });
  }
}

const onCategoryChange = (value: Category | undefined) => {
  filters.value.category = value;
}

const onSortChange = async (value: SortInfo | undefined) => {
  sortInfo.value = value
  await recipeStore.fetchRecipes()
}

watch(filters, async (newValue) => {
  await recipeStore.fetchRecipes();
}, { deep: true });

</script>

<template>
  <UContainer class="pt-3 z-40">
    <div class="flex flex-wrap gap-3 items-center">
      <ButtonSelectionCategoryFilter :selected-category="filters.category" @change="onCategoryChange" />
      <ButtonSelectionSort :selected-sort="sortInfo" @change="onSortChange" />
      <div class="flex gap-1 items-center">
        <UIcon name="i-lucide-star" />
        <USwitch v-model="filters.onlyFavorite" />
      </div>
      <div class="flex gap-1 items-center">
        <UIcon name="i-lucide-file-clock" />
        <USwitch v-model="filters.onlyDraft" />
      </div>
    </div>
  </UContainer>
  <UPage>
    <UContainer class="py-10">
      <UPageGrid>
        <CardRecipe v-for="(item, index) in recipeStore.recipes" :key="index" :id="item._id" :title="item.title"
          :description="item.description" :category="item.category" :photo-url="item.picturePath"
          :is-favorite="item.isFavorite" :show-delete="true" :show-edit="true" />
      </UPageGrid>
    </UContainer>
    <UContainer class="flex justify-center pb-8">
      <UPagination v-model:page="paginationPage" :total="totalItems" :items-per-page="limit" />
    </UContainer>
  </UPage>

</template>

<style scoped></style>