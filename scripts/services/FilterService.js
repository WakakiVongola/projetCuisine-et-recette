// FilterService.js
import { normalizeString } from "../utils/StringUtils.js";

export default class FilterService {
  constructor(recipes) {
    this.recipes = recipes;
  }

  getSelectedFilters() {
    return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => normalizeString(checkbox.value));
  }

  filterRecipes(input) {
    const normalizedInput = normalizeString(input);
    const selectedFilters = this.getSelectedFilters();

    return this.recipes.filter(recipe => {
      const matchesInput = recipe.name.toLowerCase().includes(normalizedInput);
      const matchesFilters = selectedFilters.every(filter =>
        recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(filter)) ||
        (recipe.appliance && normalizeString(recipe.appliance).includes(filter)) ||
        (recipe.ustensils && recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(filter)))
      );
      return matchesInput && matchesFilters;
    });
  }
}
