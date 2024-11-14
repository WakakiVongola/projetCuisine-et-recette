// Fonction pour récupérer la liste des recettes et modifier les extensions d'image
async function fetchRecipeList() {
  try {
    const response = await fetch("https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json");
    if (!response.ok) throw new Error('Erreur réseau');
    const recipes = await response.json();
    recipes.forEach(item => item.image = item.image.replace(".jpg", ".webp"));
    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    alert("Erreur de chargement des recettes. Veuillez réessayer plus tard.");
    return [];
  }
}

// Fonction pour normaliser les chaînes
function normalizeString(str) {
  return str?.toLowerCase().trim() || '';
}

// Fonction pour récupérer les filtres sélectionnés
function getSelectedFilters() {
  return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => normalizeString(checkbox.value));
}

// Fonction de debounce pour améliorer la performance des recherches
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Fonction pour filtrer les recettes selon l'input et les filtres
function filterRecipes(recipes, input, selectedFilters) {
  const normalizedInput = normalizeString(input);

  return recipes.filter(recipe => {
    const matchesInput = recipe.name.toLowerCase().includes(normalizedInput);
    const matchesFilters = selectedFilters.every(filter =>
      recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(filter)) ||
      (recipe.appliance && normalizeString(recipe.appliance).includes(filter)) ||
      (recipe.ustensils && recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(filter)))
    );
    return matchesInput && matchesFilters;
  });
}

// Fonction pour mettre à jour l'affichage des recettes
function updateListOfRecipes(recipes, input = "") {
  const recipesContainer = document.getElementById("recipesListContainer");
  recipesContainer.innerHTML = "";

  const selectedFilters = getSelectedFilters();
  const filteredRecipes = filterRecipes(recipes, input, selectedFilters);

  const numberOfRecipesElement = document.getElementById("numberOfRecipes");
  numberOfRecipesElement.textContent = `${filteredRecipes.length} ${filteredRecipes.length > 1 ? "recettes" : "recette"}`;

  if (filteredRecipes.length === 0) {
    recipesContainer.innerHTML = "<p>Aucune recette trouvée</p>";
    return;
  }

  filteredRecipes.forEach(recipe => {
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
    recipesContainer.appendChild(recipeDiv);
  });
}

// Fonction pour créer les cases à cocher
function createCheckboxes(set, container, name) {
  Array.from(set).sort().forEach(item => {
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

// Fonction pour mettre à jour le contenu des filtres
function updateFilterContent(recipes, searchTerm = "") {
  const appareilsSet = new Set();
  const ingredientsSet = new Set();
  const ustensilesSet = new Set();

  const filteredRecipes = filterRecipes(recipes, searchTerm, []);

  filteredRecipes.forEach(recipe => {
    if (recipe.appliance) appareilsSet.add(normalizeString(recipe.appliance));
    recipe.ingredients.forEach(ingredient => ingredientsSet.add(normalizeString(ingredient.ingredient)));
    recipe.ustensils.forEach(ustensil => ustensilesSet.add(normalizeString(ustensil)));
  });

  updateFilter("appareilsList", appareilsSet, "appareils");
  updateFilter("ingredientsList", ingredientsSet, "ingredients");
  updateFilter("ustensilesList", ustensilesSet, "ustensiles");
}


// Fonction pour mettre à jour les filtres
function updateFilter(containerId, dataSet, filterName) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  createCheckboxes(dataSet, container, filterName);
}

// Fonction pour gérer les changements de filtre
function updateSelectedFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const filterList = document.getElementById("filterList");
  filterList.innerHTML = "";

  checkboxes.forEach(checkbox => {
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

  updateListOfRecipes(allRecipes, document.getElementById("big_search").value);
}

// Fonction pour basculer l'état des cases à cocher
function toggleCheckbox(name, value) {
  const checkbox = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateSelectedFilters();
  }
}

// Initialisation de la page
let allRecipes = [];

document.addEventListener("DOMContentLoaded", async () => {
  allRecipes = await fetchRecipeList();
  if (allRecipes.length === 0) return; // Eviter les erreurs si les recettes ne sont pas récupérées

  updateFilterContent(allRecipes);
  updateListOfRecipes(allRecipes);

  const searchInput = document.getElementById("big_search");
  searchInput.addEventListener("input", debounce(() => {
    const searchTerm = searchInput.value;
    updateFilterContent(allRecipes, searchTerm); // Met à jour les filtres en fonction de la recherche
    updateListOfRecipes(allRecipes, searchTerm); // Met à jour les recettes affichées
  }, 300));
});

// Fonction pour mettre à jour dynamiquement les recettes selon les filtres
function updateFilteredRecipes() {
  const searchAppareilsValue = document.getElementById("searchappareils").value.toLowerCase();
  const searchIngredientsValue = document.getElementById("searchingredients").value.toLowerCase();
  const searchUstensilesValue = document.getElementById("searchustensiles").value.toLowerCase();

  const filteredAppareils = new Set();
  const filteredIngredients = new Set();
  const filteredUstensiles = new Set();

  // Filtrer les recettes selon les champs de recherche pour chaque catégorie
  allRecipes.forEach(recipe => {
    if (searchAppareilsValue === "" || (recipe.appliance && recipe.appliance.toLowerCase().includes(searchAppareilsValue))) {
      if (recipe.appliance) filteredAppareils.add(normalizeString(recipe.appliance));
    }

    recipe.ingredients.forEach(ingredient => {
      if (searchIngredientsValue === "" || ingredient.ingredient.toLowerCase().includes(searchIngredientsValue)) {
        filteredIngredients.add(normalizeString(ingredient.ingredient));
      }
    });

    recipe.ustensils.forEach(ustensil => {
      if (searchUstensilesValue === "" || ustensil.toLowerCase().includes(searchUstensilesValue)) {
        filteredUstensiles.add(normalizeString(ustensil));
      }
    });
  });

  // Mettre à jour la liste des filtres en utilisant les filtres filtrés
  updateFilter("appareilsList", filteredAppareils, "appareils");
  updateFilter("ingredientsList", filteredIngredients, "ingredients");
  updateFilter("ustensilesList", filteredUstensiles, "ustensiles");

  // Enfin, met à jour les recettes affichées selon les filtres et la recherche
  updateListOfRecipes(allRecipes);
}


// Écouteurs d'événements pour chaque champ de recherche
document.getElementById("searchappareils").addEventListener("input", handleSearchInput);
document.getElementById("searchingredients").addEventListener("input", handleSearchInput);
document.getElementById("searchustensiles").addEventListener("input", handleSearchInput);

// Gérer les événements de recherche
function handleSearchInput() {
  updateFilteredRecipes();
  updateSelectedFilters();
}

// Gestion des clics sur les légendes
document.querySelectorAll("legend").forEach(legend => {
  legend.addEventListener("click", () => {
    const content = legend.nextElementSibling;
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
    content.style.border = isVisible ? "unset" : "2px solid black";
  });
});