import { fetchRecipeList } from "../data";

global.fetch = vi.fn();
global.alert = vi.fn();

describe("fetchRecipeList", () => {
  test("retourne un tableau vide et affiche une alerte en cas d'erreur de réseau", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("Erreur réseau")));
    const recipes = await fetchRecipeList();
    expect(recipes).toEqual([]);
    expect(alert).toHaveBeenCalledWith("Erreur de chargement des recettes. Veuillez réessayer plus tard.");
  });
});
