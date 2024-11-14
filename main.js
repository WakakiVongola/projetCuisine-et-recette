import { fetchRecipeList } from './data.js';
import { updateListOfRecipes } from './ui.js';
import { debounce } from './utils.js';
import { updateFilterContent, updateSelectedFilters, updateFilteredRecipes } from './filters.js';

window.allRecipes = [];

document.addEventListener("DOMContentLoaded", async () => {
  window.allRecipes = await fetchRecipeList();
  console.log("Fetched recipes:", window.allRecipes);

  if (!Array.isArray(window.allRecipes)) {
    console.error("Expected 'allRecipes' to be an array but got:", window.allRecipes);
    return;
  }

  if (window.allRecipes.length === 0) return;

  updateFilterContent(window.allRecipes);
  updateListOfRecipes(window.allRecipes);

  const searchInput = document.getElementById("big_search");
  searchInput.addEventListener("input", debounce(() => {
    const searchTerm = searchInput.value;
    updateFilterContent(window.allRecipes, searchTerm);
    updateListOfRecipes(window.allRecipes, searchTerm);
  }, 300));
});

document.getElementById("searchappareils").addEventListener("input", () => updateFilteredRecipes(window.allRecipes));
document.getElementById("searchingredients").addEventListener("input", () => updateFilteredRecipes(window.allRecipes));
document.getElementById("searchustensiles").addEventListener("input", () => updateFilteredRecipes(window.allRecipes));


function handleSearchInput() {
  updateFilteredRecipes();
  updateSelectedFilters();
}

document.querySelectorAll("legend").forEach(legend => {
  legend.addEventListener("click", () => {
    const content = legend.nextElementSibling;
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
    content.style.border = isVisible ? "unset" : "2px solid black";
  });
})
