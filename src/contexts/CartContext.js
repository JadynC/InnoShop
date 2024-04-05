

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the shopping cart
const CartContext = createContext();

// Provide the cart context to components
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const userId = 1; // Assuming a fixed user ID for simulation

  // // Simulate fetching cart items from the API
  // useEffect(() => {  
  //   const fetchCartItems = async () => {
  //     const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
  //     const data = await response.json();
  //     setCartItems(data.carts[0].products);
  //   };
  //   fetchCartItems();
  // }, []);

  // Function to add a product to the cart
  // Inputs: product (object with id, title, price, etc.)
  // Outputs: None (updates cartItems state)
  const addToCart = async (product) => {
    // Update cart state with the new product or increase quantity if it already exists
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // Simulate API call to add product to the cart
    await fetch(`https://dummyjson.com/carts/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merge: true,
        products: [{ id: product.id, quantity: 1 }],
      }),
    });
  };

  // Function to remove a product from the cart
  // Inputs: productId (number)
  // Outputs: None (updates cartItems state)
  const removeFromCart = async (productId) => {
    // Update cart state to remove the product
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    // Simulate API call to remove product from the cart
    await fetch(`https://dummyjson.com/carts/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merge: true,
        products: [{ id: productId, quantity: 0 }],
      }),
    });
  };

  // Function to update the quantity of a product in the cart
  // Inputs: productId (number), quantity (number)
  // Outputs: None (updates cartItems state)
  const updateQuantity = async (productId, quantity) => {
    // Update cart state with the new quantity
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
    // Simulate API call to update product quantity in the cart
    await fetch(`https://dummyjson.com/carts/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merge: true,
        products: [{ id: productId, quantity: Math.max(quantity, 1) }],
      }),
    });
  };

  return (
    // Provide the cart context to child components
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
// Inputs: None
// Outputs: cartItems (array), addToCart (function), removeFromCart (function), updateQuantity (function)
export const useCart = () => useContext(CartContext);
