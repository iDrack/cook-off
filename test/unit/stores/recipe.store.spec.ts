import {beforeEach, describe, expect, it, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useRecipeStore} from "../../../app/stores/recipe.store";

describe('useRecipeStore - fetchRandomPick', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  const recipes = [{
    _id: "recipe-1",
    title: 'Tarte aux pommes',
    isFavorite: false
  }, {
    _id: "recipe-2",
    title: 'Cookies',
    isFavorite: false
  }, {
    _id: "recipe-3",
    title: 'Ratatouille',
    isFavorite: false
  }, {
    _id: "recipe-4",
    title: 'Quiche Lorraine',
    isFavorite: false
  }]

  it('devrait mettre à jour la liste randomPick après être appelé', async () => {
    const randomRecipes = [
      {_id: 'recipe-3', title: 'Cookies'},
      {_id: 'recipe-7', title: 'Lasagnes'}
    ]

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({data: randomRecipes})

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    await store.fetchRandomPick()

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/random',
      {
        method: "GET"
      }
    )
    expect(store.randomPick).toEqual(randomRecipes)
    expect(store.isLoading).toBe(false)
    expect(store.hasLoaded).toBe(true)
  });

  it("devrait remettre la valeur de isLoading a faux après être appelé", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({data: recipes})

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    await store.fetchRandomPick()

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/random',
      {
        method: "GET"
      }
    )

    expect(store.isLoading).toEqual(false)
  })

  it("devrait mettre la valeur de hasLoaded a vrai après être appelé", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({data: recipes})

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const initialHasLoaded = store.hasloaded;

    await store.fetchRandomPick()

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/random',
      {
        method: "GET"
      }
    )

    expect(store.hasLoaded).toEqual(true)
    expect(store.hasLoaded).not.toEqual(initialHasLoaded)
  })

  it('ne devrait pas modifier randomPick si la réponse ne contient pas de data', async () => {
    const initialPick = [{_id: 'recipe-1', title: 'Tarte'}]

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({data: initialPick})
      .mockResolvedValueOnce({data: null})
    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await store.fetchRandomPick()
    await store.fetchRandomPick()

    expect(store.randomPick).toEqual(initialPick)
    expect(store.hasLoaded).toBe(true)
  })

  it("devrait propager l'erreur si fetchRandomPick échoue", async () => {
  vi.stubGlobal('$fetch', vi.fn().mockRejectedValueOnce(new Error('Erreur serveur')))

  const store = useRecipeStore()
  await expect(store.fetchRandomPick()).rejects.toThrow('Erreur serveur')

  expect(store.isLoading).toBe(false)
  expect(store.hasLoaded).toBe(true)
})
})

describe('useRecipeStore - fetchRecipeById', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it("devrait retourner une recette selon l'id en paramètre", async () => {
    const recipe = {
      _id: "recipe-1",
      title: 'Tarte aux pommes',
      isFavorite: false
    }

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(recipe)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const result = await store.fetchRecipeById('recipe-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/recipe-1',
      {
        method: "GET"
      }
    )

    expect(result).toEqual(recipe)
  })

  it("devrait remettre la valeur de isLoading a faux après être appelé", async () => {
    const recipe = {
      _id: "recipe-1",
      title: 'Tarte aux pommes',
      isFavorite: false
    }

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(recipe)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const result = await store.fetchRecipeById('recipe-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/recipe-1',
      {
        method: "GET"
      }
    )

    expect(store.isLoading).toEqual(false)
  })

  it("devrait propager l'erreur si l'appel échoue", async () => {
    const error = new Error("La recette demandée n'éxiste pas")

    const fetchMock = vi.fn().mockRejectedValueOnce(error)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await expect(
      store.fetchRecipeById('recipe-1')
    ).rejects.toThrow("La recette demandée n'éxiste pas")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recipes/recipe-1',
      {
        method: 'GET'
      }
    )
    expect(store.isLoading).toEqual(false)
  });
})

describe('useRecipeStore - makeRecipeFavorite', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

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
      },
        {
          _id: "recipe-2",
          title: 'Cookies',
          isFavorite: false
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

  it("devrait propage l'erreur si la modification de favoris échoue", async () => {
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

  it("ne devrait pas recharger la liste si la mise en favoris échoue", async () => {
    const initialRecipes = [
      {_id: 'recipe-1', title: 'Tarte aux pommes', isFavorite: false},
      {_id: 'recipe-2', title: 'Cookies', isFavorite: false}
    ]

    const initialResponse = {
      metadata: {
        page: 1,
        totalPages: 1,
        limit: 24,
        totalItems: 2,
        prevPage: null,
        nextPage: null
      },
      data: initialRecipes
    }

    const error = new Error('Impossible de modifier le favori')

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(initialResponse) // fetchRecipes initial
      .mockRejectedValueOnce(error)           // PUT en échec

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await store.fetchRecipes()
    fetchMock.mockClear()

    fetchMock.mockRejectedValueOnce(error)

    await expect(store.makeRecipeFavorite('recipe-1')).rejects.toThrow('Impossible de modifier le favori')

    // Seul le DELETE a été appelé
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/recipes/recipe-1/favorite', {method: 'PUT'})

    // Récupère les appels GET /api/recipes et vérifie que la liste est vide
    const getRecipesCalls = fetchMock.mock.calls.filter(
      ([url, options]) => url === '/api/recipes' && options?.method === 'GET'
    )
    expect(getRecipesCalls).toHaveLength(0)

    // Vérifie que la liste n'a pas changé
    expect(store.recipes).toEqual(initialRecipes)
  })
})

describe('useRecipeStore - deleteRecipe', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('devrait supprimer une recette selon son id et retourner son titre ', async () => {
    const recipes = [{
      _id: "recipe-1",
      title: 'Tarte aux pommes',
      isFavorite: true
    },
      {
        _id: "recipe-2",
        title: 'Cookies',
        isFavorite: false
      }]

    const recipesResponse = {
      metadata: {
        page: 1,
        totalPages: 1,
        limit: 24,
        totalItems: 1,
        prevPage: null,
        nextPage: null
      },
      data: recipes
    }

    const titleResponse = "Tarte aux pommes"

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(titleResponse)
      .mockResolvedValueOnce(recipesResponse)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const result = await store.deleteRecipe('recipe-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/recipe-1',
      {
        method: "DELETE"
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

    expect(result).toEqual(titleResponse)
    expect(store.recipes).toEqual(recipesResponse.data)
  });

  it('devrait remettre la valeur de isLoading a faux après une suppression', async () => {
    const recipesResponse = {
      metadata: {
        page: 1,
        totalPages: 1,
        limit: 24,
        totalItems: 1,
        prevPage: null,
        nextPage: null
      },
      data: []
    }

    const fetchMock = vi.fn()
      .mockResolvedValueOnce("Tarte aux pommes")
      .mockResolvedValueOnce(recipesResponse)


    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()

    const result = await store.deleteRecipe('recipe-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/recipe-1',
      {
        method: "DELETE"
      }
    )

    expect(store.isLoading).equal(false)
  });

  it("devrait propager l'erreur si la suppression échoue", async () => {
    const error = new Error("La recette n'éxiste pas")

    const fetchMock = vi.fn().mockRejectedValueOnce(error)

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await expect(
      store.deleteRecipe('recipe-1')
    ).rejects.toThrow("La recette n'éxiste pas")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recipes/recipe-1',
      {
        method: 'DELETE'
      }
    )
  });

  it("ne devrait pas recharger la liste si la suppression échoue", async () => {
    const initialRecipes = [
      {_id: 'recipe-1', title: 'Tarte aux pommes', isFavorite: true},
      {_id: 'recipe-2', title: 'Cookies', isFavorite: false}
    ]

    const initialResponse = {
      metadata: {
        page: 1,
        totalPages: 1,
        limit: 24,
        totalItems: 2,
        prevPage: null,
        nextPage: null
      },
      data: initialRecipes
    }

    const error = new Error("La recette n'existe pas")

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(initialResponse) // fetchRecipes initial
      .mockRejectedValueOnce(error)           // DELETE en échec

    vi.stubGlobal('$fetch', fetchMock)

    const store = useRecipeStore()
    await store.fetchRecipes()
    fetchMock.mockClear()

    fetchMock.mockRejectedValueOnce(error)

    await expect(store.deleteRecipe('recipe-1')).rejects.toThrow("La recette n'existe pas")

    // Seul le DELETE a été appelé
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/recipes/recipe-1', {method: 'DELETE'})

    // Récupère les appels GET /api/recipes et vérifie que la liste est vide
    const getRecipesCalls = fetchMock.mock.calls.filter(
      ([url, options]) => url === '/api/recipes' && options?.method === 'GET'
    )
    expect(getRecipesCalls).toHaveLength(0)

    // Vérifie que la liste n'a pas changé
    expect(store.recipes).toEqual(initialRecipes)
  })
})

