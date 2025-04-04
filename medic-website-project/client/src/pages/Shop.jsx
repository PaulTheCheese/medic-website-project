import React, { useState } from "react";
import { allProducts } from "../components/assets/all_products.js";
import { AddToCartModal } from "../components/AddToCartModal/AddToCartModal.jsx";
import { Footer } from "../components/Footer/Footer.jsx";
import { useCart } from "../context/CartContext";
import "./Shop.css";

export const Shop = () => {
    const [search, setSearch] = useState("");
    const [cartModal, setCartModal] = useState({ open: false, product: null, quantity: 1 });
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const { addToCart } = useCart(); // Get addToCart function from context

    // Get unique categories for filter
    const categories = ["all", ...new Set(allProducts.map(product => product.type))];

    // Filter products based on search and filters
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = 
            product.brand.toLowerCase().includes(search.toLowerCase()) ||
            product.generic.toLowerCase().includes(search.toLowerCase()) ||
            product.type.toLowerCase().includes(search.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || product.type === categoryFilter;
        
        const matchesPrice = 
            priceFilter === "all" ||
            (priceFilter === "under50" && product.price < 50) ||
            (priceFilter === "50to100" && product.price >= 50 && product.price <= 100) ||
            (priceFilter === "over100" && product.price > 100);
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const handleAddToCart = (product) => {
        setCartModal({ open: true, product, quantity: 1 });
    };

    const handleCloseModal = () => {
        setCartModal({ open: false, product: null, quantity: 1 });
    };

    const handleConfirmAdd = (selectedQuantity) => {
        addToCart(cartModal.product, selectedQuantity); // Use context's addToCart
        handleCloseModal();
    };

    return (
        <div>
            <div className="shop-container">
                {/* Sidebar for filters and search */}
                <aside className="shop-sidebar">
                    <div className="filter-section">
                        <h3>Search Products</h3>
                        <input
                            type="text"
                            placeholder="Search by brand, generic or type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-bar"
                        />
                    </div>

                    <div className="filter-section">
                        <h3>Categories</h3>
                        <div className="filter-options">
                            {categories.map(category => (
                                <label key={category} className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={categoryFilter === category}
                                        onChange={() => setCategoryFilter(category)}
                                    />
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Price Range</h3>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceFilter === "all"}
                                    onChange={() => setPriceFilter("all")}
                                />
                                All Prices
                            </label>
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceFilter === "under50"}
                                    onChange={() => setPriceFilter("under50")}
                                />
                                Under ₱50
                            </label>
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceFilter === "50to100"}
                                    onChange={() => setPriceFilter("50to100")}
                                />
                                ₱50 - ₱100
                            </label>
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceFilter === "over100"}
                                    onChange={() => setPriceFilter("over100")}
                                />
                                Over ₱100
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Display */}
                <main className="product-list">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-container">
                                    <img src={product.image} alt={product.brand} className="product-image" />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-brand">{product.brand}</h3>
                                    <p className="product-generic">{product.generic}</p>
                                    <div className="product-rating">
                                        <span>⭐ {product.rating}</span>
                                        <span className="rating-max">/ 5</span>
                                    </div>
                                    <p className="product-price">₱{product.price.toFixed(2)}</p>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="add-to-cart-btn"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No products match your search criteria.</p>
                        </div>
                    )}
                </main>

                {/* Modal for Adding to Cart */}
                {cartModal.open && (
                    <AddToCartModal
                        product={cartModal.product}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmAdd}
                        initialQuantity={1}
                    />
                )}
            </div>
            <Footer/>
        </div>
    );
};