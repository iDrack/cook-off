<script setup lang='ts'>
const props = defineProps<{
    id: string,
    isFavorite: boolean
}>();

const icon = computed(() => props.isFavorite ? "i-lucide-star" : "i-lucide-star-off")
const color = computed(() => props.isFavorite ? "warning" : "neutral")
const recipeStore = useRecipeStore();
const favoriteRecipe = async () => {
    const res = await recipeStore.makeRecipeFavorite(props.id);
}
</script>

<template>
    <UButton :icon="icon" @click="favoriteRecipe()" :color="color" variant="ghost" :square="true" />
</template>

<style scoped></style>