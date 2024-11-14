// RecipeService.js
export default class RecipeService {
    async fetchRecipes() {
      try {
        const response = await fetch("https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json");
        if (!response.ok) throw new Error("Erreur réseau");
        const recipes = await response.json();
        return recipes.map(recipe => ({
          ...recipe,
          image: recipe.image.replace(".jpg", ".webp")
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
        return [];
      }
    }
  }
  