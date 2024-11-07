async function fetchRecipeList() {
  const response = await fetch("https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json");
  const Recipes = await response.json();

  Recipes.forEach(item => {
    item.image = item.image.replace(".jpg", ".webp");
  });

  console.log(Recipes); 
  return Recipes;
}

// Function to normalize and lower strings
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toLowerCase()); 
}

document.addEventListener("DOMContentLoaded", async () => {
  const appareilsContainer = document.getElementById("appareilsList");
  const ingredientsContainer = document.querySelector("#button_select_2 ~ .fieldset_content div");
  const ustensilesContainer = document.querySelector("#button_select_3 ~ .fieldset_content div");

  const recipes = await fetchRecipeList();

  // Create unique sets for appareils, ingredients, and ustensiles with normalization
  const appareilsSet = new Set();
  const ingredientsSet = new Set();
  const ustensilesSet = new Set();
  const totalRecipes = recipes.length;

  recipes.forEach(recipe => {
    if (recipe.appliance) appareilsSet.add(normalizeString(recipe.appliance));
    if (recipe.ingredients) recipe.ingredients.forEach(ingredient => ingredientsSet.add(normalizeString(ingredient.ingredient)));
    if (recipe.ustensils) recipe.ustensils.forEach(ustensil => ustensilesSet.add(normalizeString(ustensil)));
  });

  // Update the number of recipes
  const numberOfRecipesElement = document.getElementById("numberOfRecipes");
  numberOfRecipesElement.textContent = `${totalRecipes} ${totalRecipes > 1 ? "recettes" : "recette"}`;

  // Function to update the list of recipes
  function updateListOfRecipes() {
    const recipesContainer = document.getElementById("recipesListContainer");

    recipes.forEach(recipe => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("list_recettes_div"); 

      recipeDiv.innerHTML = `
        <img src="./images/${recipe.image}" alt="Recipe Image">
        <div>
          <h2>${recipe.name}</h2>
          <h3>Recette</h3>
          <p>${recipe.description}</p>
          <h3>Ingrédients</h3>
          <div class="list_ingredients">
            ${recipe.ingredients.map(ingredient => `
              <div>
                <p>${normalizeString(ingredient.ingredient)}</p>
                <label for="">${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</label>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      recipesContainer.appendChild(recipeDiv); 
    });
  }
  updateListOfRecipes();

  // Function to toggle checkbox state
  window.toggleCheckbox = (name, value) => {
    const checkboxes = document.querySelectorAll(`input[name="${name}"][value="${value}"]`);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
      updateSelectedFilters();
    });
  };

  // Function to update selected filters
  function updateSelectedFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const filterList = document.getElementById("filterList");
    filterList.innerHTML = ""; // Clear old filter list to avoid duplicate

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const filterItem = document.createElement("button");
        filterItem.innerHTML = `
                  <p>${checkbox.value}</p>
                  <i class="fa-regular fa-circle-xmark"></i>
              `;
        filterItem.onclick = () => toggleCheckbox(checkbox.name, checkbox.value);

        filterList.appendChild(filterItem);
      }
    });
  }

  // Helper function to create checkboxes from a sorted array and append to a container
  function createCheckboxes(set, container, name) {
    // Convert Set to an array, sort it alphabetically, then create checkboxes
    Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .forEach(item => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = name;
        checkbox.value = item;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item));

        container.appendChild(label);
        container.appendChild(document.createElement("br"));

        
        checkbox.addEventListener("change", updateSelectedFilters);
      });
  }

  // Populate each container with sorted checkboxes
  createCheckboxes(appareilsSet, appareilsContainer, "appareils");
  createCheckboxes(ingredientsSet, ingredientsContainer, "ingredients");
  createCheckboxes(ustensilesSet, ustensilesContainer, "ustensiles");

  // Initialize the filter display
  updateSelectedFilters();
});

// Manage filter display toggle
document.querySelectorAll("legend").forEach(legend => {
  legend.addEventListener("click", function () {
    const content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    content.style.border = content.style.border === "2px solid black" ? "unset" : "2px solid black";
  });
});
