import React from 'react'
import { FaBookMedical } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import './Footer.css'

export const Footer = () => {
    return (
        <footer className="footer">
          <div className='footer-logo'>
            <FaBookMedical className='footer-icon'/>
            <p>CareTech</p>
          </div>
          <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
          <div className="footer-social-icon">
            <div className="footer-icons-container">
                <FaInstagramSquare className='footer-icon'/>
            </div>
            <div className="footer-icons-container">
                <FaPinterest className='footer-icon'/>
            </div>
            <div className="footer-icons-container">    
                <FaSquareXTwitter className='footer-icon'/>
            </div>
          </div>
          <div className="footer-copyright">
            <hr />
            <p>&copy; 2023 CareTech. All rights reserved.</p>
          </div>
        </footer>
      );
    };

