// Test functions for backend
async function run() {
    const fetch = (await import('node-fetch')).default;
  
    const cartIngredients = ["Pizza dough",
                                "Tomato sauce",
                                "Fresh mozzarella cheese",
                                "Fresh basil leaves",
                                "Olive oil",
                               ];
                            
    async function getRecipesMatchingCart() {
      const response = await fetch('https://dummyjson.com/recipes');
      const data = await response.json();
      const recipes = data.recipes;
  
      const matchingRecipes = recipes.filter(recipe =>
        recipe.ingredients.every(ingredient => cartIngredients.includes(ingredient))
      );
  
      console.log('Recipes matching cart ingredients:');
      console.log(matchingRecipes);
    }

    async function getRecipesWithFewestAdditionalIngredients() {
      const response = await fetch('https://dummyjson.com/recipes');
      const data = await response.json();
      const recipes = data.recipes;
  
      const recipesWithAdditionalIngredients = recipes.map(recipe => {
        const additionalIngredients = recipe.ingredients.filter(ingredient => !cartIngredients.includes(ingredient));
        return { recipe, additionalIngredientsCount: additionalIngredients.length };
      });

      const minAdditionalIngredients = Math.min(...recipesWithAdditionalIngredients.map(r => r.additionalIngredientsCount));
      const recipesWithFewestAdditionalIngredients = recipesWithAdditionalIngredients.filter(r => r.additionalIngredientsCount === minAdditionalIngredients);
  
      console.log('Recipes with fewest additional ingredients:');
      console.log(recipesWithFewestAdditionalIngredients.map(r => r.recipe));

      return recipesWithFewestAdditionalIngredients.map(r => r.recipe);
    }

    async function searchRecipesByName(name) {
      const response = await fetch('https://dummyjson.com/recipes/search?q=' + name);
      const data = await response.json();
      const recipes = data.recipes;
  
      console.log('Recipes matching name (' + name + '):');
      console.log(recipes);
    }

    async function searchRecipesByTag(tag) {
      const response = await fetch('https://dummyjson.com/recipes/tag/' + tag);
      const data = await response.json();
      const recipes = data.recipes;
  
      console.log('Recipes matching tag (' + tag + '):');
      console.log(recipes);
    }

    async function searchRecipesByMealType(mealType) {
      const response = await fetch('https://dummyjson.com/recipes/meal-type/' + mealType);
      const data = await response.json();
      const recipes = data.recipes;
  
      console.log('Recipes matching meal type (' + mealType + '):');
      console.log(recipes);
    }
  
    await getRecipesMatchingCart();
    await getRecipesWithFewestAdditionalIngredients();
    // Test searchRecipes with different criteria
    await searchRecipesByName("margherita");
    // await searchRecipesByTag("Pakistani");
    // await searchRecipesByMealType("snack");
  }
  
run();
