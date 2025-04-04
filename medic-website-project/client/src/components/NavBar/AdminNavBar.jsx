import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css'; // Reusing the same CSS file

export const AdminNavBar = () => {
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="nav-logo">
        <p>CareTech Admin</p>
      </div>

      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Menu - Simplified for Admin */}
      <ul className={isMobile ? "nav-menu mobile-menu" : "nav-menu"}>
        {[
          { path: "/admin/products", name: "Products" },
          { path: "/admin/account", name: "Account" }
        ].map((item) => (
          <li key={item.path} onClick={() => setIsMobile(false)}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `link-style ${isActive ? "active" : ""}`}
            >
              {item.name}
              <hr className="nav-underline" />
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className='nav-login-cart'>
        <button 
          className="nav-login" 
          onClick={() => {
            logout();
            setIsMobile(false);
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};