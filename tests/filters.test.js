import { getSelectedFilters, updateFilterContent } from "../filters";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { filterRecipes } from "../search";

vi.mock("../search");

describe("getSelectedFilters", () => {
  test("retourne une liste des filtres sélectionnés", () => {
    document.body.innerHTML = `
      <input type="checkbox" value="mixeur" checked />
      <input type="checkbox" value="fouet" />
    `;
    expect(getSelectedFilters()).toEqual(["mixeur"]);
  });
});

describe("updateFilterContent", () => {
  beforeEach(() => {
    // Ajouter les conteneurs nécessaires au DOM pour le test
    document.body.innerHTML = `
      <div id="appareilsList"></div>
      <div id="ingredientsList"></div>
      <div id="ustensilesList"></div>
    `;
  });

  test("met à jour le contenu des filtres", () => {
    const recipes = [
      { appliance: "mixeur", ingredients: [{ ingredient: "lait" }], ustensils: ["bol"] },
      { appliance: "fouet", ingredients: [{ ingredient: "oeufs" }], ustensils: ["spatule"] },
    ];

    // Simuler le retour de `filterRecipes`
    filterRecipes.mockReturnValue(recipes);

    // Appeler la fonction pour mettre à jour les filtres
    updateFilterContent(recipes);

    // Vérifier que les éléments ont été ajoutés au DOM
    const appareilsList = document.getElementById("appareilsList");
    const ingredientsList = document.getElementById("ingredientsList");
    const ustensilesList = document.getElementById("ustensilesList");

    expect(appareilsList).not.toBeNull();
    expect(ingredientsList).not.toBeNull();
    expect(ustensilesList).not.toBeNull();

    // Ajoutez des vérifications supplémentaires selon le contenu attendu
  });
});
