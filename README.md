# InnoShop: A React-based E-commerce Platform

## Task Overview

In this technical case study, the task is creating a web page for an e-commerce platform using React. The platform requires interaction with a product database, which will be simulated using the [dummy API](https://dummyjson.com/docs). 

### Key Features:

Customers should be able to:

- See a list of purchasable products
- Add, edit, and delete items from their cart
- Search for products by name or category

Note: The dummy API will not actually perform the action on the server, but the page should reflect the action correctly after the API call is successful.

### Tools and Libraries:

Free to use design libraries like Bootstrap or Ant Design and any other tools you find necessary.

## General Plan

The website, named **InnoShop**, will focus on groceries as a unique category of products. It will allow users to view groceries, popular items, search for items by key terms, add them to the cart, and edit the quantity or remove items. 

### Unique Feature: AI Virtual Assistant - Lucy

To make InnoShop unique, it will feature a virtual assistant called Lucy, powered by the OpenAI API. Lucy will provide potential recipes based on the items from the cart, recommend recipes that need a few more ingredients, and add them to the cart. She will also respond to user requests for specific types of recipes and add all the necessary ingredients to the basket.

## Key Elements

### Grocery Database

- Use dummyJSON's recipes library and parse for ingredients.
- Add each unique ingredient to the dummyJSON product library with a random price, rating, brand, and a generic description.
- Store the new product database locally as a JSON file for use by the web app.

### Shopping Page

- Display highest-rated items (recommended) and all items.
- Provide options to filter by price and rating.
- Allow users to add items to the cart.

### Grocery Item

- Display details about the product, including its description, rating, price, and name.
- Provide options to add to cart and specify quantity.

### Cart

- Simulate all cart operations with dummyJSON's REST API.
- Allow users to change quantity, remove items, and proceed to a temporary checkout page.

### Search

- Implement a search bar in the navigation bar to search for specific items by keywords.
- Display a list of items that match the search.

### AI Virtual Assistant - Lucy

- Lucy will be accessible as a popup in the bottom right corner of the web page as a chat interface.
- She can provide recipe recommendations, add ingredients to the cart, and respond to user requests for specific types of recipes.
- She uses a local backend that parses user requests and sends results and expectations to OpenAI that then returns a processed response.

## Running the Project

To run this project, simply execute the following command:

```bash
npm i && npm start
```

## Project Structure

- **Src/contexts/CartContext.js**: Manages the shopping cart state and provides functions to add, remove, and update items in the cart.
- **Public/index.html**: Serves as the entry point for the React application.
- **src/api/fetchAndParseRecipes.js**: Fetches recipe data, extracts ingredients, and creates a unique product list.
- **src/components/Footer.jsx**: Provides a footer for the website with copyright information and useful links.
- **src/components/GroceryItem.jsx**: Displays a single grocery item's details and provides an "Add to Cart" button.
- **src/components/LucyChat.jsx**: Provides a chat interface for interacting with Lucy, the virtual cooking assistant.
- **src/components/Navbar.jsx**: Provides a navigation bar with links to the home page and the shopping cart page.
- **src/pages/CheckoutPage.jsx**: Provides a temporary checkout page for the application.
- **src/pages/HomePage.jsx**: Serves as the main page of the application, displaying recommended items and all groceries.
- **src/pages/ItemPage.jsx**: Displays the details of a single item.
- **src/pages/ShoppingCartPage.jsx**: Displays the shopping cart page of the application.

## Environment Variables

- **.env**: Stores the API key for accessing the OpenAI API.

## Version Control

- **.gitignore**: Specifies which files and directories Git should ignore and not track.

## Dependency Management

- **package.json**: Contains metadata about the project, its dependencies, and scripts for running tasks.