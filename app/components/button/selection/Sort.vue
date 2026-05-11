<script setup lang='ts'>
import { SortField } from '~/shared/models/SortField';
import type { SortInfo } from '~/shared/models/SortInfo';

type SortOption = {
  label: string
  value: SortInfo | undefined
  icon: string
}

const emit = defineEmits<{
  change: [value: SortInfo | undefined]
}>()

const props = defineProps<({
  selectedSort: SortInfo | undefined
})>()

const localValue = computed({
  get: () => props.selectedSort || undefined,
  set: (value: SortInfo | undefined) => emit('change', value)
})

const items = computed<SortOption[]>(() => {
  return [
    {
      label: "Les plus ancients",
      value: {
        type: SortField.createdDate,
        direction: "dsc"
      },
      icon: "i-lucide-arrow-down-0-1"
    },
    {
      label: "Les plus récents",
      value: {
        type: SortField.createdDate,
        direction: "asc"
      },
      icon: "i-lucide-arrow-up-0-1"
    },
    {
      label: "Modification récentes",
      value: {
        type: SortField.updatedDate,
        direction: "asc"
      },
      icon: "i-lucide-arrow-down-0-1"
    },
    {
      label: "Premiers modifiés",
      value: {
        type: SortField.updatedDate,
        direction: "dsc"
      },
      icon: "i-lucide-arrow-up-0-1"
    },
    {
      label: "Titre: A-Z",
      value: {
        type: SortField.title,
        direction: "dsc"
      },
      icon: "i-lucide-arrow-down-a-z"
    },
    {
      label: "Titre: Z-A",
      value: {
        type: SortField.title,
        direction: "asc"
      },
      icon: "i-lucide-arrow-down-z-a"
    },
    {
      label: "Supprimer",
      value: undefined,
      icon: "i-lucide-rotate-ccw"
    },
  ]
});

const selectedItem = computed(() =>
  items.value.find(
    item =>
      item.value && item.value.type === localValue.value?.type &&
      item.value.direction === localValue.value?.direction
  )
)
</script>

<template>
  <USelectMenu class="w-49" v-model="localValue" :items="items" value-key="value" placeholder="Trier"
    :icon="selectedItem?.icon || 'i-lucide-arrow-down-narrow-wide'" :search-input="{
      placeholder: 'Trier par...',
      icon: 'i-lucide-search'
    }" />
</template>

<style scoped></style>