<script setup lang='ts'>

const emit = defineEmits<{
    change: [value: number]
}>()

const props = defineProps({
    selectedNumber: Number
})

const localValue = computed({
    get: () => props.selectedNumber,
    set: (value: number) => emit('change', value)
})

const items = computed(() => {
    const ret = []
    for (let i = 1; i < 11; i++) {
        ret.push({
            label: `Pour ${i}`,
            value: i,
            icon: 'i-lucide-users'
        });
    }
    return ret;
});
</script>

<template>
    <USelectMenu v-model="localValue" :items="items" value-key="value" placeholder="Pour: ?" :icon="'i-lucide-users'"
        :search-input="{
            placeholder: 'Chercher...',
            icon: 'i-lucide-search'
        }" />
</template>

<style scoped></style>