<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';

type CategoryKey = keyof typeof Category

const emit = defineEmits<{
  change: [value: Category | undefined]
}>()

const props = defineProps<({
  selectedCategory: Category | undefined
})>()

const localValue = computed({
  get: () => props.selectedCategory || undefined,
  set: (value: Category | undefined) => emit('change', value)
})

const items = computed(() => {
  return [
    ...(Object.keys(Category) as CategoryKey[]).map((key) => ({
      label: Category[key],
      value: Category[key],
      icon: CategoryIcon[Category[key]]
    })),
    {
      label: "Aucune",
      value: undefined,
      icon: "i-lucide-ban"
    },
  ]
});

const selectedItem = computed(() => {
  if (localValue.value === undefined) {
    return undefined
  }
  return items.value.find(item => item.value === localValue.value)
});
</script>

<template>
  <USelectMenu class="w-36" v-model="localValue" :items="items" value-key="value" placeholder="Catégorie"
    :icon="selectedItem?.icon || 'i-lucide-menu'" :search-input="{
      placeholder: 'Chercher...',
      icon: 'i-lucide-search'
    }" />
</template>

<style scoped></style>