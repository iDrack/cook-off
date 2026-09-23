import {beforeEach, describe, expect, it, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useRecipeStore} from "../../../app/stores/recipe.store";

describe('useRecipeStore - makeRecipeFavorite', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  //makeRecipeFavorite

  it('devrait ajouter une recette aux favoris puis recharger la liste', async () => {
    const favoriteResponse = {
      _id: "recipe-1",
      title: 'Tarte aux pommes',
      isFavorite: true
    }

    const recipesResponse = {
      metadata: {
        page: 1,
        totalPages: 1,
        limit: 24,
        totalItems: 1,
        prevPage: null,
        nextPage: null
      },
      data: [{
        _id: "recipe-1",
        title: 'Tarte aux pommes',
        isFavorite: true
      }]
    }

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(favoriteResponse)
      .mockResolvedValueOnce(recipesResponse)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const result = await store.makeRecipeFavorite('recipe-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/recipe-1/favorite',
      {
        method: "PUT"
      }
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/recipes',
      {
        method: 'GET',
        query: {
          page: 1,
          s: '',
          sort: '',
          dir: 'dsc',
          c: '',
          f: false,
          d: false
        }
      }
    )

    expect(result).toEqual(favoriteResponse)
    expect(store.recipes).toEqual(recipesResponse.data)
    expect(store.totalItems).toBe(1)

  })

  it("devrait propage l'erreur si la modification échoue", async () => {
    const error = new Error("Impossible de modifier le favori")

    const fetchMock = vi.fn().mockRejectedValueOnce(error)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await expect(
      store.makeRecipeFavorite('recipe-1')
    ).rejects.toThrow('Impossible de modifier le favori')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recipes/recipe-1/favorite',
      {
        method: 'PUT'
      }
    )
  });
})
