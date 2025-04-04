import React, { useState } from 'react';
import './AddToCartModal.css';

export const AddToCartModal = ({ 
  product, 
  onClose,
  onConfirm,
  initialQuantity = 1 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleConfirm = () => {
    onConfirm(quantity); // Let parent component handle the cart logic
    onClose();
  };

  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add to Cart</h2>
          <button onClick={onClose} className="close-modal">&times;</button>
        </div>
        <div className="modal-body">
          <p className="modal-product-name">{product.brand}</p>
          <p className="modal-product-price">Price: ₱{product.price.toFixed(2)}</p>
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <p className="modal-total">
            Total: ₱{(product.price * quantity).toFixed(2)}
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleConfirm} className="confirm-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};