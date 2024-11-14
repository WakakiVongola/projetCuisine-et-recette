// FilterFactory.js
import FilterService from "../services/FilterService.js";

export default class FilterFactory {
  static createFilterService(recipes) {
    return new FilterService(recipes);
  }
}
