import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { NavLink} from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

export const NavBar = () => {
  
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <div className="navbar">
      <div className="nav-logo">
        <FaBookMedical className='nav-logo-icon' />
        <p>CareTech</p>
      </div>

      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Menu */}
      <ul className={isMobile ? "nav-menu mobile-menu" : "nav-menu"}>
        {[
          { path: "/", name: "Home" },
          { path: "/shop", name: "Shop" },
          { path: "/account", name: "Account" },
          { path: "/contact", name: "Contact" }
        ].map((item) => (
          <li key={item.path} onClick={() => setIsMobile(false)}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `link-style ${isActive ? "active" : ""}`}
              end  // Ensures exact matching for home route
            >
              {item.name}
              <hr className="nav-underline" /> {/* Always present but hidden by default */}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Login & Cart */}
      <div className='nav-login-cart'>
        {user ? (
          <button 
            className="nav-login" 
            onClick={() => {
              logout();
              setIsMobile(false);
            }}
          >
            Logout
          </button>
        ) : (
          <button 
            className="nav-login" 
            onClick={() => {
              navigate("/login");
              setIsMobile(false);
            }}
          >
            Login
          </button>
          )}
        <NavLink 
          to='/cart' 
          className={({ isActive }) => isActive ? "active-cart" : ""} 
          onClick={() => setIsMobile(false)}
        >
            <FaCartShopping className='nav-logo-icon' />
            {cartCount > 0 && (
              <div className="nav-cart-count">{cartCount}</div>
            )}
        </NavLink>
      </div>
    </div>
  );
};