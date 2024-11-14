import { expect } from "chai";
import { filterRecipes } from "../search";

const recipes = [
  { id: 1, name: 'Pancakes', ingredients: [{ ingredient: 'Lait' }], appliance: 'Mixeur', ustensils: ['Bol'] },
  { id: 2, name: 'Omelette', ingredients: [{ ingredient: 'Oeufs' }], appliance: 'Poêle', ustensils: ['Fouet'] },
];

test('filterRecipes filtre les recettes en fonction du nom', () => {
  const filtered = filterRecipes(recipes, 'pancakes', []);
  expect(filtered).toEqual([recipes[0]]);
});

test('filterRecipes filtre les recettes en fonction des ingrédients', () => {
  const filtered = filterRecipes(recipes, '', ['lait']);
  expect(filtered).toEqual([recipes[0]]);
});

test('filterRecipes filtre les recettes en fonction de l\'appareil', () => {
  const filtered = filterRecipes(recipes, '', ['mixeur']);
  expect(filtered).toEqual([recipes[0]]);
});

test('filterRecipes filtre les recettes en fonction des ustensiles', () => {
  const filtered = filterRecipes(recipes, '', ['fouet']);
  expect(filtered).toEqual([recipes[1]]);
});
test('filterRecipes filtre les recette en fonction de plusieurs params', () => {
  const filtered = filterRecipes(recipes, 'pancakes',['lait','bol','mixeur']);
  expect(filtered).toEqual([recipes[0]]);
})