<script setup lang='ts'>
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <h1 class="text-lg font-bold">Cook Off</h1>
      </NuxtLink>
    </template>
    <HeaderNavigationDefault/>
    <template #right>
      <UButton
        to="/"
        icon="i-lucide-search"
        aria-label="Rechercher"
        color="neutral"
        variant="ghost"
      />

      <UColorModeButton />

      <UButton
        to="https://github.com/iDrack/cook-off"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <USeparator icon="i-simple-icons-nuxtdotjs" />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Built with Nuxt UI • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="https://nuxt.com"
        target="_blank"
        label="Nuxt"
        leading-icon="i-simple-icons-nuxt"
        aria-label="Nuxt"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://github.com/nuxt-ui-templates/starter"
        target="_blank"
        label="Template"
        leading-icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>

<style scoped></style>
