import React, { useState } from 'react';
import { AddToCartModal } from '../components/AddToCartModal/AddToCartModal';
import { allProducts } from '../components/assets/all_products.js'; 
import './Home.css';
import { Footer } from '../components/Footer/Footer.jsx';
import { Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";


export const Home = () => {
  // Sample medicine data
  const featuredMedicines = allProducts.slice(0, 3);
  const allMedicines = allProducts.slice(3, 12); // Adjust the slice as needed


  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalState, setModalState] = useState({
    open: false,
    product: null,
    quantity: 1
  });

  const { addToCart } = useCart();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredMedicines.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredMedicines.length - 1 : prev - 1));
  };

  const handleAddToCart = (product) => {
    setModalState({
      open: true,
      product,
      quantity: 1
    });
  };

  const handleCloseModal = () => {
    setModalState({
      open: false,
      product: null,
      quantity: 1
    });
  };

  const handleConfirmAdd = (selectedQuantity) => {
        addToCart(modalState.product, selectedQuantity); // Use context's addToCart
        handleCloseModal();
    };

  



  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Trusted Online Pharmacy</h1>
          <p>Quality medicines delivered to your doorstep</p>
          <Link to="/shop"><button className="cta-button">Shop Now</button></Link>
        </div>
      </section>

      {/* Featured Medicines Carousel */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredMedicines.map((medicine) => (
              <div key={medicine.id} className="carousel-slide">
                <div className="slide-content">
                  <div className="slide-image-container">
                    <img src={medicine.image} alt={medicine.name} className="home-image-style"/>
                  </div>
                  <div className="slide-info">
                    <h3>{medicine.name}</h3>
                    <p className="medicine-description">{medicine.description}</p>
                    <p className="medicine-price">${medicine.price}</p>
                    {medicine.requiresPrescription && (
                      <span className="prescription-badge">Requires Prescription</span>
                    )}
                    <button className="add-to-cart" onClick={() => handleAddToCart(medicine)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={prevSlide} className="carousel-button prev">
            &lt;
          </button>
          <button onClick={nextSlide} className="carousel-button next">
            &gt;
          </button>
        </div>
        
        <div className="carousel-indicators">
          {featuredMedicines.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* All Medicines Grid */}
      <section className="products-section">
        <h2>Our Products</h2>
        <div className="products-grid">
          {allMedicines.map((medicine) => (
            <div key={medicine.id} className="product-card">
              <img src={medicine.image} alt={medicine.name} className='home-image-style'/>
              <div className="card-body">
                <h3>{medicine.name}</h3>
                <p className="card-description">{medicine.description}</p>
                <div className="card-footer">
                  <p className="card-price">${medicine.price}</p>
                  {medicine.requiresPrescription && (
                    <span className="prescription-tag">Prescription</span>
                  )}
                </div>
                <button className="card-button" onClick={() => handleAddToCart(medicine)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="trust-container">
          <h2>Why Choose Our Pharmacy?</h2>
          <div className="badges-grid">
            <div className="badge">
              <div className="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              </div>
              <h3>Verified Medications</h3>
              <p>All products are FDA-approved and sourced from licensed manufacturers</p>
            </div>
            
            <div className="badge">
              <div className="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              <h3>Price Match Guarantee</h3>
              <p>We'll match any competitor's price on equivalent medications</p>
            </div>
            
            <div className="badge">
              <div className="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                </svg>
              </div>
              <h3>Free Delivery</h3>
              <p>Free shipping on all orders over $50</p>
            </div>
            
            <div className="badge">
              <div className="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.19-9 7 0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-2h2v2c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-3h1c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.81-4.03-7-9-7zm2 11h-4v-1h4v1zm0-2h-4v-1h4v1zm1.5-5h-1.5V6h-1v1H13V6h-1v1h-1.5V6h-1v1H9V6H8v1H6.5V6H5v4.5c0 .28.22.5.5.5H7v1H5.5c-.28 0-.5.22-.5.5V13H5v-1h1.5v1H7v-1h9v1h.5v-1H19v-1h-1.5c-.28 0-.5-.22-.5-.5V11h1.5c.28 0 .5-.22.5-.5V6h-1.5v1z"/>
                </svg>
              </div>
              <h3>Pharmacist Support</h3>
              <p>24/7 access to licensed pharmacists</p>
            </div>
          </div>
        </div>
      </section>
      {/* Add To Cart Modal */}
      <AddToCartModal
        product={modalState.product}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        initialQuantity={modalState.quantity}
        open={modalState.open}
      />
      <Footer />
    </div>
  );
};

