import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importing axios for making API requests
import GroceryItem from '../components/GroceryItem'; // Importing the GroceryItem component
import Slider from 'react-slick'; // Importing the Slider component from react-slick
import 'slick-carousel/slick/slick.css'; // Importing CSS for slick carousel
import 'slick-carousel/slick/slick-theme.css'; // Importing CSS for slick carousel theme
import bannerImage from '../assets/banner.png'; // Importing the banner image
import './HomePage.css' // Importing CSS for styling the HomePage
import { FaSearch } from 'react-icons/fa'; // Importing the search icon from react-icons

/**
 * HomePage component that displays recommended items, all groceries, and provides sorting and searching functionality.
 */
const HomePage = () => {
  const [products, setProducts] = useState([]); // State to store all products
  const [displayedItems, setDisplayedItems] = useState([]); // State to store currently displayed items
  const [recommended, setRecommended] = useState([]); // State to store recommended items
  const [sortBy, setSortBy] = useState(''); // State to store the sorting criteria
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [currentPage, setCurrentPage] = useState(1); // State to store the current page for pagination
  const itemsPerPage = 20; // Constant for items per page

  // Effect to fetch products from the API and set recommended items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products.json');
        setProducts(response.data);
        setRecommended(response.data.sort(() => 0.5 - Math.random()).slice(0, 10)); // Setting recommended items
        updateDisplayedItems(response.data, 1, '', ''); // Initialize displayed items
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Effect to update displayed items based on sorting, pagination, and search query
  useEffect(() => {
    updateDisplayedItems(products, currentPage, sortBy, searchQuery);
  }, [sortBy, currentPage, products, searchQuery]);

  /**
   * Updates the displayed items based on the provided parameters.
   * @param {Array} items - The list of items to be displayed.
   * @param {number} page - The current page number for pagination.
   * @param {string} sort - The sorting criteria.
   * @param {string} query - The search query.
   */
  const updateDisplayedItems = (items, page, sort, query) => {
    let filteredProducts = items.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    let sortedProducts = [...filteredProducts];
    if (sortBy === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    setDisplayedItems(currentItems);
  };

  // Slider settings for the recommended items section
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  // Function to navigate to the next page
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <img src={bannerImage} alt="Groceries Banner" style={{ width: '100%', display: 'block' }} />
      <div className="section-background">
        <h2 className="section-title">Recommended Items</h2>
        <Slider {...settings}>
          {recommended.map((item) => (
            <div key={item.id}>
              <GroceryItem product={item} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="section-background">
        <h2 className="section-title">All Groceries</h2>
        <div className="sort-dropdown">
          <div className="search-container">
            <FaSearch />
            <input
              className="search-input"
              type="text"
              placeholder="Search for groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Select</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="groceries-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
          {displayedItems.map(product => (
            <GroceryItem key={product.id} product={product} />
          ))}
        </div>

        <div className="pagination-buttons">
          {currentPage > 1 && <button className="button-modern-hp" onClick={prevPage}>Previous</button>}
          {currentPage * itemsPerPage < products.length && <button className="button-modern-hp" onClick={nextPage}>Next</button>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
