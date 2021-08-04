import {Recipe} from "./src/domain/model.class.js";
import {UtilClass} from "./src/common/util.class.js";

/**
 * Fetch Json data
 * */
const recipesData = './src/assets/data/recipes.json';
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

    let allRecipes = [];
    data.forEach(recipe => {
        const recipeInstance = new Recipe(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils);
        allRecipes.push(recipeInstance);
    });
    let recipesWithIngredient
    let recipesWithAppliance
    let recipesWithUtensil

    /**
     * Deactivate all tags
     * */
    function deactivateTags(recipes){
        recipes.forEach(recipe => {
            recipe.activeTag.ingredientTag = false;
            recipe.activeTag.applianceTag = false;
            recipe.activeTag.utensilTag = false;
        });
    }
    deactivateTags(allRecipes)

    /**
     * Manage active recipes
     * */
    // count how many true value in array
    let trueCount = []
    function countTrue (array) {
        trueCount = []
        let i
        for(i=0; i<array.length; i++) {
            if(array[i]=== true){
                trueCount.push(array[i])
            }
        }
        return trueCount.length
    }

    function activateAndDeactivateRecipes(recipes) {
        const areAllTagsFalse = recipes.every( recipe => recipe.activeTag.every( tag => tag === false));
        const isOneTagTrue = recipes.every( recipe => recipe.activeTag.every( tag => countTrue(tag) === 1 ));
        const areTwoTagsTrue = recipes.every( recipe => recipe.activeTag.every( tag => countTrue(tag) === 2))
        const areThreeTagsTrue = recipes.every( recipe => recipe.activeTag.every( tag => countTrue(tag) === 3))
        if(areAllTagsFalse) {
            recipes.forEach(recipe => recipe.active = true)
        } else if(isOneTagTrue) {
            recipes.forEach(recipe => {
                if(recipe.activeTag.every(tag => countTrue(tag) === 0)) {
                    recipe.active = false
                }
            } )
        } else if(areTwoTagsTrue) {
            recipes.forEach(recipe => {
                if(recipe.activeTag.every(tag => countTrue(tag) < 2)) {
                    recipe.active = false
                }
            })
        } else if(areThreeTagsTrue) {
            recipes.forEach(recipe => {
                if(recipe.activeTag.every(tag => countTrue(tag) < 3)) {
                    recipe.active = false
                }
            })
        }
    }

    activateAndDeactivateRecipes(allRecipes);

    console.log('active recipes', allRecipes)

    /**
     * Get lis of all Ingredients and keep uniq values
     * */
    let activeIngredients;
    function ingredientsUniqList(recipes) {
        let allIngredientsWithDoubles = [];
        // for each instance...
        recipes.forEach(recipe => {
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
        activeIngredients = Array.from(allIngredientsUniqSet);
    }
    ingredientsUniqList(allRecipes);

    /**
     * Get list of all appliances and keep uniq values
     * */
    let activeAppliances;
    function appliancesUniqList(recipes) {
        // map recipes to get appliances list
        const appliancesWithDoubles = recipes.map(recipe => recipe.appliance.toLowerCase());
        // make this appliances uniq through Set
        const appliancesUniqSet = new Set(appliancesWithDoubles);
        // save uniq appliances list in variable
        activeAppliances = Array.from(appliancesUniqSet);
    }
    appliancesUniqList(allRecipes);
    /**
     * Get list of all Utensils and keep uniq values
     * */
    let allActiveUtensils;
    function utensilsUniqList(recipes) {
        let allUtensilsWithDoubles = [];
        let i;
        // for each instance merge utensils into array
        for (i = 0; i < recipes.length; i++) {
            allUtensilsWithDoubles = allUtensilsWithDoubles.concat(recipes[i].ustensils);
        }
        // make this appliances uniq through Set
        const allUtensilsUniqSet = new Set(allUtensilsWithDoubles);
        // save uniq utensils list in variable
        allActiveUtensils = Array.from(allUtensilsUniqSet).map(utensil => utensil.toLocaleLowerCase());
    }
    utensilsUniqList(allRecipes);
    /**
     * Display all recipes cards
     * */
    function displayActiveCards(recipes) {
        recipes.forEach(recipe => {
            if(recipe.active === true) {
                recipesContainer.innerHTML += `${recipe.cardHTML()}`
            }
        })
    }
    displayActiveCards(allRecipes);

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
    keyUpGenerateSuggestions(ingredientsSearchBar, activeIngredients, ingredientsSuggestionsContainer, 'ingredientTag');
    keyUpGenerateSuggestions(appliancesSearchBar, activeAppliances, appliancesSuggestionsContainer, 'applianceTag');
    keyUpGenerateSuggestions(utensilsSearchBar, allActiveUtensils, utensilsSuggestionsContainer, 'utensilTag');
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
            searchBar.addEventListener('click', () => {
                // for each element
                elementsList.forEach(element => {
                    // inject HTML
                    container.innerHTML += `<div class="suggestion ${classAtt} sketch">${element}</div>`;
                });
                saveElementOnClick(elements, selection, box);
            });
        }
    }
    dblClickSuggestion(ingredientsSearchBar, activeIngredients, ingredientsSuggestionsContainer, 'ingredientTag', ingredients, ingredientSelected, ingredientSelectedBox);
    dblClickSuggestion(appliancesSearchBar, activeAppliances, appliancesSuggestionsContainer, 'applianceTag', appliances, applianceSelected, applianceSelectedBox);
    dblClickSuggestion(utensilsSearchBar, allActiveUtensils, utensilsSuggestionsContainer, 'utensilTag', utensils, utensilSelected, utensilSelectedBox);
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

           allRecipes.forEach(recipe => {

               if(!recipe.ingredientTag === true && !recipe.applianceTag === true && !recipe.utensilTag === true) {
                  recipe.active = true
               } else if(recipe.ingredientTag === true) {
                   recipe.ingredientTag = false
               }
           })
            console.log("active recipes", allRecipes.filter(recipe => recipe.active === true))
            // clear Element Text
            selectionElement.innerHTML = '';
            // display none Box
            selectionBox.style.display = 'none';
            recipesContainer.innerHTML = '';

            displayActiveCards(allRecipes);
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
                // reset active ingredients
                allRecipes.forEach(recipe => recipe.ingredientTag = false);
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');

                function deactivateRecipesWithoutIngredient(recipes) {
                    recipes.forEach( recipe => {
                        if(!recipe.ingredients.some( element => element.ingredient.toLowerCase() == modifiedTitle)) {
                            recipe.active = 'none';
                        } else {
                            recipe.ingredientTag = true
                        }
                    })
                    return recipes
                }
               allRecipes =  deactivateRecipesWithoutIngredient(allRecipes)
                console.log('recipes with ingredient', allRecipes.filter(recipe => recipe.active == true))
                // clear container HTML
                recipesContainer.innerHTML = '';
                // for each recipe inject HTML in container
                displayActiveCards(allRecipes);

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
                console.log('recipes with appliances', recipesWithAppliance)
                // if active tag, inject html of this tag
                let activeTagsRecipes = [];
                if (ingredientSelectedBox.style.display == 'grid' && utensilSelectedBox.style.display == 'none') {
                    activeTagsRecipes = recipesWithIngredient.filter(recipe => !recipesWithAppliance.includes(recipe));
                }
                else if (ingredientSelectedBox.style.display == 'grid' && utensilSelectedBox.style.display == 'grid') {
                    activeTagsRecipes = recipesWithIngredient
                        .filter(recipe => !recipesWithAppliance.includes(recipe))
                        .filter(recipe => !recipesWithUtensil.includes(recipe))
                        .concat(recipesWithUtensil);
                } else if(applianceSelectedBox.style.display == 'none' && utensilSelectedBox.style.display == 'grid') {
                    activeTagsRecipes = recipesWithUtensil.filter(recipe => !recipesWithAppliance.includes(recipe));
                }
                activeTagsRecipes.forEach( utensil => {
                    recipesContainer.innerHTML += `${utensil.cardHTML()}`
                })
                // for each recipe inject HTML in container
                recipesWithAppliance.forEach(recip => {
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
                console.log('recipes with utensils', recipesWithUtensil)
                // if active tag, inject html of this tag
                let activeTagsRecipes = [];
                if (ingredientSelectedBox.style.display == 'grid' && applianceSelectedBox.style.display == 'none') {
                    activeTagsRecipes = recipesWithIngredient.filter(recipe => !recipesWithUtensil.includes(recipe));
                }
                else if (ingredientSelectedBox.style.display == 'grid' && applianceSelectedBox.style.display == 'grid') {
                    activeTagsRecipes = recipesWithIngredient
                        .filter(recipe => !recipesWithAppliance.includes(recipe))
                        .filter(recipe => !recipesWithUtensil.includes(recipe))
                        .concat(recipesWithAppliance)
                } else if(ingredientSelectedBox.style.display == 'none' && applianceSelectedBox.style.display == 'grid') {
                    activeTagsRecipes = recipesWithAppliance.filter(recipe => !recipesWithUtensil.includes(recipe));
                }
                activeTagsRecipes.forEach( utensil => {
                    recipesContainer.innerHTML += `${utensil.cardHTML()}`
                })
                // for each recipe inject HTML in container
                recipesWithUtensil.forEach(recip => {
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
