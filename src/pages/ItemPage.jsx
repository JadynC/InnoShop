import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importing useParams to access URL parameters
import { useCart } from '../contexts/CartContext'; // Importing the useCart hook from CartContext
import { FaStar } from 'react-icons/fa';  // Importing the FaStar icon component from react-icons
import './ItemPage.css' // Importing CSS for styling the ItemPage

/**
 * ItemPage component that displays the details of a single item.
 */
const ItemPage = () => {
  const { id } = useParams(); // Extracting the item ID from the URL parameters
  const [item, setItem] = useState(null); // State to store the item details
  const { addToCart } = useCart(); // Destructuring the addToCart function from useCart

  // Fetch the item details based on the item ID
  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch('/products.json'); // Adjust the path to your products JSON file
      const data = await response.json();
      const foundItem = data.find((item) => item.id.toString() === id); // Find the item with the matching ID
      setItem(foundItem); // Set the item state with the found item
    };

    fetchItem();
  }, [id]); // Dependency array to trigger the useEffect when the item ID changes

  if (!item) {
    return <div>Loading...</div>; // Display a loading message while the item details are being fetched
  }

  return (
    <div className="item-page">
      <div className="item-image">
        <img src={item.thumbnail} alt={item.title} /> {/* Display the item thumbnail */}
      </div>
      <div className="item-details">
        <h2>{item.title}</h2> {/* Display the item title */}
        <h3><b>{item.category}</b></h3> {/* Display the item category */}
        <p>Price: ${item.price}</p> {/* Display the item price */}
        <p><i>Discount: {item.discountPercentage}% off</i></p> {/* Display the item discount percentage */}
        <div>
            <FaStar /> {item.rating} {/* Display the item rating with a star icon */}
        </div>
        <p>{item.description}</p> {/* Display the item description */}
        <p>{item.stock} left!</p> {/* Display the remaining stock */}
        <button className="add-to-cart-btn" onClick={() => addToCart(item)}>Add to Cart</button> {/* Button to add the item to the cart */}
      </div>
    </div>
  );
};

export default ItemPage;
