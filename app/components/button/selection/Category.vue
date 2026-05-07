<script setup lang='ts'>
import { Category } from '~/shared/models/Category';
import { CategoryIcon } from '~/shared/models/CategoryIcon';

type CategoryKey = keyof typeof Category

const emit = defineEmits<{
    change: [value: Category]
}>()

const items = computed(() =>
    (Object.keys(Category) as CategoryKey[]).map((key) => ({
        label: Category[key],
        value: Category[key],
        icon: CategoryIcon[key]
    })));

const selected = ref<Category | undefined>(undefined)

    const selectedItem =computed(() => items.value.find(item => item.value === selected.value))

watch(selected, (value) => {
    if (value) {
        emit('change', value)
    }
});
</script>

<template>
    <USelectMenu 
        v-model="selected" 
        :items="items" 
        value-key="value" 
        placeholder="Catégorie" 
        :icon="selectedItem?.icon || 'i-lucide-menu'"
        :search-input="{
        placeholder: 'Chercher...',
        icon: 'i-lucide-search'


    }" />
</template>

<style scoped></style>