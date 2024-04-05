import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importing Routes and Route from react-router-dom for routing
import HomePage from './pages/HomePage'; // Importing HomePage component
import Navbar from './components/Navbar'; // Importing Navbar component
import { CartProvider } from './contexts/CartContext'; // Importing CartProvider from CartContext
import ShoppingCartPage from './pages/ShoppingCartPage'; // Importing ShoppingCartPage component
import CheckoutPage from './pages/CheckoutPage'; // Importing CheckoutPage component
import ItemPage from './pages/ItemPage'; // Importing ItemPage component
import LucyChat from './components/LucyChat'; // Importing LucyChat component
import Footer from './components/Footer'; // Importing Footer component

/**
 * App component that defines the main structure of the application.
 */
const App = () => {
  return (
    <CartProvider> {/* Providing CartContext to all child components */}
      <Navbar /> {/* Rendering the Navbar component */}
      <LucyChat /> {/* Rendering the LucyChat component */}
      <Routes>
        {/* Defining routes for different pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
      </Routes>
      <Footer /> {/* Rendering the Footer component */}
    </CartProvider>
  );
};

export default App;
