<script setup lang='ts'>
const props = defineProps({
    id: Number
});

const toast = useToast();
const deleteRecipe = async () => {
    console.log(props.id);
    //TODO: add route for recipe deletion by id
    toast.add({ title: "Supprimée", description: "Recette supprimée avec succès.", color: "error", icon: "i-lucide-triangle-alert" });
}
</script>

<template>
    <UButton icon="i-lucide-trash-2" @click="deleteRecipe()" color="error" variant="subtle" :square="true" />
</template>

<style scoped></style>