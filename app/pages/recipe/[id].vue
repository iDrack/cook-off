<script setup lang='ts'>
import type { BreadcrumbItem } from '@nuxt/ui';
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';
import type { RecipeDto } from '~/shared/models/RecipeDTO';
import { Unit } from '~/shared/models/Unit';

const route = useRoute();
const id = route.params.id
const toast = useToast();
const nbPeople = ref(1);
const delta = ref(1);
const { data: recipe, error } = await useFetch<RecipeDto>(`/api/recipes/${id}`);

if (error.value) {
  console.log(error.value);
  if (isNuxtError(error.value)) {
    toast.add({ title: "Erreur", description: error.value.message, color: "error", icon: "i-lucide-triangle-alert" });
  } else {
    toast.add({ title: "Erreur", description: "Recette inaccessible.", color: "error", icon: "i-lucide-triangle-alert" });
  }
  navigateTo('/recipes')
} else {
  nbPeople.value = recipe.value?.defaultNbPeople || 1;
}

const formatStringToTitle = (text: string | undefined) => {
  if (!text) return ""
  return text.at(0)?.toUpperCase().concat(text.slice(1, text.length))
}

const categoryIcon = computed(() => CategoryIcon[recipe.value?.category || Category.DISH]);

const breadCrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Recettes',
    icon: "i-lucide-house",
    to: "/recipes"
  },
  {
    label: recipe.value?.category,
    icon: categoryIcon,
    to: recipe.value?.category
      ? {
        path: "/recipes",
        query: { c: recipe.value.category }
      }
      : "/recipes"
  },
  {
    label: formatStringToTitle(recipe.value?.title),
    icon: "i-lucide-book-open-text",
    to: route.fullPath
  }
])


const makeFavoriteCallback = async (value: boolean) => {
  const res = await $fetch<RecipeDto>(`/api/recipes/${id}`)
  recipe.value = res
}

const goBackCallBack = () => {
  navigateTo('/recipes')
}

const onDefaultPeopleChange = (value: number) => {
  nbPeople.value = value;
  if (recipe.value?.defaultNbPeople) {
    delta.value = nbPeople.value / recipe.value?.defaultNbPeople
  }
}

</script>

<template>
  <UContainer class="flex justify-between pt-3 z-40">
    <div>
      <UBreadcrumb :items="breadCrumbItems" />
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <ButtonSelectionNumberPeople :selected-number="nbPeople" @change="onDefaultPeopleChange" />
      <ButtonRecipeFavorite :id="String(recipe?._id)" :is-favorite="recipe?.isFavorite || false" variant="outline"
        @change="makeFavoriteCallback" />
      <ButtonRecipeDownload :id="String(recipe?._id)" :title="recipe?.title || 'unknown'" variant="outline" />
      <ButtonRecipeEdit :id="String(recipe?._id)" variant="outline" />
      <ButtonRecipeDelete :id="String(recipe?._id)" :title="recipe?.title || ''" variant="outline"
        @on-delete="goBackCallBack" />
    </div>
  </UContainer>

  <UPage class="pb-28">
    <UContainer>
      <UPageHeader :title="formatStringToTitle(recipe?.title)" :description="recipe?.description"
        :headline="recipe?.category" class="pt-0" />
      <div class="px-28 pt-8 pb-10 space-y-8">
        <div v-if="recipe?.tips">
          <h1 class="text-2xl font-semibold pb-4">Conseils de préparation</h1>
          <div class="ml-2 text-lg">
            {{ recipe?.tips }}
          </div>
        </div>

        <div>
          <h1 class="text-2xl font-semibold pb-4">Ingrédients</h1>
          <ul class="ml-2 text-lg space-y-2">
            <li v-for="ingredient in recipe?.ingredients">
              <span v-if="ingredient.quantity === 0 && ingredient.unit === Unit.NONE">
                {{ formatStringToTitle(ingredient.name) }}.
              </span>
              <span
                v-else-if="ingredient.unit === Unit.CUP || ingredient.unit === Unit.HANDFUL || ingredient.unit === Unit.PINCH || ingredient.unit === Unit.TABLESPOON || ingredient.unit === Unit.TEASPOON || ingredient.unit === Unit.CAN">
                {{ ingredient.name }} : {{ ingredient.quantity * delta }} {{ ingredient.unit }}.
              </span>
              <span v-else>
                {{ ingredient.name }} : {{ ingredient.quantity * delta }}{{ ingredient.unit === Unit.NONE ? '' : ingredient.unit }}.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h1 class="text-2xl font-semibold pb-2">Étapes de préparation</h1>
          <ul class="flex flex-col min-w-0 space-y-2 ml-2 text-lg">
            <li v-for="(step, index) in recipe?.steps" :key="index" class="">
              <h2 class="text-lg font-semibold pt-2">
                Étape {{ index + 1 }}
              </h2>
              <div class="ml-12">
                {{ step }}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex justify-center">
        <div>
          <h1 class="text-3xl font-semibold text-success pb-6 text-center">Bon Appétit !</h1>
          <img v-if="recipe?._id" :src="'/api/recipes/' + recipe._id + '/image'"
            class="h-100 w-150 overflow-hidden rounded-lg object-cover" alt="Image de la recette" />
        </div>
      </div>

    </UContainer>
  </UPage>
</template>

<style scoped></style>