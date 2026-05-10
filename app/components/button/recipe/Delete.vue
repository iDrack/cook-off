<script setup lang='ts'>
const emit = defineEmits<{
    delete: []
}>()

const props = defineProps({
    id: String
});

const toast = useToast();
const recipeStore = useRecipeStore();
const deleteRecipe = async () => {
    const res = await recipeStore.deleteRecipe(String(props.id))
    toast.add({ title: "Recette supprimée avec succès", description: `${res} a été supprimé.`, color: "error", icon: "i-lucide-triangle-alert" });
    emit('delete');
}
</script>

<template>
    <UButton icon="i-lucide-trash-2" @click="deleteRecipe()" color="error" variant="subtle" :square="true" />
</template>

<style scoped></style>