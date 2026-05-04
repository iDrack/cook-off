import { Recipe } from "~~/server/models/Recipe";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");

    if(!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Recipe id is required.'
        })
    }

    const recipe = await Recipe.findById(id);

    if(!recipe) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Recipe not found!'
        });
    }

    return recipe;
});