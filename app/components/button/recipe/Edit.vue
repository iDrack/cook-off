<script setup lang='ts'>
const props = defineProps({
    id: String,
});

const editRecipe = async () => {

}
</script>

<template>
    <UButton icon="i-lucide-pen" @click="editRecipe()" color="neutral" variant="ghost" :square="true" />
</template>

<style scoped></style>