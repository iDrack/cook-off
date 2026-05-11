<script setup lang='ts'>
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
} = storeToRefs(recipeStore);

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
} catch (error) {
  console.log(error);
  if (isNuxtError(error)) {
    toast.add({ title: "Erreur", description: error.message, color: "info", icon: "i-lucide-triangle-alert" });
  }
}

watch(recipes, (value) => {
  console.log(recipes.value);
})

</script>

<template>
  <UPageSection>
    <UPageGrid>
      <CardRecipe v-for="(item, index) in recipeStore.recipes" :key="index" :id="item._id" :title="item.title"
        :description="item.description" :category="item.category" :photo-url="item.picturePath" :show-delete="true"
        :show-edit="true" />
    </UPageGrid>
    <div class="flex justify-center">
      <UPagination v-model:page="paginationPage" :total="totalItems" :items-per-page="limit" />
    </div>
  </UPageSection>
</template>

<style scoped></style>