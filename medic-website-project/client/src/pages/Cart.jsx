import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import './Cart.css'; // We'll create this CSS file

export const Cart = () => {
  const { cartItems, cartCount, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartCount === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/shop" className="shop-link">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img 
                  src={item.image} 
                  alt={item.brand} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.brand}</h3>
                  <p className="cart-item-generic">{item.generic}</p>
                  <p className="cart-item-price">₱{item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <span>Qty: {item.quantity}</span>
                  <p className="cart-item-subtotal">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button 
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTimes className="remove-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cartCount})</span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{totalPrice > 50 ? 'Free' : '₱5.99'}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₱{(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₱{(totalPrice + (totalPrice > 50 ? 0 : 5.99) + (totalPrice * 0.08)).toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

