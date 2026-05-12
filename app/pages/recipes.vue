<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import type { SortInfo } from '~/shared/models/SortInfo';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const recipeStore = useRecipeStore();
const {
  limit,
  currentPage,
  totalItems,
  sortInfo,
  filters,
} = storeToRefs(recipeStore);

const getPageFromQuery = (value: unknown) => {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

const getCategoryFromQuery = (value: unknown) => {
  if (typeof value !== 'string' || value === '') return undefined;
  return (Object.values(Category) as string[]).includes(value) ? (value as Category) : undefined
}

filters.value = {
  category: getCategoryFromQuery(route.query.c) || undefined,
  onlyFavorite: false,
  onlyDraft: false,
}

//Update page query parameter
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

//Update category query parameter and reset page number to 1
const onCategoryChange = async (value: Category | undefined) => {
  const query: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(route.query).filter(
        ([, queryValue]) => typeof queryValue === 'string'
      )
    ),
    page: '1'
  }
  if (value) {
    query.c = value
  } else {
    delete query.c
  }

  await router.replace({ query })
}

const onSortChange = async (value: SortInfo | undefined) => {
  sortInfo.value = value
  await recipeStore.fetchRecipes()
}
//Watch for query change (page and category)
watch(() => [route.query.page, route.query.c] as const,
  async ([pageQuery, categoryQuery]) => {
    try {
      recipeStore.currentPage = getPageFromQuery(pageQuery);
      filters.value.category = getCategoryFromQuery(categoryQuery);
      await recipeStore.fetchRecipes();
    } catch (error) {
      console.log(error);
      if (isNuxtError(error)) {
        toast.add({ title: "Erreur", description: error.message, color: "info", icon: "i-lucide-triangle-alert" });
      }
    }
  }, { immediate: true });

//Watch for favorite and draft filters
watch(
  () => [filters.value.onlyFavorite, filters.value.onlyDraft],
  async () => {
    await recipeStore.fetchRecipes()
  }
)

</script>

<template>
  <UContainer class="flex justify-between pt-3 z-40">
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
    <div>
      <ButtonRecipeSearch />
    </div>
  </UContainer>
  <UPage>
    <div v-if="recipeStore.recipes.length === 0">
      <UPageSection title="Aucune recette trouvée.">

      </UPageSection>
    </div>
    <div v-else>
    <UContainer class="py-10">
      <UPageGrid>
        <CardRecipe v-for="(item, index) in recipeStore.recipes" :key="index" :id="item._id" :title="item.title"
          :description="item.description" :category="item.category" :picture-path="item.picturePath"
          :is-draft="item.isDraft" :is-favorite="item.isFavorite" :show-favorite="true" :show-delete="true"
          :show-edit="true" />
      </UPageGrid>
    </UContainer>
    <UContainer class="flex justify-center pb-8">
      <UPagination v-model:page="paginationPage" :total="totalItems" :items-per-page="limit" />
    </UContainer>
    </div>

  </UPage>

</template>

<style scoped></style>