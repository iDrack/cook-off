<script setup lang='ts'>
import { boolean } from 'valibot';

const props = defineProps<{
  id: string,
  isFavorite: boolean,
  variant: 'ghost' | 'outline'
}>();

const emit = defineEmits<{
  "onChange": [value: boolean],
}>()

const icon = computed(() => props.isFavorite ? "i-lucide-star" : "i-lucide-star-off")
const color = computed(() => props.isFavorite ? "warning" : "neutral")
const recipeStore = useRecipeStore();
const favoriteRecipe = async () => {
  try {
    const res = await recipeStore.makeRecipeFavorite(props.id);
    emit("onChange", true);
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <UButton :icon="icon" @click="favoriteRecipe()" :color="color" :variant="props.variant" :square="true" />
</template>

<style scoped></style>