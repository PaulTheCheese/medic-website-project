import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
/*import axios from "axios";*/
import './LoginForm.css';
import { FaUser } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Import eye icons

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await login(username, password);
            navigate("/");
            } catch (err) {
                setError("❌ Invalid username or password");
            }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="login-page">
            <div className='wrapper'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="login-subtitle">Welcome back! Please enter your details</p>

                    {error && <p className="error-message">{error}</p>}

                    <div className="input-box-login">
                        <input 
                            type="text" 
                            placeholder='Username' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box-login">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder='Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        {showPassword ? (
                            <FaEyeSlash className='icon' onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEye className='icon' onClick={togglePasswordVisibility} />
                        )}
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember Me</label>
                        <a href="#">Forgot Password</a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <Link to="/signup">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
};
