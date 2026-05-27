<script setup lang='ts'>
const props = defineProps<{
  id: string,
  title: string,
  variant: "ghost" | "outline",
}>();

const recipeStore = useRecipeStore()
const toast = useToast();

const downloadRecipe = async () => {
  if (props.id) {
    try {
      const pdfBlob = await $fetch<Blob>(`/api/recipes/${props.id}/pdf`, {
        method: 'GET',
        responseType: 'blob'
      });

      const tempUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = tempUrl;
      link.download = props.title === 'unknown' ? `recette-${props.id}.pdf` : `${props.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(tempUrl);

    } catch (error) {
      if (isNuxtError(error)) {
        toast.add({ title: "Erreur", description: error.message, color: "error", icon: "i-lucide-triangle-alert" });
      } else {
        toast.add({ title: "Erreur", description: "Réessayer plus tard, une erreur a survenu.", color: "error", icon: "i-lucide-triangle-alert" });

      }
      console.log(error);
    }
  }
}
</script>

<template>
  <UButton icon="i-lucide-download" @click="downloadRecipe()" color="neutral" :variant="props.variant" :square="true" />
</template>

<style scoped></style>