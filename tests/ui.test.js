import { updateListOfRecipes } from "../ui";

document.body.innerHTML = `
  <div id="recipesListContainer"></div>
  <div id="numberOfRecipes"></div>
`;

const recipes = [
  { id: 1, name: 'Pancakes', description: 'Délicieux pancakes', image: 'pancakes.webp', ingredients: [{ ingredient: 'Lait' }] },
  { id: 2, name: 'Omelette', description: 'Omelette moelleuse', image: 'omelette.webp', ingredients: [{ ingredient: 'Oeufs' }] },
];

test('updateListOfRecipes affiche les recettes; le nombre de recette est correct', () => {
  updateListOfRecipes(recipes, '');
  
  const recipesContainer = document.getElementById('recipesListContainer');
  const numberOfRecipesElement = document.getElementById('numberOfRecipes');

  expect(numberOfRecipesElement.textContent).toBe('2 recettes');
  expect(recipesContainer.children.length).toBe(2);
  expect(recipesContainer.children[0].querySelector('h2').textContent).toBe('Pancakes');
  expect(recipesContainer.children[1].querySelector('h2').textContent).toBe('Omelette');
});

test('updateListOfRecipes affiche un message lorsqu\'aucune recette n\'est trouvée', () => {
  updateListOfRecipes([], '');
  
  const recipesContainer = document.getElementById('recipesListContainer');
  expect(recipesContainer.textContent).toBe('Aucune recette trouvée');
});
