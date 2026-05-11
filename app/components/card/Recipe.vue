<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';

const isHover = ref(false)

const props = defineProps<{
  id: string,
  title: string,
  description: string,
  category: Category,
  isFavorite: boolean,
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
  <UCard class="w-full h-117 overflow-hidden" :variant="variant" @mouseenter="isHover = true"
    @mouseleave="isHover = false">
    <NuxtLink :to="page" class="block">
      <template #default>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UIcon :name="categoryIcon" class="size-5 text-success" />
            <span class="text-xl">{{ props.title }}</span>
          </div>

          <p class="line-clamp-2">
            {{ props.description }}
          </p>

          <div v-if="props.photoUrl && props.photoUrl !== ''" class="h-71 w-full overflow-hidden rounded-lg">
            <img :src="photoUrl" class="h-full w-full object-cover" />
          </div>

          <div v-else class="h-71 w-full rounded-lg bg-elevated flex items-center justify-center">
            <div class="flex flex-col items-center gap-2 text-muted">
              <UIcon name="i-lucide-image-off" class="size-8" />
              <span class="text-sm">Pas d'image disponible</span>
            </div>
          </div>
        </div>
      </template>
    </NuxtLink>
    <template #footer>
      <div class="flex justify-end gap-1">
        <div>
          <ButtonRecipeFavorite :id="props.id" :is-favorite="props.isFavorite" />
        </div>
        <div v-if="showEdit">
          <ButtonRecipeEdit :id="props.id" />
        </div>
        <div v-if="showDelete">
          <ButtonRecipeDelete :id="props.id" :title="props.title" />
        </div>
      </div>
    </template>
  </UCard>

</template>

<style scoped></style>