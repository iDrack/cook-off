<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';

type CategoryKey = keyof typeof Category

const emit = defineEmits<{
    change: [value: Category]
}>()

const props = defineProps<({
    selectedCategory: Category
})>()

const localValue = computed({
    get: () => props.selectedCategory || null,
    set: (value: Category) => emit('change', value)
})

const items = computed(() =>
    (Object.keys(Category) as CategoryKey[]).map((key) => ({
        label: Category[key],
        value: Category[key],
        icon: CategoryIcon[Category[key]]
    })));


const selectedItem = computed(() => items.value.find(item => item.value === localValue.value));
</script>

<template>
    <USelectMenu class="w-32" v-model="localValue" :items="items" value-key="value" placeholder="Catégorie"
        :icon="selectedItem?.icon || 'i-lucide-menu'" :search-input="{
            placeholder: 'Chercher...',
            icon: 'i-lucide-search'
        }" />
</template>

<style scoped></style>