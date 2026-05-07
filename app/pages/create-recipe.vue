<script setup lang='ts'>
import { Category } from '~/shared/models/Category';

type RecipeCreatePayload = Omit<
    RecipeDocument,
    'picturePath' | 'createdDate' | 'updatedDate'
>

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
    console.log(value);
}
</script>

<template>
    <UPageSection>
        test
    <ButtonSelectionCategory @change="onCategoryChange"/>
    </UPageSection>
</template>

<style scoped></style>