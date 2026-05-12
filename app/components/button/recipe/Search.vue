<script setup lang='ts'>
const recipeStore = useRecipeStore();
const input = useTemplateRef('input')

defineShortcuts({
  '/': () => {
    input.value?.inputRef?.focus()
  }
})

const onSubmit = async () => {
  recipeStore.fetchRecipes();
}

const clear = async () => {
  recipeStore.searchQuery = ""
  recipeStore.fetchRecipes();
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UInput 
      ref="input" 
      placeholder="Rechercher..." 
      icon="i-lucide-search"
      :loading="recipeStore.isLoading"
      loading-icon="i-lucide-loader"
      v-model="recipeStore.searchQuery"
      :ui="{ base: 'pe-9', trailing: 'pe-1' }"
      @keydown.enter="onSubmit"
      class="w-80">
      <template v-if="recipeStore.searchQuery?.length" #trailing>
        <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Supprimer"
          @click="clear" />
      </template>
      <template #trailing v-else>
        <UKbd value="/" />
      </template>
    </UInput>
  </form>

</template>

<style scoped></style>