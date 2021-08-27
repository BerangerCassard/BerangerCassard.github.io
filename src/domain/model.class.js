import {UtilClass} from "../common/util.class.js";

export class Recipe {
    activeTag = {}
    /**
     *
     * @param id
     * @param name
     * @param servings
     * @param ingredients
     * @param time
     * @param description
     * @param appliance
     * @param ustensils
     */
    constructor(id, name, servings, ingredients, time, description, appliance, ustensils) {
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.ingredients = ingredients;
        this.time = time;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }
    cardHTML() {
        return `
        <div class="recipesList__card sketch">
            <div class="recipesList__card__image sketch"></div>
            <div class="recipesList__card__title sketch">
                <div class="recipesList__card__title__name" class="sketch">${this.name}</div>
                <div class="recipesList__card__title__time" class="sketch">${this.time} min</div>
            </div>
            <div class="recipesList__card__description">
                 <div class="recipesList__card__description__ingredients" class="sketch">
                    ${this.ingredientsHTML()}
                </div>
                <div class="recipesList__card__description__process" >
                    ${this.description}
                </div>
            </div>
        </div>`;
    }
    ingredientsHTML() {
        const ingredientsList = [];
        this.ingredients.forEach(ingredient => {
            ingredientsList.push(`<p class="ingredient"><b>${UtilClass.emptyIfUndefined(ingredient.ingredient)}</b>: ${UtilClass.emptyIfUndefined(ingredient.quantity)}  ${UtilClass.emptyIfUndefined(ingredient.unit)}</p>`);
        });
        return ingredientsList.join('');
    }
}
