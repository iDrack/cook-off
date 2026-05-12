<script setup lang='ts'>

const props = defineProps({
  id: String,
  title: String,
});

const open = ref(false)

const toast = useToast();
const recipeStore = useRecipeStore();
const deleteRecipe = async () => {
  const res = await recipeStore.deleteRecipe(String(props.id))
  open.value = false
  toast.add({ title: "Recette supprimée", description: `${res} a été supprimé.`, color: "error", icon: "i-lucide-triangle-alert" });
}

</script>

<template>

  <UModal v-model:open="open" title="Supprimer la recette ?" :close="{
    color: 'neutral',
    variant: 'ghost',
    icon: 'i-lucide-x'
  }">
    <UButton icon="i-lucide-trash-2" color="error" variant="ghost" :square="true" />

    <template #body>
      <div>
        <div>
          Voulez-vous vraiment supprimer "{{ props.title }}" ?
        </div>
        <div>
          Cette action est irreversible.
        </div>
        <div class="flex gap-2 justify-end">
          <UButton label="Non" @click="open = false" color="neutral" variant="outline" />
          <UButton label="Oui" @click="deleteRecipe()" color="error" variant="solid" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>