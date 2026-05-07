<script setup lang='ts'>
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const props = withDefaults(defineProps<{
    orientation?: "horizontal" | "vertical" | undefined
}>(),{
    orientation: 'horizontal'
});

const items = computed<NavigationMenuItem[]>(() => [
        {
        label: "Accueil",
        to: '/',
        active: route.path === '/'
    },
        {
        label: "Recettes",
        to: '/recipes',
        active: route.path === '/recipes'
    },
        {
        label: "Nouvelle recette",
        icon: 'i-lucide-plus',
        to: '/create-recipe',
        active: route.path === '/create-recipe'
    },
])
</script>

<template>
    <UNavigationMenu :items="items" :orientation="orientation"/>
</template>

<style scoped>
</style>