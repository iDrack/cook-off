export type RecipeCreatePayload = Omit<
    RecipeDocument,
    'picturePath' | 'createdDate' | 'updatedDate'
>