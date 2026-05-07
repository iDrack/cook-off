<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import type { RecipeCreatePayload } from '~/shared/models/RecipeCreatePayload';
import * as v from "valibot";

const toast = useToast();

const recipe = ref<RecipeCreatePayload>({
  title: '',
  description: '',
  tips: '',
  isDraft: false,
  isFavorite: false,
  defaultNbPeople: 1,
  category: Category.DISH,
  ingredients: [],
  steps: [],
})

const sendRecipe = async () => {
  console.log(recipe);
  
/*   const res = $fetch(`/api/recipes`, {
    method: 'POST',
    body: recipe.value
  });

  console.log(res); */
}

const onCategoryChange = (value: Category) => {
  recipe.value.category = value;
  console.log(recipe.value);
}

const onDefaultPeopleChange = (value: number) => {
  recipe.value.defaultNbPeople = value
  console.log(recipe.value);
}

const clearRecipe = () => {
  recipe.value = {
    title: '',
    description: '',
    tips: '',
    isDraft: false,
    isFavorite: false,
    defaultNbPeople: 1,
    category: Category.DISH,
    ingredients: [],
    steps: [],
  }
  toast.add({ title: "Supprimé", description: "La recette a été remise à zéro.", color: "info", icon: "i-lucide-info" })
}

/**
 * Photo management
 */

const fileUploadSchema = v.object({
  file: v.pipe(
    v.file()
  )
});

type FileUploadSchema = v.InferOutput<typeof fileUploadSchema>

const fileUploadState = reactive<Partial<FileUploadSchema>>({
  file: undefined
});
</script>

<template>
  <UPageSection>
    <!--Title-->
    <div class="w-full">
      <h1 class="text-2xl font-semibold pb-2">Information sur le recette.</h1>
      <div class="flex flex-1 justify-between">
        <UInput class="w-150" v-model="recipe.title" placeholder="Nom de la recette" />
        <div class="flex flex-1 space-x-5 justify-end">
          <div class="space-x-5">
            <ButtonSelectionCategory :selected-category="recipe.category" @change="onCategoryChange" />
            <ButtonSelectionNumberPeople :selected-number="recipe.defaultNbPeople" @change="onDefaultPeopleChange" />
          </div>
          <div class="space-x-2">
            <ButtonRecipeSaveLater :recipe="recipe" />
            <UButton icon="i-lucide-eraser" @click="clearRecipe()" color="error" variant="subtle" :square="true" />
          </div>
        </div>
      </div>
    </div>
    <!--Description-->
    <div class="w-full flex gap-4">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Description</h1>
        <UTextarea class="w-full" v-model="recipe.description"
          placeholder="Écrivez une petite description pour votre recette." />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Conseils de préparation</h1>
        <UTextarea class="w-full" v-model="recipe.tips" placeholder="Vos conseils de préparations." />
      </div>
    </div>
    <!--Ingredients-->
    <div class="w-full flex gap-4 justify-between">
      <!--List-->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Ingrédients</h1>
      </div>
      <!--Picture-->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Photo</h1>
            <UFileUpload :dropzone="true" v-model="fileUploadState.file" label="Ajouter une photo à votre recette" size="xl"/>
      </div>
    </div>
    <!--Steps-->
    <div>
      <h1 class="text-2xl font-semibold pb-2">Étapes de préparation</h1>
      <ul>
        <li>

        </li>
      </ul>
    </div>
    <!--Save Button-->
    <div class="flex flex-1 justify-center">
      <UButton label="Enregistrer" icon="i-lucide-save" color="success" @click="sendRecipe"/>
    </div>
  </UPageSection>
</template>

<style scoped></style>