import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios for API requests
import { useAuth } from '../../context/AuthContext';
import "./SignUpForm.css";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 'user'
  });

  const { login } = useAuth(); // ✅ Use AuthContext for login
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // ✅ Redirect after successful signup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      await login(formData.username, formData.password);
      alert(response.data.message); // Show success message
      navigate("/");
    } catch (error) {
      let errorMessage = "Registration failed";
    
    if (error.response) {
      // Server responded with a status code outside 2xx
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    setErrors({ server: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="wrapper-signup">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <h3>Please fill in this form to create an account</h3>

          <div className="input-box">
            <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="input-box">
            <input type="email" name="email" placeholder="Email" onChange={handleChange}/>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-box">
            <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-box">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <div className="input-box">
            <label>Account Type:</label>
            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                User
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Administrator
              </label>
            </div>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>
          {errors.server && <p className="error server-error">{errors.server}</p>}

          <div className="register-button">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </div>
          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};
