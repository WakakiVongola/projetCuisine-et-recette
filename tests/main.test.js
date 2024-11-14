import { fetchRecipeList } from "../data";
import { updateListOfRecipes } from "../ui";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("../data");
vi.mock("../ui");

describe("main initialization", () => {
  beforeEach(() => {
    // Créer les éléments DOM requis pour le test
    document.body.innerHTML = `
      <input id="big_search" />
      <input id="searchappareils" />
      <input id="searchingredients" />
      <input id="searchustensiles" />
    `;
  });

  test("appelle fetchRecipeList et updateListOfRecipes lors du chargement", async () => {
    fetchRecipeList.mockResolvedValue([{ name: "Recette test" }]);

    // Import dynamique de `main.js` pour simuler le chargement du DOM
    await import("../main");

    // Vérifications
    expect(fetchRecipeList).toHaveBeenCalled();
    expect(updateListOfRecipes).toHaveBeenCalled();
  });
});
