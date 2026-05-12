<script setup lang='ts'>
const props = defineProps<{
    id: String,
    variant: "ghost" | "outline",
}>();

const downloadRecipe = async () => {

}
</script>

<template>
    <UButton icon="i-lucide-download" @click="downloadRecipe()" color="neutral" :variant="props.variant" :square="true" />
</template>

<style scoped></style>