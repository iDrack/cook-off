<script setup lang='ts'>
import { boolean } from 'valibot';

const props = defineProps<{
  id: string,
  isFavorite: boolean,
  variant: 'ghost' | 'outline'
}>();

const icon = computed(() => props.isFavorite ? "i-lucide-star" : "i-lucide-star-off")
const color = computed(() => props.isFavorite ? "warning" : "neutral")
const recipeStore = useRecipeStore();

//Emit new isFavorite value
const favoriteRecipe = async () => {
  try {
    const res = await recipeStore.makeRecipeFavorite(props.id);
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <UButton :icon="icon" @click="favoriteRecipe()" :color="color" :variant="props.variant" :square="true" />
</template>

<style scoped></style>