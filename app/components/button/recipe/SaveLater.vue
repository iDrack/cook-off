<script setup lang='ts'>
import type { RecipeCreatePayload } from '~/shared/models/RecipeCreatePayload';

const props = defineProps<{
    recipe: RecipeCreatePayload
}>();

const toast = useToast();
const saveDraft = async () => {
    try {
        console.log(props.recipe);
        if (props.recipe) {
            const recipe = props.recipe;
            recipe.isDraft = true;
            const res = $fetch(`/api/recipes`, {
                method: 'POST',
                body: recipe
            });
            console.log(res);
            toast.add({ title: "Enregistré", description: "Brouillon enregistré avec succès.", color: "info", icon: "i-lucide-info" });
        }
    } catch (error) {
        console.log(error);
        if (isNuxtError(error)) {
            toast.add({ title: "Erreur", description: error.message, color: "error", icon: "i-lucide-triangle-alert" });
        }
    }
}
</script>

<template>
    <UButton icon="i-lucide-file-clock" @click="saveDraft()" color="neutral" variant="subtle" :square="true" />
</template>

<style scoped></style>