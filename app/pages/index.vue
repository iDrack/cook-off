<script setup lang='ts'>
const recipeStore = useRecipeStore();
await recipeStore.fetchRandomPick();
</script>
<template>
  <div>
    <UPageHero title="Votre propre librairie de recettes"
      description="Créez, parcourez et organisez vos recettes dans votre navigateur." :links="[{
        label: 'Parcourez vos recettes',
        to: '/recipes',
        icon: 'i-lucide-book-open-text',
        size: 'xl'
      }, {
        label: 'Créer une nouvelle recette',
        to: '/create-recipe',
        icon: 'i-lucide-pen',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]" />

    <UPageSection id="recipes"
      :title="!recipeStore.hasLoaded || recipeStore.isLoading ? '' : recipeStore.randomPick.length > 0 ? 'Trop de choix ? Pourquoi ne pas essayer ces recettes ?' : 'Vous n\'avez pas encore de recette enregistré !'">
      <div v-if="!recipeStore.hasLoaded || recipeStore.isLoading">

      </div>
      <div v-else-if="recipeStore.randomPick.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardRecipe v-for="(item, index) in recipeStore.randomPick" :key="index" :id="String(item._id)"
          :title="item.title" :description="item.description" :category="item.category" :photo-url="item.picturePath" :show-delete="false" :show-edit="true"/>
      </div>
      <div v-else>

      </div>
    </UPageSection>

    <div v-if="recipeStore.isLoading">

    </div>
    <div v-else>
      <div v-if="recipeStore.randomPick.length > 0">

      </div>
      <div v-else>
        <UPageSection id="recipes" title="Vous n'avez pas encore de recette enregistré !">
        </UPageSection>
      </div>
    </div>
  </div>
</template>
