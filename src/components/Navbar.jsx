import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaRegCommentDots } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import './Navbar.css'

/**
 * The Navbar component provides navigation links and displays the cart icon with a count of items in the cart.
 * @param {Function} onSearch - Function to handle search input (not used in this implementation).
 */
const Navbar = ({ onSearch }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaRegCommentDots /> InnoShop
        </Link>
        <Link to="/cart" className="navbar-cart">
          {totalItems > 0 && <div className="cart-bubble">{totalItems}</div>}
          <FaShoppingCart />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
