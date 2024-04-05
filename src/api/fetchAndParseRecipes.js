const axios = require('axios');
const fs = require('fs');

/**
 * Fetches all recipes from the dummyJSON API.
 * @returns {Promise<Array>} An array of recipes or an empty array if an error occurs.
 */
async function fetchRecipes() {
    try {
        const response = await axios.get('https://dummyjson.com/recipes');
        return response.data.recipes;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

/**
 * Parses ingredients from recipes and creates a product list with unique products.
 * Each product is then added to the dummyJSON server.
 * @param {Array} recipes - An array of recipes to parse.
 * @returns {Promise<Array>} An array of products created from the recipe ingredients.
 */
async function parseIngredientsAndCreateProductList(recipes) {
    const products = [];
    let idCounter = 1; // Initialize a counter for unique IDs
    for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
            const existingProduct = products.find(product => product && product.title === ingredient);
            if (!existingProduct) {
                const newProduct = {
                    id: idCounter++, // Assign a unique ID and increment the counter
                    title: ingredient,
                    description: `Product information for ${ingredient}`,
                    price: parseFloat((Math.random() * 10).toFixed(2)), // Generate a random price
                    discountPercentage: parseFloat((Math.random() * 10).toFixed(1)), // Generate a random discount percentage
                    rating: Math.round(Math.random() * 5), // Generate a random rating
                    stock: Math.floor(Math.random() * 100), // Generate a random stock quantity
                    brand: 'Generic',
                    category: 'groceries',
                    thumbnail: `https://dummyimage.com/300x300/${Math.floor(Math.random() * 16777215).toString(16)}/fff&text=${ingredient}`, // Generate a random thumbnail image
                    images: [`https://dummyimage.com/300x300/${Math.floor(Math.random() * 16777215).toString(16)}/fff&text=${ingredient}`] // Generate a random image
                };
                await addProduct(newProduct); // Simulate adding the product
                products.push(newProduct); // Add the product with the unique ID to the array
            }
        }
    }
    return products;
}

/**
 * Simulates adding a product to the dummyJSON server.
 * @param {Object} product - The product to add.
 * @returns {Promise<Object|null>} The added product or null if an error occurs.
 */
async function addProduct(product) {
    try {
        const response = await axios.post('https://dummyjson.com/products/add', product);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

/**
 * Saves a list of products as a JSON file locally.
 * @param {Array} products - The list of products to save.
 */
function saveProductListLocally(products) {
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
}

/**
 * Main function that fetches recipes, parses them to create a product list, 
 * and saves the product list locally.
 */
async function main() {
    const recipes = await fetchRecipes();
    const productList = await parseIngredientsAndCreateProductList(recipes);
    saveProductListLocally(productList);
    console.log('Product list saved locally as products.json');
}

main();
