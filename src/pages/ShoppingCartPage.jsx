import React from 'react';
import { useCart } from '../contexts/CartContext'; // Importing the useCart hook from CartContext
import { Link } from 'react-router-dom'; // Importing Link from react-router-dom for navigation
import './ShoppingCartPage.css'; // Importing CSS for styling the ShoppingCartPage

/**
 * ShoppingCartPage component that displays the items in the shopping cart and a summary.
 */
const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart(); // Destructuring functions from useCart
  const taxRate = 0.11; // Fixed tax rate for calculation

  // Calculating subtotal, total tax, and total amount
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalTax = subtotal * taxRate;
  const total = subtotal + totalTax;

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cartItems.map((item) => ( // Iterating over cart items and displaying each item
          <div key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.title} />
            <div>
              <h2>{item.title}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button className='button-modern-edit' onClick={() => removeFromCart(item.id)}>Remove</button>
              <button className='button-modern-edit' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className='button-modern-edit' onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${totalTax.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
        <Link to="/checkout"><button className='checkout-button'>Checkout</button></Link>
        <Link to="/"><button className='continue-shopping-button'>Continue Shopping</button></Link>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
