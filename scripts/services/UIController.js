import { normalizeString } from "../utils/StringUtils";

// UIController.js
export default class UIController {
    constructor(containerId, numberOfRecipesId) {
      this.recipesContainer = document.getElementById(containerId);
      this.numberOfRecipesElement = document.getElementById(numberOfRecipesId);
    }
  
    displayRecipes(recipes) {
      this.recipesContainer.innerHTML = "";
      this.numberOfRecipesElement.textContent = `${recipes.length} ${recipes.length > 1 ? "recettes" : "recette"}`;
  
      if (recipes.length === 0) {
        this.recipesContainer.innerHTML = "<p>Aucune recette trouvée</p>";
        return;
      }
  
      recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("list_recettes_div");
        recipeDiv.innerHTML = `
          <img src="./images/${recipe.image}" alt="Image de la recette">
          <div>
            <h2>${recipe.name}</h2>
            <p>${recipe.description}</p>
            <h3>Ingrédients</h3>
            <div class="list_ingredients">
              ${recipe.ingredients.map(ingredient => `
                <div>
                  <p>${normalizeString(ingredient.ingredient)}</p>
                  <label>${ingredient.quantity || ""} ${ingredient.unit || ""}</label>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        this.recipesContainer.appendChild(recipeDiv);
      });
    }
  
    updateFilters(checkboxContainerId, set, filterName) {
      const container = document.getElementById(checkboxContainerId);
      container.innerHTML = "";
      Array.from(set).sort().forEach(item => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
  
        checkbox.type = "checkbox";
        checkbox.name = filterName;
        checkbox.value = item;
  
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item));
        container.appendChild(label);
        container.appendChild(document.createElement("br"));
      });
    }
  }
  