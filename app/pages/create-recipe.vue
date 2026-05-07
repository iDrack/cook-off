<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import type { RecipeCreatePayload } from '~/shared/models/RecipeCreatePayload';

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
    const res = $fetch(`/api/recipes`, {
        method: 'POST',
        body: recipe.value
    });

    console.log(res);
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
</script>

<template>
    <UPageSection>
        <div class="w-full">
            <h1 class="text-2xl font-semibold pb-2">Information sur le recette.</h1>
            <div class="flex flex-1 justify-between">
                <UInput class="w-150" v-model="recipe.title" placeholder="Nom de la recette" />
                <div class="flex flex-1 space-x-5 justify-end">
                    <div class="space-x-5">
                        <ButtonSelectionCategory :selected-category="recipe.category" @change="onCategoryChange" />
                        <ButtonSelectionNumberPeople :selected-number="recipe.defaultNbPeople"
                            @change="onDefaultPeopleChange" />
                    </div>
                    <div class="space-x-2">
                        <ButtonRecipeSaveLater :recipe="recipe" />
                        <UButton icon="i-lucide-eraser" @click="clearRecipe()" color="error" variant="subtle"
                            :square="true" />
                    </div>
                </div>
            </div>
        </div>
    </UPageSection>
</template>

<style scoped></style>