<script setup lang='ts'>
const props = defineProps<{
    id: String,
    variant: "ghost" | "outline",
}>();

const editRecipe = async () => {

}
</script>

<template>
    <UButton icon="i-lucide-pen" @click="editRecipe()" color="neutral" :variant="props.variant" :square="true" />
</template>

<style scoped></style>