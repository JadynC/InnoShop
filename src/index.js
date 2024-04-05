import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for rendering the application
import { BrowserRouter as Router } from 'react-router-dom'; // Importing BrowserRouter for routing
import App from './App'; // Importing the main App component
import './index.css'; // Importing global CSS styles
import { CartProvider } from './contexts/CartContext'; // Importing CartProvider from CartContext

// Creating a root element for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application wrapped in React.StrictMode, Router, and CartProvider
root.render(
  <React.StrictMode>
    <Router> {/* Wrap the App component in Router for routing */}
      <CartProvider> {/* Wrap the App component in CartProvider for cart context */}
        <App /> {/* Rendering the main App component */}
      </CartProvider>
    </Router>
  </React.StrictMode>
);
