import React from 'react';
import { Link } from 'react-router-dom';
import background from '../assets/background.png';
import './CheckoutPage.css'

/**
 * The CheckoutPage component provides a temporary checkout page with a banner and a message.
 */
const CheckoutPage = () => {
  return (
    <div className="checkout-page">
      <img src={background} alt="Checkout Banner" className="checkout-banner" />
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-container">
        <p>This is a temporary checkout page.</p>
        <a href="/" className="return-home-button">Return to Home</a> 
      </div>
    </div>
  );
};

export default CheckoutPage;
