<template>
  <div>
    <UPageHero
      title="Votre propre librairie de recettes"
      description="Créez, parcourez et organisez vos recettes dans votre navigateur."
      :links="[{
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
      }]"
    />

    <UPageSection
      id="recipes"
      title="Trop de choix ? Pourquoi ne pas essayer ces recettes ?"
    >
    </UPageSection>
  </div>
</template>
