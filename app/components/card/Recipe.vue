<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';

const isHover = ref(false)

const props = defineProps<{
  id: string,
  title: string,
  description: string,
  category: Category,
  photoUrl?: string,
  showDelete: boolean,
  showEdit: boolean,
}>();

const categoryIcon = computed(() => CategoryIcon[props.category]);
const page = computed(() => `/recipes/${props.id}`)
const variant = computed(() => isHover.value ? 'subtle' : 'outline')
/**
 * TODO: ajouter un bouton avec un lien permettant de modifier la recette
 */
</script>

<template>
  <NuxtLink :to="page" class="block" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <UCard class="w-full h-105 overflow-hidden" :variant="variant">
      <template #title>
        <div class="flex items-center gap-2">
          <UIcon :name="categoryIcon" class="size-5 text-success" />
          <span class="text-xl">{{ props.title }}</span>
        </div>
      </template>
      <template #description>
        <p class="line-clamp-2">
          {{ props.description }}
        </p>
      </template>
      <div v-if="props.photoUrl && props.photoUrl !== ''" class="h-71 w-full overflow-hidden rounded-lg">
        <img :src="photoUrl" class="h-full w-full object-cover" />
      </div>
      <div v-else class="h-56 w-full flex items-center justify-center">
        <h2>Pas d'image disponible.</h2>
      </div>
    </UCard>
  </NuxtLink>

</template>

<style scoped></style>