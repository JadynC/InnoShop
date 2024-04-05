import React, { useState, useEffect } from 'react';
import OpenAI from 'openai'; // Importing the OpenAI library to interact with the GPT-3 model
import { useCart } from '../contexts/CartContext'; // Importing the Cart context to use its functionality
import './LucyChat.css'; // Importing CSS for styling the chat interface
import products from '../products.json'; // Importing the local product database
import { FaStar, FaRegCommentDots } from 'react-icons/fa'; // Importing icons for the chat interface

/**
 * Fetches all recipes from the dummyJSON API.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe objects.
 */
async function fetchProducts() {
  const response = await fetch('public/products.json');
  const products = await response.json();
  return products;
}

/**
 * Finds recipes that can be made with the items in the user's cart.
 * @param {Array<string>} cartItems - An array of item titles in the user's cart.
 * @returns {Promise<Array>} A promise that resolves to an array of matching recipe objects.
 */
async function getRecipesMatchingCart(cartItems) {
  const response = await fetch('https://dummyjson.com/recipes');
  const data = await response.json();
  const recipes = data.recipes;

  const matchingRecipes = recipes.filter(recipe =>
    recipe.ingredients.every(ingredient => cartItems.includes(ingredient))
  );

  return matchingRecipes;
}

/**
 * Finds recipes with the fewest additional ingredients needed beyond what's in the user's cart.
 * @param {Array<string>} cartItems - An array of item titles in the user's cart.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe objects with the fewest additional ingredients.
 */
async function getRecipesWithFewestAdditionalIngredients(cartItems) {
  const response = await fetch('https://dummyjson.com/recipes');
  const data = await response.json();
  const recipes = data.recipes;

  const recipesWithAdditionalIngredients = recipes.map(recipe => {
    const additionalIngredients = recipe.ingredients.filter(ingredient => !cartItems.includes(ingredient));
    return { recipe, additionalIngredientsCount: additionalIngredients.length };
  });

  const minAdditionalIngredients = Math.min(...recipesWithAdditionalIngredients.map(r => r.additionalIngredientsCount));
  const recipesWithFewestAdditionalIngredients = recipesWithAdditionalIngredients.filter(r => r.additionalIngredientsCount === minAdditionalIngredients);

  console.log('Recipes with fewest additional ingredients:');
  console.log(recipesWithFewestAdditionalIngredients.map(r => r.recipe));

  return recipesWithFewestAdditionalIngredients.map(r => r.recipe);
}

/**
 * Searches for recipes based on a given search query and category.
 * @param {string} name - The search query or category.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe objects matching the search criteria.
 */
async function searchRecipes(name) {
  const uniqueRecipes = new Map();

  const addToUniqueRecipes = (recipes) => {
    recipes.forEach(recipe => {
      if (!uniqueRecipes.has(recipe.id)) {
        uniqueRecipes.set(recipe.id, recipe);
      }
    });
  };

  let response = await fetch('https://dummyjson.com/recipes/search?q=' + name);
  let data = await response.json();
  addToUniqueRecipes(data.recipes);

  response = await fetch('https://dummyjson.com/recipes/tag/' + name);
  data = await response.json();
  addToUniqueRecipes(data.recipes);

  response = await fetch('https://dummyjson.com/recipes/meal-type/' + name);
  data = await response.json();
  addToUniqueRecipes(data.recipes);

  return Array.from(uniqueRecipes.values());
}

/**
 * Component representing the Lucy chat interface.
 */
const LucyChat = () => {
  const [userInput, setUserInput] = useState(''); // State to store the user's input
  const [conversationHistory, setConversationHistory] = useState([ // State to store the conversation history
    { sender: 'lucy', text: 'Hi there! I\'m Lucy, your virtual cooking assistant. How can I help you today? :)' }
  ]);  
  const [isSending, setIsSending] = useState(false); // State to indicate whether a message is being sent
  const [openai, setOpenai] = useState(null); // State to store the OpenAI instance
  const [assistant, setAssistant] = useState(null); // State to store the assistant instance
  const [thread, setThread] = useState(null); // State to store the thread instance
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(); // Using the Cart context
  const [matchingRecipes, setMatchingRecipes] = useState([]); // State to store matching recipes
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the recipe modal
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to store the selected recipe
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control the visibility of the chat interface

  /**
   * Toggles the visibility of the chat interface.
   */
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  /**
   * Handles the click event on a recipe card, opening the recipe modal.
   * @param {Object} recipe - The clicked recipe object.
   */
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  /**
   * Closes the recipe modal.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };
  
  /**
   * Closes the recipe modal.
   */
  const removeAllFromCart = () => {
    cartItems.forEach(item => {
      removeFromCart(item.id);
    });
  };
  
  /**
   * Updates the quantity of an item in the cart.
   * @param {string} itemName - The name of the item to update.
   * @param {string} action - The action to perform ('increase', 'decrease', 'add', or 'subtract').
   * @param {number} value - The amount to adjust the quantity by.
   */
  const updateItemQuantity = (itemName, action, value) => {
    const item = cartItems.find(item => item.title.toLowerCase() === itemName.toLowerCase());
    if (item) {
      const amount = (action === 'increase' || action === 'add') ? value : -value;
      updateQuantity(item.id, item.quantity + amount);
    } else {
      console.error(`Item ${itemName} not found in cart.`);
    }
  };  

  useEffect(() => {
    // Fetch all recipes from dummyJSON and initialize OpenAI assistant on component mount
    const fetchRecipes = async () => {
      const response = await fetch('https://dummyjson.com/recipes');
      const data = await response.json();
      setMatchingRecipes(data.recipes);
    };
    fetchRecipes();
    // Initialize OpenAI and create an assistant
    const initOpenAI = async () => {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const assistant = await openai.beta.assistants.create({
        name: "Lucy",
        instructions: "You are a virtual assistant for providing recipe recommendations based on ingredients in the user's cart. You do not need to verify any of the backend processes, they will be passed to you, all you have to do is convert what the user wanted to do and the results to natural language. Lucy acts as a knowledgeable cooking friend, providing friendly advice and responses. She responds in a way that feels personal and relatable, not overly robotic.Lucy provides succinct and contextually relevant information to minimize the need for additional user prompts and to conserve API calls. You will recieve information from the backend about user requests which you are to process into coherent phrases. If you recieve an 'N' it means that no matching results were found",
        tools: [{ type: "retrieval" }],
        model: "gpt-3.5-turbo-0125"
      });

      const thread = await openai.beta.threads.create();

      setOpenai(openai);
      setAssistant(assistant);
      setThread(thread);
    };

    initOpenAI();
  }, []);

  /**
   * Handles changes to the user input field.
   * @param {Event} e - The event object.
   */
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    if (e.key === 'Enter') {
      sendMessageToLucy();
    }
  };

  /**
   * Sends the user's message to Lucy and processes the response.
   */
  const sendMessageToLucy = async () => {
    if (!userInput.trim() || !openai || !assistant || !thread) return;
  
    setIsSending(true);
    setConversationHistory([...conversationHistory, { sender: 'user', text: userInput }]);
  
    try {
      // Parse user input and determine the appropriate action
      const action = parseUserInput(userInput, matchingRecipes);
  
      let responseMessage = '';
      let tmp = '';
      let responseMessageBackend  = [];
      // Call the appropriate recipe function based on the user's input
      switch (action.type) {
        case 'getRecipesMatchingCart':
          const matchingRecipes = await getRecipesMatchingCart(cartItems.map(item => item.title));
          [tmp, responseMessageBackend] = formatRecipesResponse(matchingRecipes);
          responseMessage = "The user requested recipes that can be made with exactly the items in their cart. The backend algorithm returned these potential recipes. Report them so that the user can decide one they like. Pretend that you are the one who performed the task. Backend result:" + tmp;
          break;
        case 'getRecipesWithFewestAdditionalIngredients':
          const closestRecipes = await getRecipesWithFewestAdditionalIngredients(cartItems.map(item => item.title));
          [tmp, responseMessageBackend] = formatRecipesResponse(closestRecipes);
          responseMessage = "The user requested the closest recipes that can be made with the items in their cart. The backend algorithm returned these potential recipes. Report them so that the user can decide one they like. Pretend that you are the one who performed the task. Backend result:" + tmp;
          break;
        case 'searchRecipes':
          const searchResults = await searchRecipes(action.category);
          [tmp, responseMessageBackend] = formatRecipesResponse(searchResults);
          responseMessage = "The user requested recipes that match the search for " + action.category + ". The backend algorithm returned these potential recipes. Report them so that the user can decide one they like. Pretend that you are the one who performed the task. Backend result:" + tmp;
          break;
        case 'addIngredientsToCart':
          action.recipe.ingredients.forEach(ingredient => {
              const product = products.find(product => product.title.toLowerCase() === ingredient.toLowerCase());
              if (product) {
                addToCart(product);
              }
            });
            responseMessage = 'The user chose the recipe ' + action.recipe.name + ' and added all its ingredients to their cart. The backend has sucessfully done this. Let the user know. Pretend that you are the one who performed the task.';
            break;
        case 'removeAllFromCart':
          removeAllFromCart(); 
          responseMessage = 'The user has removed all items from their cart. The backend has sucessfully done this. Let the user know. Pretend that you are the one who performed the task.';
          break;
        case 'updateItemQuantity':
          updateItemQuantity(action.itemName, action.action, action.value);
          responseMessage = `The quantity of ${action.itemName} has been ${action.action}d by ${action.value}. The backend has sucessfully done this. Let the user know. Pretend that you are the one who performed the task.`;
          break;
        default:
        responseMessage = 'The parser did not understand what the user was attempting to say. Inform the user. Pretend that you are the one who did not understand.';
      }
  
      // Send responseMessage to Lucy
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: responseMessage
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id
      });
  
      // Wait for Lucy's response
      let lucyResponse = '';
      let runStatus = '';
      console.log("User input:", userInput);
      console.log("Determined action:", action);

      console.log("Response message to Lucy:", responseMessage);
      console.log("Backend response for chat:", responseMessageBackend);

      console.log("Assistant ID:", assistant.id);
      console.log("Thread ID:", thread.id);

      do {
        const runResponse = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        runStatus = runResponse.status;
        // console.log('Run response:', runResponse); // Log the run response
      
        if (runStatus === "completed") {
          const messagesResponse = await openai.beta.threads.messages.list(thread.id);
          console.log('Messages response:', messagesResponse); // Log the messages response
      
          const assistantMessages = messagesResponse.data.filter(msg => msg.role === 'assistant');
          // Filter the assistant messages by the current run ID
          const currentRunMessages = assistantMessages.filter(msg => msg.run_id === run.id);

          // Get the last assistant message for the current run
          const lastAssistantMessage = currentRunMessages[currentRunMessages.length - 1];
          console.log('Assistant messages:', assistantMessages);
          console.log('Last Assistant message:', lastAssistantMessage);

          if (lastAssistantMessage) {
            lucyResponse = lastAssistantMessage.content[0].text.value;  
          }
          break;
        } else if (runStatus === "failed") {
          lucyResponse = 'Sorry, I encountered an error processing your request.';
          break;
        }
      } while (runStatus === "queued" || runStatus === "in_progress");
    
      // Update the conversation history with Lucy's response
      setConversationHistory(prev => [
        ...prev,
        { sender: 'lucy', text: lucyResponse, recipes: Object.values(responseMessageBackend) }
      ]);
      console.log("Lucy's response:", lucyResponse);
      console.log("Updated conversation history:", [...conversationHistory, { sender: 'lucy', text: lucyResponse, recipes: responseMessageBackend }]);
      console.log("Run response:", runStatus);
 
    } catch (error) {
      console.error('Error processing message:', error);
      setConversationHistory(prev => [...prev, { sender: 'lucy', text: 'Sorry, something went wrong.' }]);
    } finally {
      setIsSending(false);
      setUserInput('');
    }
  };

  // Display HTML and CSS inclduing recipe modal, chat window and icons
  return (
  <>
    <div className="chat-bubble" onClick={toggleChat}>
      <FaRegCommentDots />
    </div>
      {isChatOpen && (
        <div className={`lucy-chat-container`}>
        <>
          <div className="conversation">
            {conversationHistory.map((entry, index) => (
              <div key={index} className={`message ${entry.sender}`}>
                <div>{entry.text}</div>
                {entry.recipes && entry.recipes.map((recipe, recipeIndex) => (
                  <div key={recipeIndex} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                    <div className="recipe-name">{recipe.name}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); sendMessageToLucy(); }}>
            <div className="message-input">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyPress={handleUserInput}
                placeholder="Ask Lucy for help..."
                disabled={isSending}
              />
              <button type="submit" disabled={isSending || !openai || !assistant || !thread}>
                Send
              </button>
            </div>
          </form>
        </>
        </div>
      )}
    {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          {selectedRecipe && (
            <>
              <h2>{selectedRecipe.name}</h2>
              <h3><FaStar /> {selectedRecipe.rating}</h3>
              <img className='recipe-message' width={500} src={selectedRecipe.image} alt={selectedRecipe.name} />
              <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(', ')}</p>
              <p><strong>Instructions:</strong> {selectedRecipe.instructions.join(' ')}</p>
              <p><strong>Prep Time:</strong> {selectedRecipe.prepTimeMinutes} minutes</p>
              <p><strong>Cook Time:</strong> {selectedRecipe.cookTimeMinutes} minutes</p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
            </>
          )}
        </div>
      </div>
    )}
  </>
);
  
};

export default LucyChat;

// Helper functions to parse user input, format responses, and interact with the cart

/**
 * Parses the user's input to determine the intended action.
 * @param {string} input - The user's input message.
 * @param {Array<Object>} recipes - The list of available recipes.
 * @returns {Object} An object representing the determined action and any relevant data.
 */
function parseUserInput(input, recipes) {
  // Example implementation
  if (input.includes('what can I make')) {
    return { type: 'getRecipesMatchingCart' };
  } else if (input.includes('closest recipes')) {
    return { type: 'getRecipesWithFewestAdditionalIngredients' };
  } else if (input.startsWith('search')) {
    // Extract the search query and category from the input
    const parts = input.split(' ');
    const query = parts[1];
    const category = parts[2]; // e.g., 'name', 'tag', or 'mealType'
    return { type: 'searchRecipes', category };
  } else if (input.startsWith('add ingredients for')) {
    const recipeName = input.replace('add ingredients for ', '');
    const recipe = recipes.find(r => r.name.toLowerCase() === recipeName.toLowerCase());
    if (recipe) {
      return { type: 'addIngredientsToCart', recipe };
    }
  } else if (input.includes('remove all') || input.includes('clear all')) {
    return { type: 'removeAllFromCart' };
  }
  const increasePattern = /increase the quantity of '([^']*)' by (\d+)/;
  const decreasePattern = /decrease the quantity of '([^']*)' by (\d+)/;
  const addPattern = /add the quantity of '([^']*)' by (\d+)/;
  const subtractPattern = /subtract the quantity of '([^']*)' by (\d+)/;

  if (increasePattern.test(input)) {
    const [, itemName, value] = input.match(increasePattern);
    return { type: 'updateItemQuantity', itemName, action: 'increase', value: parseInt(value, 10) };
  } else if (decreasePattern.test(input)) {
    const [, itemName, value] = input.match(decreasePattern);
    return { type: 'updateItemQuantity', itemName, action: 'decrease', value: parseInt(value, 10) };
  } else if (addPattern.test(input)) {
    const [, itemName, value] = input.match(addPattern);
    return { type: 'updateItemQuantity', itemName, action: 'add', value: parseInt(value, 10) };
  } else if (subtractPattern.test(input)) {
    const [, itemName, value] = input.match(subtractPattern);
    return { type: 'updateItemQuantity', itemName, action: 'subtract', value: parseInt(value, 10) };
  }
  return { type: 'unknown' };
}

/**
 * Formats the response for the recipes to be displayed in the chat interface.
 * @param {Array<Object>} recipes - The list of recipes to format.
 * @returns {Array} An array containing the formatted response message for the AI and the backend response.
 */
function formatRecipesResponse(recipes) {
  if (recipes.length === 0) {
    return 'No recipes found.';
  }
  const responseMessageAI = recipes.map(recipe => `${recipe.name}`).join(', ');
  const responseMessageBckEnd = recipes; // Array of recipe objects
  return [ responseMessageAI, Object.values(responseMessageBckEnd) ];
}