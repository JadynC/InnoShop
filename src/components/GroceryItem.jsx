import React from 'react';
import { FaStar } from 'react-icons/fa'; 
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import './GroceryItem.css'

/**
 * Component representing a single grocery item.
 * @param {Object} product - The product object containing details of the grocery item.
 */
const GroceryItem = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="grocery-item">
      <Link to={`/item/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} />
        </Link>
        <h2>{product.title}</h2>
        <p>${product.price} </p>
        <p><b><span className="discount">{product.discountPercentage}% off</span></b></p>
        <div>
            <FaStar /> {product.rating} 
        </div>
      
      {/* Add more product details as needed */}
      <button className="button-modern" onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default GroceryItem;
