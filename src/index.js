import {Recipe} from "./domain/model.class.js";
/**
 * Fetch Json data
 * */
const recipesData = './assets/data/recipes.json';
fetch(recipesData)
    .then(res => res.json())
    .then(data => {
    const recipesContainer = document.getElementById('recipesContainer');
    const ingredientsSuggestionsContainer = document.getElementById('ingredientsSuggestions');
    const ingredientsSearchBar = document.getElementById('searchIngredient');
    const appliancesSuggestionsContainer = document.getElementById('appareilsSuggestions');
    const appliancesSearchBar = document.getElementById('searchAppareil');
    const ingredients = document.getElementsByClassName("ingredientTag");
    const ingredientSelected = document.getElementById('ingredientTag');
    const applianceSelected = document.getElementById('applianceTag');
    const utensilSelected = document.getElementById('utensilTag');
    const searchBars = document.getElementsByClassName('search__tagsLists__frame__input');
    const utensilsSuggestionsContainer = document.getElementById('utensilsSuggestions');
    const utensilsSearchBar = document.getElementById('searchUstensile');
    const ingredientsSearchBarAndSuggestionsContainer = document.getElementById('ingredientsContainer');
    const appliancesSearchBarAndSuggestionsContainer = document.getElementById('appliancesContainer');
    const utensilsSearchBarAndSuggestionsContainer = document.getElementById('utensilsContainer');
    const appliances = document.getElementsByClassName('applianceTag');
    const utensils = document.getElementsByClassName('utensilTag');
    const ingredientSelectedBox = document.getElementById('ingredientSelectTag');
    const ingredientCross = document.getElementById('ingredientCross');
    const applianceSelectedBox = document.getElementById('applianceSelectTag');
    const applianceCross = document.getElementById('applianceCross');
    const utensilSelectedBox = document.getElementById('utensilSelectedTag');
    const utensilCross = document.getElementById('utensilCross');
    const allRecipes = [];
    data.forEach(recipe => {
        const recipeInstance = new Recipe(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils);
        allRecipes.push(recipeInstance);
    });
    let recipesWithIngredient = allRecipes;
    let recipesWithAppliance = allRecipes;
    let recipesWithUtensil = allRecipes;
    let allRecipesOnActiveTags = allRecipes;
    /**
     * Get lis of all Ingredients and keep uniq values
     * */
    let allIngredients;
    function ingredientsUniqList(allRecipes) {
        let allIngredientsWithDoubles = [];
        // for each instance...
        allRecipes.forEach(recipe => {
            // loop through ingredients
            let t;
            for (t = 0; t < recipe.ingredients.length; t++) {
                // merge every ingredient to array
                allIngredientsWithDoubles = allIngredientsWithDoubles.concat(recipe.ingredients[t].ingredient.toLocaleLowerCase());
            }
        });
        // make this ingredients uniq through Set
        const allIngredientsUniqSet = new Set(allIngredientsWithDoubles);
        // save uniq ingredients list in variable
        allIngredients = Array.from(allIngredientsUniqSet);
    }
    ingredientsUniqList(allRecipesOnActiveTags);
    /**
     * Get list of all appliances and keep uniq values
     * */
    let allAppliances;
    function appliancesUniqList(allRecipes) {
        // map recipes to get appliances list
        const appliancesWithDoubles = allRecipes.map(recipe => recipe.appliance.toLowerCase());
        // make this appliances uniq through Set
        const appliancesUniqSet = new Set(appliancesWithDoubles);
        // save uniq appliances list in variable
        allAppliances = Array.from(appliancesUniqSet);
    }
    appliancesUniqList(allRecipesOnActiveTags);
    /**
     * Get list of all Utensils and keep uniq values
     * */
    let allUtensils;
    function utensilsUniqList(allRecipes) {
        let allUtensilsWithDoubles = [];
        let i;
        // for each instance merge utensils into array
        for (i = 0; i < allRecipes.length; i++) {
            allUtensilsWithDoubles = allUtensilsWithDoubles.concat(allRecipes[i].ustensils);
        }
        // make this appliances uniq through Set
        const allUtensilsUniqSet = new Set(allUtensilsWithDoubles);
        // save uniq utensils list in variable
        allUtensils = Array.from(allUtensilsUniqSet).map(utensil => utensil.toLocaleLowerCase());
    }
    utensilsUniqList(allRecipesOnActiveTags);
    /**
     * Display recipes cards
     * */
    allRecipes.forEach(recip => {
        recipesContainer.innerHTML += `${recip.cardHTML()}`;
    });
    /**
     * Key up on search bar to suggest lists of ingredients
     * */
    function keyUpGenerateSuggestions(searchBar, elements, container, classAtt) {
        // key up in search bar...
        searchBar.addEventListener("keyup", (event) => {
            // catch search bar value
            const elementInputValue = searchBar.value;
            // filter elements which include value
            const elementsMatchingResults = elements.filter(element => element.includes(elementInputValue));
            let suggestion = '';
            // if value not empty
            if (elementInputValue != '') {
                // add html to string Suggestion for each element
                elementsMatchingResults.forEach(result => suggestion += `<div class="suggestion ${classAtt} sketch">${result}</div>`);
                // inject Suggestion string/html in container
                container.innerHTML = suggestion;
            }
            else {
                // if value empty, clear container
                container.innerHTML = '';
            }
        });
    }
    keyUpGenerateSuggestions(ingredientsSearchBar, allIngredients, ingredientsSuggestionsContainer, 'ingredientTag');
    keyUpGenerateSuggestions(appliancesSearchBar, allAppliances, appliancesSuggestionsContainer, 'applianceTag');
    keyUpGenerateSuggestions(utensilsSearchBar, allUtensils, utensilsSuggestionsContainer, 'utensilTag');
    /**
     * Double Click to display Suggestion
     * */
    function saveElementOnClick(elements, selection, box) {
        // for each element
        Array.from(elements).forEach(element => {
            element.addEventListener('click', (event) => {
                // selection text equal to element clicked
                selection.innerHTML = `${element.innerHTML}`;
                // set title attribute equal to text
                selection.setAttribute('title', selection.innerHTML);
                // display the box grid
                box.style.display = "grid";
            });
        });
    }
    function dblClickSuggestion(searchBar, elementsList, container, classAtt, elements, selection, box) {
        const InputValue = searchBar.value;
        // if no input value in search bar
        if (!InputValue) {
            // double clicking...
            searchBar.addEventListener('dblclick', () => {
                // for each element
                elementsList.forEach(element => {
                    // inject HTML
                    container.innerHTML += `<div class="suggestion ${classAtt} sketch">${element}</div>`;
                });
                saveElementOnClick(elements, selection, box);
            });
        }
    }
    dblClickSuggestion(ingredientsSearchBar, allIngredients, ingredientsSuggestionsContainer, 'ingredientTag', ingredients, ingredientSelected, ingredientSelectedBox);
    dblClickSuggestion(appliancesSearchBar, allAppliances, appliancesSuggestionsContainer, 'applianceTag', appliances, applianceSelected, applianceSelectedBox);
    dblClickSuggestion(utensilsSearchBar, allUtensils, utensilsSuggestionsContainer, 'utensilTag', utensils, utensilSelected, utensilSelectedBox);
    /**
     * Click on an ingredient to display it on the top
     * */
    function clickOnSuggestionSaveAsTag(searchBar, elements, selection, box) {
        // when keyup in search bars
        searchBar.addEventListener('keyup', () => {
            saveElementOnClick(elements, selection, box);
        });
    }
    clickOnSuggestionSaveAsTag(ingredientsSearchBar, ingredients, ingredientSelected, ingredientSelectedBox);
    clickOnSuggestionSaveAsTag(appliancesSearchBar, appliances, applianceSelected, applianceSelectedBox);
    clickOnSuggestionSaveAsTag(utensilsSearchBar, utensils, utensilSelected, utensilSelectedBox);
    /**
     * Click on Cross element effects
     * */
    function closeSelection(crossElement, selectionElement, selectionBox) {
        // Click on Cross Element
        crossElement.addEventListener('click', () => {
            // clear Element Text
            selectionElement.innerHTML = '';
            // display none Box
            selectionBox.style.display = 'none';
        });
    }
    closeSelection(ingredientCross, ingredientSelected, ingredientSelectedBox);
    closeSelection(applianceCross, applianceSelected, applianceSelectedBox);
    closeSelection(utensilCross, utensilSelected, utensilSelectedBox);
    /**
     * Focus on search bars effect
     * */
    Array.from(searchBars).forEach(searchBar => {
        // if focus on search bars
        searchBar.addEventListener('focus', () => {
            // increase size of search bar
            searchBar.style.width = "400px";
        });
    });
    /**
     * Click outside the search bar effects
     * */
    function resetSearchBarWithOutsideClick(container, suggestions, searchBar) {
        document.addEventListener('click', (event) => {
            // if i click outside container
            if (!container.contains(event.target)) {
                // clear container
                suggestions.innerHTML = '';
                // clear search bar value
                searchBar.value = '';
                // reset sear bar size to initial
                searchBar.style.width = '93px';
            }
        });
    }
    resetSearchBarWithOutsideClick(ingredientsSearchBarAndSuggestionsContainer, ingredientsSuggestionsContainer, ingredientsSearchBar);
    resetSearchBarWithOutsideClick(appliancesSearchBarAndSuggestionsContainer, appliancesSuggestionsContainer, appliancesSearchBar);
    resetSearchBarWithOutsideClick(utensilsSearchBarAndSuggestionsContainer, utensilsSuggestionsContainer, utensilsSearchBar);

    /**
     * Filter recipes per Ingredient Tag
     * */
    const ingredientMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                // clear container HTML
                recipesContainer.innerHTML = '';
                // filter recipes with those that contain the target
                recipesWithIngredient = allRecipes
                    .filter(recipe => recipe.ingredients
                        .some(element => element.ingredient.toLowerCase() == modifiedTitle));
                // set variable depending on active tags
                allRecipesOnActiveTags = allRecipes
                    .filter(recipe => recipesWithIngredient.includes(recipe))
                    .filter(recipe => recipesWithAppliance.includes(recipe))
                    .filter(recipe => recipesWithUtensil.includes(recipe));

                console.log('allRecipesOnActiveTag', allRecipesOnActiveTags)
                // update lists
                ingredientsUniqList(allRecipesOnActiveTags)
                console.log('all ingredients', allIngredients)
                appliancesUniqList(allRecipesOnActiveTags);
                console.log('all appliances', allAppliances);
                utensilsUniqList(allRecipesOnActiveTags);
                console.log('all utensils', allUtensils);
                // display suggestions
                keyUpGenerateSuggestions(ingredientsSearchBar, allIngredients, ingredientsSuggestionsContainer, 'ingredientTag');
                keyUpGenerateSuggestions(appliancesSearchBar, allAppliances, appliancesSuggestionsContainer, 'applianceTag');
                keyUpGenerateSuggestions(utensilsSearchBar, allUtensils, utensilsSuggestionsContainer, 'utensilTag');

                // save as tag
                clickOnSuggestionSaveAsTag(ingredientsSearchBar, ingredients, ingredientSelected, ingredientSelectedBox);
                clickOnSuggestionSaveAsTag(appliancesSearchBar, appliances, applianceSelected, applianceSelectedBox);
                clickOnSuggestionSaveAsTag(utensilsSearchBar, utensils, utensilSelected, utensilSelectedBox);


                // filter recipes which those included in other filters
                const recipesIncludedInAll = recipesWithIngredient
                    .filter(recipe => recipesWithAppliance.includes(recipe))
                    .filter(recipe => recipesWithUtensil.includes(recipe));
                // for each recipe inject HTML in container
                recipesIncludedInAll.forEach(recipe => {
                    recipesContainer.innerHTML += `${recipe.cardHTML()}`;
                });
            }
        });
    });
    // observe mutations on ingredient tag element
    ingredientMutations.observe(ingredientSelected, {
        attributes: true
    });
    /**
     * Filter recipes per Appliance tag
     * */
    const applianceMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                // clear container HTML
                recipesContainer.innerHTML = '';
                // filter recipes with those containing the target
                recipesWithAppliance = allRecipes
                    .filter(recipe => recipe.appliance.toLowerCase() == modifiedTitle);
                // set variable depending on active tags
                allRecipesOnActiveTags = allRecipes
                    .filter(recipe => recipesWithIngredient.includes(recipe))
                    .filter(recipe => recipesWithAppliance.includes(recipe))
                    .filter(recipe => recipesWithUtensil.includes(recipe));
                // update list

                // filter recipes which those included in other filters
                const recipesIncludedInAll = recipesWithAppliance
                    .filter(recipe => recipesWithIngredient.includes(recipe))
                    .filter(recipe => recipesWithUtensil.includes(recipe));
                // for each recipe inject HTML in container
                recipesIncludedInAll.forEach(recip => {
                    recipesContainer.innerHTML += `${recip.cardHTML()}`;
                });
            }
        });
    });
    // observe mutations on appliance tag element
    applianceMutations.observe(applianceSelected, {
        attributes: true
    });
    /**
     * Filter recipes per Utensil tag
     * */
    const utensilMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                // clear container HTML
                recipesContainer.innerHTML = '';
                // filter recipes with those that contain the target
                recipesWithUtensil = allRecipes
                    .filter(recipe => recipe.ustensils.includes(modifiedTitle));
                // filter recipes which those included in other filters
                const recipesIncludedInAll = recipesWithUtensil
                    .filter(recipe => recipesWithAppliance.includes(recipe))
                    .filter(recipe => recipesWithUtensil.includes(recipe));
                // for each recipe inject HTML in container
                recipesIncludedInAll.forEach(recip => {
                    recipesContainer.innerHTML += `${recip.cardHTML()}`;
                });
            }
        });
    });
    // observe mutations on utensil tag element
    utensilMutations.observe(utensilSelected, {
        attributes: true
    });
});
