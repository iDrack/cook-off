import { Recipe } from "../models/Recipe";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const recipe = await Recipe.create({
        title: body.tile,
        description: body.description,
        tips: body.tips,
        isDraft: body.isDraft,
        isFavorite: body.isFavorite,
        defaultNbPeople: body.defaultNbPeople,
        category: body.category,
        ingredients: body.ingredients,
        steps: body.steps,
    });

    return recipe;
});