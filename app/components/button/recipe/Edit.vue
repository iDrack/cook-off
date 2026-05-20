<script setup lang='ts'>
const props = defineProps<{
  id: String,
  variant: "ghost" | "outline",
}>();

const editRecipe = async () => {
  await navigateTo({
    path: '/create-recipe',
    query: {
      recipeId: String(props.id),
      mode: "edit"
    }
  })
}
</script>

<template>
  <UButton icon="i-lucide-pen-line" @click="editRecipe()" color="neutral" :variant="props.variant" :square="true" />
</template>

<style scoped></style>