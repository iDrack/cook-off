<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { Unit } from '~/shared/models/Unit';
import type { RecipeCreatePayload } from '~/shared/models/RecipeCreatePayload';
import * as v from "valibot";
import type { RecipeDocument } from '~~/server/models/Recipe';

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
});

// Ingredients
const newIngredient = ref<{
  name: string,
  quantity: number,
  unit: Unit
}>({
  name: "",
  quantity: 0,
  unit: Unit.NONE
});

const ingredientItems = computed(() =>
  Object.values(Unit).map((unit) => ({
    label: unit,
    value: unit
  }))
)

const addNewIngredient = () => {
  if (newIngredient.value.name === "") {
    toast.add({ title: "Erreur", description: "Un ingrédient ne peut pas être vide.", color: "info", icon: "i-lucide-info" })
  } else if (newIngredient.value.quantity <= 0) {
    toast.add({ title: "Erreur", description: "Un ingrédient doit avoir une quatité positif", color: "info", icon: "i-lucide-info" })
  } else {
    recipe.value.ingredients.push(newIngredient.value);
    newIngredient.value = {
      name: "",
      quantity: 0,
      unit: Unit.NONE
    }
  }
}
// Steps
const newStep = ref("");

const addNewStep = () => {
  if (newStep.value === "") {
    toast.add({ title: "Erreur", description: "Une étape ne peut pas être vide.", color: "info", icon: "i-lucide-info" })
  } else {
    recipe.value.steps.push(newStep.value);
    newStep.value = "";
  }
}

// Recipe
const sendRecipe = async () => {
  try {
    if (newIngredient.value.name !== "" && newIngredient.value.quantity > 0) {
      addNewIngredient()
    }

    if (newStep.value !== "") {
      addNewStep()
    }

    if (!recipe.value.title.trim()) {
      toast.add({ title: 'Erreur', description: 'Le titre est obligatoire.', color: 'error' })
      return
    }

    if (!recipe.value.description.trim()) {
      toast.add({ title: 'Erreur', description: 'La description est obligatoire.', color: 'error' })
      return
    }

    const res = await $fetch<RecipeDocument>(`/api/recipes`, {
      method: 'POST',
      body: recipe.value
    });

    if (res) {      
      toast.add({ title: "Recette enregistrée.", description: `La recette "${res.title}" a été enregistré avec succès.`, color: "success", icon: "i-lucide-check" });
      //TODO: Enchainer avec l'ajout de photo
      clearRecipe(false);
    }
  } catch (error) {
    if (isNuxtError(error)) {
      toast.add({ title: "Erreur", description: error.message, color: "info", icon: "i-lucide-triangle-alert" });
    }
  }
}

//Category
const onCategoryChange = (value: Category) => {
  recipe.value.category = value;
}

//Nb People
const onDefaultPeopleChange = (value: number) => {
  recipe.value.defaultNbPeople = value
}

//Clear recipe
const clearRecipe = (showMsg: boolean) => {
  newStep.value = "";
  newIngredient.value = {
    name: "",
    quantity: 0,
    unit: Unit.NONE
  }
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
  if (showMsg) toast.add({ title: "Supprimé", description: "La recette a été remise à zéro.", color: "info", icon: "i-lucide-info" })
}


//Photo management
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
            <UButton icon="i-lucide-eraser" @click="clearRecipe(true)" color="error" variant="subtle" :square="true" />
          </div>
        </div>
      </div>
    </div>
    <!--Description-->
    <div class="w-full flex gap-4">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Description</h1>
        <UTextarea class="w-full" v-model="recipe.description" :rows="6"
          placeholder="Écrivez une petite description pour votre recette." />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Conseils de préparation</h1>
        <UTextarea class="w-full" v-model="recipe.tips" :rows="6" placeholder="Vos conseils de préparations." />
      </div>
    </div>
    <!--Ingredients-->
    <div class="w-full flex gap-4 justify-between">
      <!--List-->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Ingrédients</h1>
        <ul class="flex flex-col min-w-0 space-y-2">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index"
            class="grid grid-cols-[minmax(0,1fr)_8rem_10rem] items-center gap-2">
            <UInput v-model="ingredient.name" />
            <UInputNumber v-model="ingredient.quantity" :min="0" />
            <USelectMenu v-model="ingredient.unit" :items="ingredientItems" value-key="value" placeholder="Unité" />
          </li>
          <li class="grid grid-cols-[minmax(0,1fr)_8rem_10rem] items-center gap-2">
            <UInput v-model="newIngredient.name" />
            <UInputNumber v-model="newIngredient.quantity" :min="0" />
            <USelectMenu v-model="newIngredient.unit" :items="ingredientItems" value-key="value" placeholder="Unité" />
          </li>
          <UButton label="Ajouter" icon="i-lucide-plus" color="neutral" variant="subtle" @click="addNewIngredient"
            class="justify-center text-center" />
        </ul>
      </div>
      <!--Picture-->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-semibold pb-2">Photo</h1>
        <UFileUpload :dropzone="true" v-model="fileUploadState.file" label="Ajouter une photo à votre recette"
          size="xl" />
      </div>
    </div>
    <!--Steps-->
    <div class="w-150">
      <h1 class="text-2xl font-semibold pb-2">Étapes de préparation</h1>
      <ul class="flex flex-col min-w-0 space-y-2">
        <li v-for="(step, index) in recipe.steps" :key="index" class="grid grid-cols-[2rem_1fr] items-center gap-3">
          <div class="text-right tabular-nums">
            {{ index + 1 }}.
          </div>
          <UTextarea v-model="recipe.steps[index]" class="w-full" :rows="1" />
        </li>
        <li>
          <UTextarea v-model="newStep" placeholder="Nouvelle étape" class="flex min-w-0" />
        </li>
        <UButton label="Ajouter" icon="i-lucide-plus" color="neutral" variant="subtle" @click="addNewStep"
          class="justify-center text-center" />
      </ul>
    </div>
    <!--Save Button-->
    <div class="flex flex-1 justify-center">
      <UButton label="Enregistrer" icon="i-lucide-save" @click="sendRecipe" />
    </div>
  </UPageSection>
</template>

<style scoped></style>